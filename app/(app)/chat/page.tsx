'use client';

import React from 'react';
import { useProjects, useProductInstances } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { Sparkles, Bot, ArrowRight } from 'lucide-react';

export default function ChatIndexPage() {
  const { data: projects } = useProjects();
  const selectedProject = projects?.[0];
  const { data: instances, isLoading } = useProductInstances(selectedProject?._id);
  const router = useRouter();

  React.useEffect(() => {
    if (instances && instances.length > 0) {
      // Auto-redirect to first instance for convenience
      // router.replace(`/chat/${instances[0]._id}`);
    }
  }, [instances]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full text-center">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-indigo-100 animate-bounce">
                <Sparkles size={40} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Choose your AI Assistant</h1>
            <p className="text-slate-500 text-lg mb-12 max-w-xl mx-auto">
                Each assistant is configured for a specific domain. Select one from the list below or the sidebar to begin.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instances?.map((instance: any) => (
                    <button 
                        key={instance._id}
                        onClick={() => router.push(`/chat/${instance._id}`)}
                        className="p-8 bg-white border border-slate-200 rounded-3xl text-left hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group"
                    >
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Bot size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-xl mb-2">{instance.displayName}</h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            Custom assistant for {instance.productType.replace('-', ' ')} workflows.
                        </p>
                        <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                            Open Assistant <ArrowRight size={16} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}
