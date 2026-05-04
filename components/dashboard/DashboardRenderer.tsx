import React from 'react';
import { 
  BarChart3, 
  Users, 
  Activity, 
  Settings, 
  LayoutDashboard, 
  Database,
  ArrowUpRight,
  Clock
} from 'lucide-react';

interface WidgetProps {
  type: string;
  title: string;
  config?: any;
}

const StatsWidget = ({ title }: { title: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
        <Activity size={18} />
      </div>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-bold text-slate-900">2,543</span>
      <span className="text-xs font-medium text-emerald-600 flex items-center">
        <ArrowUpRight size={12} /> +12%
      </span>
    </div>
  </div>
);

const ActivityWidget = ({ title }: { title: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full">
    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Clock size={16} /> {title}
    </h3>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3 text-sm">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
            <Users size={14} />
          </div>
          <div>
            <p className="text-slate-700"><span className="font-medium">User #{i}</span> started a new conversation</p>
            <p className="text-xs text-slate-400 mt-0.5">2 minutes ago</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChartWidget = ({ title }: { title: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[300px]">
    <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
        <BarChart3 size={16} /> {title}
    </h3>
    <div className="flex items-end justify-between gap-2 h-40">
        {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
            <div key={i} className="flex-1 bg-indigo-100 rounded-t-sm hover:bg-indigo-400 transition-colors cursor-pointer" style={{ height: `${h}%` }}></div>
        ))}
    </div>
    <div className="flex justify-between mt-4 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>
  </div>
);

const IntegrationsWidget = ({ title }: { title: string }) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Database size={16} /> {title}
        </h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-medium">Shopify</span>
            </div>
            <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <span className="text-xs font-medium">Salesforce</span>
            </div>
        </div>
    </div>
);

const WidgetRenderer = ({ widget }: { widget: any }) => {
  switch (widget.type) {
    case 'stats':
      return <StatsWidget title={widget.title} />;
    case 'activity':
      return <ActivityWidget title={widget.title} />;
    case 'chart':
      return <ChartWidget title={widget.title} />;
    case 'integrations':
        return <IntegrationsWidget title={widget.title} />;
    default:
      return <div className="p-4 border border-dashed rounded-lg text-slate-400 text-xs">Unknown widget: {widget.type}</div>;
  }
};

export default function ConfigDrivenDashboard({ config }: { config: any }) {
  if (!config?.sections) return null;

  return (
    <div className="space-y-12">
      {config.sections.map((section: any, sIdx: number) => (
        <div key={sIdx}>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-800">{section.title}</h2>
            <div className="h-px bg-slate-100 flex-1"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {section.widgets.map((widget: any, wIdx: number) => (
              <div key={wIdx} className={widget.type === 'chart' ? 'lg:col-span-2' : ''}>
                <WidgetRenderer widget={widget} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
