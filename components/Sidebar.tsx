
import React from 'react';
import { 
  Database, 
  Workflow, 
  Code2, 
  BarChart3, 
  Cpu, 
  Layers 
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'pipeline', label: 'ETL Pipeline', icon: Workflow },
    { id: 'explorer', label: 'Data Explorer', icon: Database },
    { id: 'schema', label: 'Star Schema', icon: Layers },
    { id: 'analytics', label: 'BI Analytics', icon: BarChart3 },
    { id: 'ai', label: 'AI Architect', icon: Cpu },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Database className="text-white" size={20} />
        </div>
        <h1 className="font-bold text-white tracking-tight">DW ARCHITECT</h1>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group ${
                isActive 
                  ? 'bg-slate-800 text-white border-l-4 border-indigo-500' 
                  : 'hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-300'} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-500">BigQuery: Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-500">dbt Cloud: Idle</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
