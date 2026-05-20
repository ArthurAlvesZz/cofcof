import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, ChevronRight, RefreshCcw } from 'lucide-react';
import { operationHealthService, OperationHealthReport } from '../../../services/operationHealthService';
import { OperationAlertCard } from './OperationAlertCard';
import { OperationHealthPanel } from './OperationHealthPanel';

interface OperationCockpitProps {
  onNavigate: (module: string) => void;
}

export function OperationCockpit({ onNavigate }: OperationCockpitProps) {
  const [report, setReport] = useState<OperationHealthReport | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await operationHealthService.getHealthReport();
      setReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center p-20">
        <RefreshCcw className="animate-spin text-[#c9a263]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-[#0a0a0a]">Cockpit Operacional</h2>
          <p className="text-sm text-[#a3a3a3] font-medium">Prioridades, pendências e saúde dos dados da CofCof.</p>
        </div>
        <button onClick={loadReport} className="text-xs font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-[#0a0a0a] flex items-center gap-1 transition-colors">
          <RefreshCcw size={14} /> Atualizar
        </button>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {report.metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-[#a3a3a3]/20 flex flex-col justify-between h-24 shadow-sm relative overflow-hidden">
             {m.status === 'critical' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>}
             {m.status === 'attention' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>}
             {m.status === 'healthy' && <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>}
             <p className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">{m.label}</p>
             <p className="text-2xl font-serif text-[#0a0a0a]">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sections Status */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-2">Visão por Área</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {report.sections.map(section => (
              <div key={section.id} className="bg-white rounded-[20px] p-5 border border-[#a3a3a3]/10 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <h4 className="font-serif text-lg text-[#0a0a0a]">{section.title}</h4>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${section.status === 'critical' ? 'bg-red-50 text-red-500' : section.status === 'attention' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'}`}>
                    {section.status === 'healthy' ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
                  </div>
                </div>
                
                <div className="flex-1">
                  {section.pendingCount > 0 ? (
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-[#0a0a0a]">{section.pendingCount} pendência(s)</p>
                      <p className="text-xs text-[#a3a3a3] leading-tight">{section.mainIssue}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#a3a3a3]">Tudo atualizado e funcional.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#a3a3a3]/10 mt-auto">
                    <button onClick={() => onNavigate(section.id)} className="text-xs font-bold uppercase tracking-widest text-[#c9a263] flex items-center gap-1 hover:text-[#0a0a0a] transition-colors w-full justify-between">
                       {section.ctaLabel} <ChevronRight size={14} />
                    </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Alerts List */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a] mb-2">Resolver Agora</h3>
          <div className="bg-[#111111] rounded-[24px] p-6 shadow-xl flex flex-col gap-3 min-h-[300px]">
             {report.alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-10 opacity-50">
                  <CheckCircle2 size={40} className="text-[#c9a263] mb-4" />
                  <p className="text-sm font-medium text-white text-center">Tudo rodando perfeitamente.</p>
                </div>
             ) : (
                <div className="flex flex-col gap-2 relative">
                  {report.alerts.map(alert => (
                     <OperationAlertCard 
                       key={alert.id}
                       id={alert.id}
                       severity={alert.severity}
                       message={alert.message}
                       actionLabel={alert.actionLabel}
                       onAction={() => onNavigate(alert.entity)}
                     />
                  ))}
                </div>
             )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <OperationHealthPanel />
      </div>
    </div>
  );
}
