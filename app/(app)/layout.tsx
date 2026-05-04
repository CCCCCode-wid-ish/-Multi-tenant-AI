'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import { useProjects, useProductInstances } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const selectedProject = projects?.[0]; // Default to first project for demo
  const { data: instances, isLoading: loadingInstances } = useProductInstances(selectedProject?._id);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/login', { method: 'DELETE' });
    router.push('/login');
  };

  if (loadingProjects) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 font-medium text-sm">Initializing project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        projects={projects}
        instances={instances}
        selectedProject={selectedProject?._id}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
