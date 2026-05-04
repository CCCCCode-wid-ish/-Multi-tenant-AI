import React from 'react';
import { Bot, User, Brain, ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MessageProps {
  message: {
    role: string;
    content: string;
    stepLogs?: any[];
  };
}

export const ChatMessage = ({ message }: MessageProps) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn(
      "flex w-full mb-8 group",
      isAssistant ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "flex max-w-[80%] gap-4",
        isAssistant ? "flex-row" : "flex-row-reverse"
      )}>
        <div className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 shadow-sm",
          isAssistant ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
        )}>
          {isAssistant ? <Bot size={18} /> : <User size={18} />}
        </div>
        
        <div className="space-y-3">
          <div className={cn(
            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
            isAssistant 
                ? "bg-white border border-slate-200 text-slate-800 rounded-tl-none" 
                : "bg-indigo-600 text-white rounded-tr-none"
          )}>
            {message.content}
          </div>

          {/* AI Step Logs */}
          {isAssistant && message.stepLogs && message.stepLogs.length > 0 && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  <Brain size={12} /> Execution Logs
               </div>
               {message.stepLogs.map((log: any, idx: number) => (
                 <div key={idx} className="flex items-start gap-2 text-xs text-slate-500">
                    <ChevronRight size={12} className="mt-0.5 text-indigo-400" />
                    <div>
                        <span className="font-semibold text-slate-700">{log.label}</span>
                        {log.detail && <span className="ml-1 opacity-70">— {log.detail}</span>}
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ChatInput = ({ onSend, disabled }: { onSend: (val: string) => void, disabled?: boolean }) => {
    const [val, setVal] = React.useState('');
    const [isThrottled, setIsThrottled] = React.useState(false);
    const throttleTimerRef = React.useRef<NodeJS.Timeout>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!val.trim() || disabled || isThrottled) return;
        
        // Throttle: prevent sending more than one message per 2 seconds
        setIsThrottled(true);
        onSend(val);
        setVal('');
        
        throttleTimerRef.current = setTimeout(() => {
            setIsThrottled(false);
        }, 2000);
    };

    React.useEffect(() => {
        return () => {
            if (throttleTimerRef.current) {
                clearTimeout(throttleTimerRef.current);
            }
        };
    }, []);

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200">
            <div className="max-w-4xl mx-auto flex gap-3">
                <input 
                    type="text" 
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    placeholder="Ask something..."
                    disabled={disabled || isThrottled}
                    className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none disabled:opacity-60"
                />
                <button 
                    type="submit"
                    disabled={disabled || !val.trim() || isThrottled}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-200"
                    title={isThrottled ? "Please wait before sending another message" : "Send message"}
                >
                    Send
                </button>
            </div>
        </form>
    );
}
