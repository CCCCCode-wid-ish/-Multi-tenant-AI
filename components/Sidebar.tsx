import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Plus, 
  ChevronDown, 
  LogOut,
  Box,
  Settings
} from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar({ 
    projects, 
    instances, 
    selectedProject, 
    selectedInstance,
    onLogout 
}: any) {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-slate-900 h-screen flex flex-col text-slate-300">
      <div className="p-6">
        <div className="flex items-center gap-3 text-white mb-8">
            <div className="bg-indigo-500 p-2 rounded-xl">
                <Box size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Platform</span>
        </div>

        <nav className="space-y-1">
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === '/admin' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link 
            href="/chat" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.startsWith('/chat') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <MessageSquare size={20} />
            <span className="text-sm font-medium">Assistants</span>
          </Link>
        </nav>
      </div>

      <div className="mt-4 px-6 overflow-y-auto flex-1">
        <div className="mb-6">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-4">Available Assistants</h3>
            <div className="space-y-1">
                {instances?.map((instance: any) => (
                    <Link 
                        key={instance._id}
                        href={`/chat/${instance._id}`}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${selectedInstance === instance._id ? 'bg-slate-800 text-white' : 'hover:text-white'}`}
                    >
                        <div className={`w-2 h-2 rounded-full ${selectedInstance === instance._id ? 'bg-indigo-400' : 'bg-slate-600'}`}></div>
                        {instance.displayName}
                    </Link>
                ))}
            </div>
        </div>
      </div>

      <div className="p-6 border-t border-slate-800">
        <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium"
        >
            <LogOut size={20} />
            Logout
        </button>
      </div>
    </div>
  );
}
