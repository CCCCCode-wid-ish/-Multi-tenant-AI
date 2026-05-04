'use client';

import React from 'react';
import { useProjects, useDashboardConfig } from '@/hooks/useApi';
import DashboardRenderer from '@/components/dashboard/DashboardRenderer';
import { LayoutDashboard, AlertCircle, RefreshCcw } from 'lucide-react';

export default function AdminDashboard() {
  const { data: projects } = useProjects();
  const selectedProject = projects?.[0];
  const { data: config, isLoading, error, refetch } = useDashboardConfig(selectedProject?._id);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <LayoutDashboard size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">Admin Control</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Project Overview</h1>
            <p className="text-slate-500 mt-2">Manage your AI assistants and monitor performance across {selectedProject?.name}.</p>
        </div>

        <button 
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh Data
        </button>
      </header>

      {isLoading ? (
        <div className="space-y-12 animate-pulse">
            <div className="h-8 bg-slate-200 w-1/4 rounded-lg"></div>
            <div className="grid grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>)}
            </div>
            <div className="h-8 bg-slate-200 w-1/4 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-6">
                <div className="h-64 bg-slate-200 rounded-xl"></div>
                <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 p-8 rounded-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-red-900">Access Denied</h2>
            <p className="text-red-700 mt-2 max-w-md">
                {(error as any).message || 'You do not have administrative privileges for this project dashboard.'}
            </p>
            <p className="text-red-500 text-xs mt-6 font-medium bg-red-100/50 px-4 py-2 rounded-lg italic">
                Only users with the "admin" role can access this configuration-driven dashboard.
            </p>
        </div>
      ) : (
        <DashboardRenderer config={config} />
      )}
    </div>
  );
}
