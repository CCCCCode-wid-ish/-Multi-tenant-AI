'use client';

import React from 'react';
import { useProjects, useProductInstances, useConversations, useMessages, useChat } from '@/hooks/useApi';
import { useParams } from 'next/navigation';
import { ChatMessage, ChatInput } from '@/components/chat/ChatInterface';
import { 
    Plus, 
    MessageCircle, 
    Sparkles, 
    Bot, 
    ChevronRight,
    Info,
    History,
    AlertCircle,
    RotateCw
} from 'lucide-react';

export default function ChatPage() {
  const params = useParams();
  const instanceId = params.id as string;
  
  const { data: projects } = useProjects();
  const selectedProject = projects?.[0];
  
  const { data: instances } = useProductInstances(selectedProject?._id);
  const currentInstance = instances?.find((i: any) => i._id === instanceId);

  const { data: conversations, refetch: refetchConvs } = useConversations(selectedProject?._id, instanceId);
  const [activeConvId, setActiveConvId] = React.useState<string | null>(null);

  const { data: messages, isLoading: loadingMessages } = useMessages(activeConvId || undefined);
  const chatMutation = useChat();

  // Scroll to bottom on new messages
  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatMutation.isPending]);

  const handleSendMessage = async (val: string) => {
    let convId = activeConvId;
    
    // Auto-create conversation if none active
    if (!convId) {
        const res = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                projectId: selectedProject?._id,
                productInstanceId: instanceId,
                title: val.substring(0, 30) + '...'
            })
        });
        const json = await res.json();
        convId = json.data._id;
        setActiveConvId(convId);
        refetchConvs();
    }

    chatMutation.mutate({ conversationId: convId!, message: val });
  };

  // Detect if error is rate limit related
  const isRateLimit = chatMutation.error instanceof Error && 
    (chatMutation.error.message.includes('too many requests') ||
     chatMutation.error.message.includes('quota') ||
     chatMutation.error.message.includes('429'));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Conversation History Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
            <button 
                onClick={() => setActiveConvId(null)}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-100 mb-6"
            >
                <Plus size={18} />
                New Chat
            </button>

            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                <History size={12} /> Recent History
            </div>

            <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-2">
                {conversations?.map((conv: any) => (
                    <button 
                        key={conv._id}
                        onClick={() => setActiveConvId(conv._id)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 group ${activeConvId === conv._id ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100' : 'hover:bg-slate-50 text-slate-600'}`}
                    >
                        <MessageCircle size={16} className={activeConvId === conv._id ? 'text-indigo-600' : 'text-slate-400'} />
                        <span className="truncate flex-1">{conv.title}</span>
                    </button>
                ))}
            </div>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400">
                    <Info size={16} />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-slate-700">Multi-tenant Context</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        Messages are isolated to this project. AI context includes specific project mock data.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                    <Bot size={24} />
                </div>
                <div>
                    <h1 className="font-bold text-slate-900">{currentInstance?.displayName || 'AI Assistant'}</h1>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-slate-400">Operational — Model: Gemini 1.5 Flash</span>
                    </div>
                </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    Type: {currentInstance?.productType}
                </span>
                <span className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">
                    Namespace: {currentInstance?.nameSpace}
                </span>
            </div>
        </header>

        {/* Message Thread */}
        <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8"
        >
            <div className="max-w-4xl mx-auto">
                {/* Rate Limit Warning */}
                {(chatMutation.isPending && chatMutation.status === 'pending') && (
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 animate-pulse">
                        <RotateCw size={18} className="text-amber-600 mt-0.5 animate-spin" />
                        <div>
                            <p className="font-semibold text-amber-900 text-sm">Retrying request...</p>
                            <p className="text-xs text-amber-700 mt-1">
                                We're experiencing high demand. Automatically retrying your message with exponential backoff.
                            </p>
                        </div>
                    </div>
                )}

                {isRateLimit && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                        <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-red-900 text-sm">API Rate Limit Reached</p>
                            <p className="text-xs text-red-700 mt-1">
                                The Gemini API is temporarily overwhelmed. Please wait a moment and try again.
                            </p>
                            <button 
                                onClick={() => {
                                    if (activeConvId && messages && messages.length > 0) {
                                        const lastMsg = messages[messages.length - 1];
                                        if (lastMsg.role === 'user') {
                                            handleSendMessage(lastMsg.content);
                                        }
                                    }
                                }}
                                className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
                            >
                                <RotateCw size={12} />
                                Retry Now
                            </button>
                        </div>
                    </div>
                )}
                {!activeConvId ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-20">
                        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6">
                            <Sparkles size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Start a new conversation</h2>
                        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
                            I'm configured for {currentInstance?.displayName}. Send a message to begin!
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-2xl text-left">
                            {[
                                "Tell me about recent orders",
                                "How many leads are in the CRM?",
                                "What can you do for this project?",
                                "Analyze current customer health"
                            ].map((q, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleSendMessage(q)}
                                    className="p-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-600 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex items-center justify-between group"
                                >
                                    {q}
                                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages?.map((msg: any) => (
                            <ChatMessage key={msg._id} message={msg} />
                        ))}
                        {chatMutation.isPending && (
                            <div className="flex justify-start mb-8 animate-pulse">
                                <div className="flex max-w-[80%] gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                                        <Bot size={18} className="text-indigo-300" />
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>

        {/* Input Area */}
        <ChatInput 
            onSend={handleSendMessage} 
            disabled={chatMutation.isPending}
        />
      </div>
    </div>
  );
}
