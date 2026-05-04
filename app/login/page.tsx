'use client';

import React from 'react';
import { useLogin } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import { Box, ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = React.useState('admin@project1.com');
  const login = useLogin();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync(email);
      router.push('/admin');
    } catch (err) {
      alert('Login failed. Did you run the seed script?');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-indigo-600 rounded-2xl text-white mb-6 shadow-xl shadow-indigo-100">
            <Box size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your project workspace</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 mb-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                placeholder="name@company.com"
                required
                suppressHydrationWarning={true}
              />
            </div>
            
            <button 
              type="submit"
              disabled={login.isPending}
              suppressHydrationWarning={true}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {login.isPending ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-xs text-center text-slate-400 font-medium mb-4">MOCK LOGIN OPTIONS (RUN SEED FIRST)</p>
            <div className="space-y-2">
                {[
                    { label: 'Admin - Project 1', email: 'admin@project1.com' },
                    { label: 'Member - Project 1', email: 'member@project1.com' },
                    { label: 'Admin - Project 2', email: 'admin@project2.com' }
                ].map((opt) => (
                    <button 
                        key={opt.email}
                        type="button"
                        onClick={async () => {
                            setEmail(opt.email);
                            try {
                                await login.mutateAsync(opt.email);
                                router.push('/admin');
                            } catch (err) {
                                alert('Login failed. Did you run the seed script?');
                            }
                        }}
                        suppressHydrationWarning={true}
                        className="w-full text-left px-4 py-2 text-xs rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition-all border border-transparent hover:border-indigo-100 flex items-center justify-between group"
                    >
                        <span className="font-medium">{opt.label}</span>
                        <span className="text-indigo-500 font-mono opacity-60 group-hover:opacity-100">{opt.email}</span>
                    </button>
                ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <ShieldCheck size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Secure</span>
            </div>
            <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <Zap size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fast</span>
            </div>
            <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <Globe size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Global</span>
            </div>
        </div>
      </div>
    </div>
  );
}
