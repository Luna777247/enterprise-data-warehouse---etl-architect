
import React from 'react';
import { ArrowRight, Database, Table, Zap, CheckCircle2 } from 'lucide-react';

const PipelineFlow: React.FC = () => {
  const steps = [
    {
      id: 'ext',
      title: 'Extract',
      desc: 'API / CSV / PostgreSQL',
      icon: Database,
      color: 'bg-blue-500',
      status: 'success'
    },
    {
      id: 'land',
      title: 'Landing',
      desc: 'Raw JSON/CSV in GCS',
      icon: Layers,
      color: 'bg-slate-500',
      status: 'success'
    },
    {
      id: 'trans',
      title: 'Transform',
      desc: 'dbt models / SQL',
      icon: Zap,
      color: 'bg-yellow-500',
      status: 'active'
    },
    {
      id: 'load',
      title: 'Load',
      desc: 'Star Schema tables',
      icon: Table,
      color: 'bg-indigo-600',
      status: 'pending'
    }
  ];

  return (
    <div className="py-8 px-4 flex items-center justify-between max-w-5xl mx-auto">
      {steps.map((step, idx) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center group">
            <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110`}>
              <step.icon className="text-white" size={28} />
              {step.status === 'success' && (
                <div className="absolute -top-1 -right-1 bg-white rounded-full">
                  <CheckCircle2 className="text-green-500" size={20} />
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <h4 className="font-bold text-slate-800 text-sm">{step.title}</h4>
              <p className="text-slate-500 text-[11px] mt-1 max-w-[120px] leading-tight">{step.desc}</p>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex-1 h-px bg-slate-200 relative mx-4">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                <ArrowRight size={14} className="text-slate-300" />
              </div>
              <div className={`absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-1000 ${step.status === 'success' ? 'w-full' : 'w-0 animate-pulse'}`}></div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

import { Layers } from 'lucide-react';
export default PipelineFlow;
