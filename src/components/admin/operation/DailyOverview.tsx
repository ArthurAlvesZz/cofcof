import React, { useState } from 'react';
import { Calendar, Package, Flame, Target, Layers, Handshake, AlertTriangle, Zap, ArrowRight, History } from 'lucide-react';
import { format } from 'date-fns';

interface DailyOverviewProps {
  dates: {start: Date, end: Date};
  stats: any;
  onAction?: (action: string) => void;
}

export function DailyOverview({ dates, stats, onAction }: DailyOverviewProps) {
  const hasEvents = stats?.operationalEventsCount > 0 || (stats?.roastedKgInPeriod > 0) || (stats?.rawLotsLaunchedInPeriod > 0);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="border-b border-[#a3a3a3]/10 pb-4 mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif text-[#0a0a0a]">Diário Operacional</h2>
            <p className="text-sm text-[#a3a3a3] font-medium mt-1">Linha do tempo e registros de atividades.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-[#a3a3a3]/20 shadow-sm">
             <Calendar size={16} className="text-[#c9a263]" />
             <span className="text-xs font-bold text-[#0a0a0a]">
                {format(dates.start, "dd/MM/yyyy")} {dates.start.toDateString() !== dates.end.toDateString() && `- ${format(dates.end, "dd/MM/yyyy")}`}
             </span>
          </div>
      </div>

      {!hasEvents ? (
         <div className="bg-white rounded-[24px] p-12 flex flex-col items-center justify-center text-center shadow-sm border border-[#a3a3a3]/10 min-h-[400px]">
             <div className="w-16 h-16 bg-[#fcfaf8] rounded-full flex items-center justify-center text-[#c9a263] border border-[#c9a263]/20 mb-6 shrink-0">
                 <History size={24} />
             </div>
             <h3 className="text-xl font-serif text-[#0a0a0a] mb-2">Nenhuma movimentação registrada neste período.</h3>
             <p className="text-sm text-[#a3a3a3] max-w-md mx-auto mb-8">
                 Tudo tranquilo por enquanto. Quando houver entrada de lotes, torras, empacotamento ou saídas, elas aparecerão aqui.
             </p>
             <button onClick={() => onAction?.('launch_lot')} className="flex items-center gap-2 bg-[#0a0a0a] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#c9a263] transition-all shadow-sm active:scale-95">
                 <Zap size={16} />
                 Registrar primeira movimentação
             </button>
         </div>
      ) : (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white rounded-[24px] p-6 sm:p-8 shadow-sm border border-[#a3a3a3]/10 relative">
                 <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-6">Timeline de Operações</h3>
                 
                 <div className="relative border-l border-[#a3a3a3]/20 ml-2 sm:ml-4 space-y-8 pb-4">
                     {/* Simulando eventos baseados nas stats globais */}
                     {(stats?.rawLotsLaunchedInPeriod > 0) && (
                         <div className="relative pl-6 sm:pl-8">
                             <div className="absolute -left-3 pt-1">
                                 <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                                     <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                                 </div>
                             </div>
                             <p className="text-[10px] font-bold text-[#a3a3a3] bg-[#fcfaf8] px-2 py-0.5 rounded inline-block mb-1 border border-[#a3a3a3]/10">LOTE CRU</p>
                             <p className="text-sm font-bold text-[#0a0a0a]">Entrada de café cru registrada</p>
                             <p className="text-xs font-medium text-[#a3a3a3] mt-1">{stats?.rawLotsLaunchedInPeriod} lote(s) • {stats?.rawKgPurchasedInPeriod}kg no período</p>
                         </div>
                     )}
                     
                     {(stats?.roastedKgInPeriod > 0) && (
                         <div className="relative pl-6 sm:pl-8">
                             <div className="absolute -left-3 pt-1">
                                 <div className="w-6 h-6 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center">
                                     <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                                 </div>
                             </div>
                             <p className="text-[10px] font-bold text-[#a3a3a3] bg-[#fcfaf8] px-2 py-0.5 rounded inline-block mb-1 border border-[#a3a3a3]/10">PRODUÇÃO</p>
                             <p className="text-sm font-bold text-[#0a0a0a]">Sessão de torra realizada</p>
                             <p className="text-xs font-medium text-[#a3a3a3] mt-1">{stats?.roastsCountInPeriod} torra(s) • {stats?.roastedKgInPeriod}kg processados</p>
                         </div>
                     )}

                     {(stats?.packagedUnitsInPeriod > 0) && (
                         <div className="relative pl-6 sm:pl-8">
                             <div className="absolute -left-3 pt-1">
                                 <div className="w-6 h-6 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                                     <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                                 </div>
                             </div>
                             <p className="text-[10px] font-bold text-[#a3a3a3] bg-[#fcfaf8] px-2 py-0.5 rounded inline-block mb-1 border border-[#a3a3a3]/10">EMPACOTAMENTO</p>
                             <p className="text-sm font-bold text-[#0a0a0a]">Produto finalizado em estoque</p>
                             <p className="text-xs font-medium text-[#a3a3a3] mt-1">{stats?.packagedUnitsInPeriod} pacotes embalados</p>
                         </div>
                     )}
                     
                     {(stats?.criticalAlertsCount > 0) && (
                         <div className="relative pl-6 sm:pl-8">
                             <div className="absolute -left-3 pt-1">
                                 <div className="w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                                     <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                 </div>
                             </div>
                             <p className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded inline-block mb-1 border border-red-100">ALERTA</p>
                             <p className="text-sm font-bold text-red-600">Alerta(s) gerados na operação</p>
                             <p className="text-xs font-medium text-red-400 mt-1">{stats?.criticalAlertsCount} pendências registradas para correção.</p>
                         </div>
                     )}
                     
                     {/* End of timeline cap */}
                     <div className="relative pl-8 mt-4">
                        <div className="absolute -left-[5px] top-0 w-3 h-3 bg-[#a3a3a3]/20 rounded-full"></div>
                     </div>
                 </div>
             </div>

             <div className="flex flex-col gap-4">
                 <div className="bg-[#111111] rounded-[24px] p-6 shadow-sm border border-[#c9a263]/20">
                     <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-6">Resumo Quantitativo</h3>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#a3a3a3]/10">
                            <Target size={16} className="text-[#a3a3a3] mb-2" />
                            <p className="text-xs font-medium text-[#a3a3a3] mb-1">Café Cru</p>
                            <p className="text-xl font-serif text-white">{stats?.rawKgPurchasedInPeriod || 0}kg</p>
                         </div>
                         <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#a3a3a3]/10">
                            <Flame size={16} className="text-[#c9a263] mb-2" />
                            <p className="text-xs font-medium text-[#a3a3a3] mb-1">Torrado</p>
                            <p className="text-xl font-serif text-white">{stats?.roastedKgInPeriod || 0}kg</p>
                         </div>
                         <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#a3a3a3]/10">
                            <Package size={16} className="text-[#c9a263] mb-2" />
                            <p className="text-xs font-medium text-[#a3a3a3] mb-1">Pacotes</p>
                            <p className="text-xl font-serif text-white">{stats?.packagedUnitsInPeriod || 0} un</p>
                         </div>
                         <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#a3a3a3]/10">
                            <Handshake size={16} className="text-[#a3a3a3] mb-2" />
                            <p className="text-xs font-medium text-[#a3a3a3] mb-1">Consignado</p>
                            <p className="text-xl font-serif text-white">{stats?.consignedInPeriod || 0} un</p>
                         </div>
                     </div>
                 </div>
                 
                 <button onClick={() => onAction?.('launch_lot')} className="w-full bg-white border border-[#a3a3a3]/20 text-[#0a0a0a] rounded-xl p-4 font-bold text-xs uppercase tracking-widest hover:border-[#0a0a0a] hover:bg-[#fafafa] transition-all flex items-center justify-between group">
                     Registrar nova entrada
                     <div className="w-6 h-6 rounded-full border border-[#a3a3a3]/20 flex items-center justify-center text-[#a3a3a3] group-hover:bg-[#0a0a0a] group-hover:text-white transition-all">
                         <ArrowRight size={12} />
                     </div>
                 </button>
             </div>
         </div>
      )}
    </div>
  );
}
