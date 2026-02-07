
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import PipelineFlow from './components/PipelineFlow';
import SchemaDiagram from './components/SchemaDiagram';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { 
  RAW_SALES_DATA, 
  DIM_PRODUCTS, 
  FACT_SALES, 
  DBT_MODELS 
} from './mockData';
import { ViewType, Table, DbtModel, PipelineLog } from './types';
import { askDataArchitect } from './services/geminiService';
import { 
  Code2, 
  FileJson, 
  ShieldCheck, 
  Search, 
  Database,
  Send,
  Loader2,
  Terminal,
  Activity,
  Cpu,
  BarChart,
  Filter,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('pipeline');
  const [selectedTable, setSelectedTable] = useState<Table>(RAW_SALES_DATA);
  const [selectedDbtModel, setSelectedDbtModel] = useState<DbtModel>(DBT_MODELS[0]);
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [pipelineLogs, setPipelineLogs] = useState<PipelineLog[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [pipelineLogs]);

  const runPipeline = () => {
    setIsPipelineRunning(true);
    setPipelineLogs([]);
    const messages: {m: string, l: 'INFO' | 'WARN' | 'ERROR', d: number}[] = [
      { m: 'Starting ETL Job: SALES_INGESTION_PROD', l: 'INFO', d: 500 },
      { m: 'Fetching data from Salesforce API...', l: 'INFO', d: 1500 },
      { m: 'Extract complete: 15,402 records retrieved.', l: 'INFO', d: 1000 },
      { m: 'Running dbt build --select tag:daily_sales', l: 'INFO', d: 800 },
      { m: 'Model stg_sales: OK created table', l: 'INFO', d: 1200 },
      { m: 'Data Quality Warning: 2% null values in cust_id', l: 'WARN', d: 500 },
      { m: 'Model fct_sales: OK created table', l: 'INFO', d: 1500 },
      { m: 'Tests passed: 12/12 requirements met', l: 'INFO', d: 700 },
      { m: 'Pipeline finished successfully.', l: 'INFO', d: 300 },
    ];

    let currentDelay = 0;
    messages.forEach((msg, idx) => {
      currentDelay += msg.d;
      setTimeout(() => {
        setPipelineLogs(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString(),
          level: msg.l,
          message: msg.m
        }]);
        if (idx === messages.length - 1) setIsPipelineRunning(false);
      }, currentDelay);
    });
  };

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsAiLoading(true);
    setAiResponse(null);
    
    // Enrich prompt with current context
    const contextPrompt = `Context: The user is looking at table ${selectedTable.name} of type ${selectedTable.type}. 
    Columns: ${selectedTable.columns.map(c => `${c.name} (${c.type})`).join(', ')}.
    User Question: ${prompt}`;

    const result = await askDataArchitect(contextPrompt);
    setAiResponse(result);
    setIsAiLoading(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'pipeline':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Pipeline Lineage</h2>
                  <p className="text-slate-500 text-sm">Automated ETL flow from ingestion to serving layer</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={runPipeline}
                    disabled={isPipelineRunning}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {isPipelineRunning ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
                    Run Pipeline
                  </button>
                </div>
              </div>
              <PipelineFlow />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 text-slate-300">
                <div className="flex items-center gap-2 mb-4">
                  <Terminal className="text-indigo-400" size={18} />
                  <h3 className="font-bold text-white uppercase text-xs tracking-widest">Real-time Execution Logs</h3>
                </div>
                <div className="mono text-[11px] space-y-1.5 overflow-y-auto h-80 bg-slate-950 p-4 rounded-lg border border-slate-800 scrollbar-hide">
                  {pipelineLogs.length === 0 && (
                    <p className="text-slate-600 italic">Waiting for pipeline execution...</p>
                  )}
                  {pipelineLogs.map((log, i) => (
                    <div key={i} className="flex gap-3 border-l border-slate-800 pl-3">
                      <span className="text-slate-500 shrink-0">{log.timestamp}</span>
                      <span className={`font-bold shrink-0 ${
                        log.level === 'INFO' ? 'text-indigo-400' : 
                        log.level === 'WARN' ? 'text-amber-400' : 'text-rose-400'
                      }`}>[{log.level}]</span>
                      <span className="text-slate-300">{log.message}</span>
                    </div>
                  ))}
                  <div ref={logEndRef} />
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck className="text-emerald-500" size={18} />
                  <h3 className="font-bold text-slate-800">Quality Controls & SLA</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { n: 'Source Freshness', s: 'Pass', t: '< 15 mins' },
                    { n: 'Volume Variance', s: 'Pass', t: '± 5%' },
                    { n: 'Schema Validation', s: 'Pass', t: 'Strict' },
                    { n: 'SLA Availability', s: 'Pass', t: '99.9%' }
                  ].map((check) => (
                    <div key={check.n} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="text-emerald-500" size={16} />
                        <div>
                          <p className="text-sm text-slate-800 font-semibold">{check.n}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Target: {check.t}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg">OPERATIONAL</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'explorer':
        return (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-500">
            <div className="flex h-[750px]">
              <div className="w-72 border-r border-slate-100 p-6 space-y-8 bg-slate-50/50">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Data Catalog</h4>
                  <div className="space-y-2">
                    {[RAW_SALES_DATA, DIM_PRODUCTS, FACT_SALES].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTable(t)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-between group ${
                          selectedTable.id === t.id 
                            ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200 font-bold' 
                            : 'text-slate-600 hover:bg-white hover:text-indigo-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Database size={16} className={selectedTable.id === t.id ? 'text-indigo-500' : 'text-slate-400'} />
                          {t.name}
                        </div>
                        {selectedTable.id === t.id && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Table Insights</h4>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Rows Count</p>
                      <p className="text-lg font-bold text-slate-800">2.4M+</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Storage Size</p>
                      <p className="text-lg font-bold text-slate-800">1.2 GB</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-slate-900">{selectedTable.name}</h3>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <div className="flex gap-2">
                       <span className="text-[10px] px-2 py-1 rounded bg-indigo-50 text-indigo-700 font-bold uppercase border border-indigo-100">
                         {selectedTable.type}
                       </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200">
                      <Filter size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200">
                      <BarChart size={18} />
                    </button>
                  </div>
                </div>

                {/* Profiling Strip */}
                <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex gap-8 overflow-x-auto scrollbar-hide">
                  {selectedTable.columns.map(col => (
                    <div key={col.name} className="shrink-0">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">{col.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full" style={{ width: `${100 - (col.stats?.nullPercentage || 0)}%` }}></div>
                        </div>
                        <span className="text-[10px] text-slate-600 font-mono">{(col.stats?.nullPercentage || 0)}% Null</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                      <tr>
                        {selectedTable.columns.map((col) => (
                          <th key={col.name} className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider group cursor-help">
                            <div className="flex items-center gap-2">
                              {col.name}
                              <Info size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="block text-[8px] font-normal text-slate-400 lowercase mt-1">{col.type}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedTable.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/30 transition-colors group">
                          {selectedTable.columns.map((col) => (
                            <td key={col.name} className="px-6 py-4 text-xs text-slate-600 mono whitespace-nowrap">
                              {row[col.name]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'schema':
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <SchemaDiagram />
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-800">dbt Core Model Definitions</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Transformation Graph</h4>
                  {DBT_MODELS.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => setSelectedDbtModel(m)}
                      className={`w-full text-left px-4 py-4 rounded-2xl border transition-all relative ${
                        selectedDbtModel.name === m.name 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                          : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Code2 size={16} className={selectedDbtModel.name === m.name ? 'text-indigo-200' : 'text-slate-400'} />
                        <span className="text-sm font-bold truncate">{m.name}.sql</span>
                      </div>
                      <div className={`text-[10px] mt-2 leading-relaxed opacity-80 ${selectedDbtModel.name === m.name ? 'text-white' : 'text-slate-400'}`}>
                        {m.description}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                    <div className="flex bg-slate-800/50 px-4 pt-4">
                      <div className="bg-slate-900 rounded-t-xl px-6 py-3 text-xs font-bold text-indigo-400 flex items-center gap-2 border-t border-x border-slate-800">
                        <Terminal size={14} /> {selectedDbtModel.name}.sql
                      </div>
                      <div className="px-6 py-3 text-xs font-medium text-slate-500 hover:text-slate-300 flex items-center gap-2 cursor-pointer transition-colors">
                        <FileJson size={14} /> schema.yml
                      </div>
                    </div>
                    <div className="p-8 mono text-[13px] leading-relaxed overflow-x-auto text-indigo-100/90 h-[400px]">
                      <code dangerouslySetInnerHTML={{ __html: selectedDbtModel.sql.replace(/SELECT|FROM|WITH|AS|CAST|LEFT JOIN|GROUP BY|ORDER BY|{{|}}/g, match => `<span class="text-indigo-400 font-bold">${match}</span>`) }}></code>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-4 text-emerald-800 font-bold text-sm">
                        <CheckCircle size={18} /> Data Tests
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDbtModel.tests.map(test => (
                          <div key={test} className="px-3 py-1.5 bg-white text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100 shadow-sm uppercase">
                            {test}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-sm">
                        <AlertCircle size={18} className="text-slate-400" /> Warnings
                      </div>
                      <p className="text-xs text-slate-500 italic">No violations detected in the last production run.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return <AnalyticsDashboard />;

      case 'ai':
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 pb-10">
            <div className="text-center mb-12">
              <div className="inline-flex p-5 rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-200 mb-6">
                <Cpu size={48} className="text-white" />
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Data Architect</h2>
              <p className="text-slate-500 mt-3 text-lg">Phòng tư vấn kiến trúc DW cao cấp dành cho doanh nghiệp</p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
              <div className="p-10">
                <form onSubmit={handleAiAsk} className="relative mb-10">
                  <div className="absolute -top-3 left-6 px-3 bg-white text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Architectural Prompt</div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Hãy hỏi tôi về cách thiết kế Star Schema, SCD Type 2, partitioning trong BigQuery hay tối ưu hóa dbt models..."
                    className="w-full h-40 p-8 pt-10 rounded-3xl bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:ring-0 focus:outline-none text-slate-800 placeholder:text-slate-400 transition-all text-lg leading-relaxed shadow-inner"
                  />
                  <button
                    disabled={isAiLoading}
                    type="submit"
                    className="absolute bottom-6 right-6 bg-indigo-600 text-white px-8 py-4 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 font-bold"
                  >
                    {isAiLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                    Tư vấn ngay
                  </button>
                </form>

                {aiResponse && (
                  <div className="animate-in slide-in-from-bottom-8 duration-700 p-10 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl relative">
                    <div className="absolute top-6 right-8 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                      <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3 mb-8 text-indigo-400 font-bold uppercase text-xs tracking-widest">
                      <Cpu size={20} /> Recommendations for {selectedTable.name}
                    </div>
                    <div className="prose prose-invert max-w-none text-slate-300 text-[15px] leading-relaxed space-y-4">
                       {aiResponse.split('\n').map((line, i) => (
                         <p key={i}>{line}</p>
                       ))}
                    </div>
                  </div>
                )}
                
                {!aiResponse && !isAiLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Làm thế nào để xử lý SCD Type 2 cho bảng khách hàng?",
                      "Gợi ý chiến lược Partitioning & Clustering cho bảng Sales",
                      "Thiết kế Surrogate Keys bằng dbt_utils hiệu quả",
                      "Tối ưu hóa performance cho các bảng Fact lớn"
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setPrompt(suggestion)}
                        className="text-left px-6 py-4 rounded-2xl border-2 border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/50 text-sm font-semibold text-slate-600 transition-all group flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-indigo-400 transition-colors"></div>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 ml-64 p-10">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Status:</span>
               <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-tighter">Healthy</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {currentView === 'pipeline' && 'ETL Execution Engine'}
              {currentView === 'explorer' && 'Data Profiler & Explorer'}
              {currentView === 'schema' && 'Model Governance'}
              {currentView === 'analytics' && 'Operational BI'}
              {currentView === 'ai' && 'AI Data Architect'}
            </h1>
          </div>
          
          <div className="flex items-center gap-6 pb-1">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative group">
                  <img src={`https://picsum.photos/seed/${i + 40}/64/64`} className="w-10 h-10 rounded-2xl border-2 border-white shadow-sm transition-transform group-hover:-translate-y-1" alt="Team" />
                </div>
              ))}
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <button className="bg-white p-3 text-slate-400 hover:text-indigo-600 rounded-xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <Search size={20} />
            </button>
          </div>
        </header>

        <div className="max-w-[1400px] mx-auto">
          {renderContent()}
        </div>

        {/* Floating status indicator */}
        <div className="fixed bottom-8 right-8 flex items-center gap-4 bg-slate-900 px-6 py-4 rounded-2xl shadow-2xl border border-slate-800 z-50 text-white animate-in slide-in-from-right-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
              <div className="absolute inset-0 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Data Warehouse</span>
              <span className="text-xs font-bold tracking-tight">Active Connection: Snowflake_PROD</span>
            </div>
          </div>
          <div className="w-px h-6 bg-slate-800"></div>
          <div className="text-[10px] font-medium text-slate-400">v2.4.1-stable</div>
        </div>
      </main>
    </div>
  );
};

export default App;
