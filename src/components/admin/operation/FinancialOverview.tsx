import React, { useState } from 'react';
import { DollarSign, AlertCircle, ArrowUpRight, ArrowDownRight, Briefcase, Info, Filter, X, Zap } from 'lucide-react';

interface FinancialOverviewProps {
  stats: any;
  onAction?: (action: string) => void;
}

type FinancialFilter = 'all' | 'receivables' | 'payables' | 'stock';

export function FinancialOverview({ stats, onAction }: FinancialOverviewProps) {
  const [activeFilter, setActiveFilter] = useState<FinancialFilter>('all');

  const showReceivables = activeFilter === 'all' || activeFilter === 'receivables';
  const showPayables = activeFilter === 'all' || activeFilter === 'payables';
  const showStock = activeFilter === 'all' || activeFilter === 'stock';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Internal Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#a3a3a3]/10">
          <Filter size={14} className="text-[#a3a3a3] mr-2 shrink-0" />
          <button 
             onClick={() => setActiveFilter('all')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeFilter === 'all' ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
          >
              Geral
          </button>
          <button 
             onClick={() => setActiveFilter('receivables')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeFilter === 'receivables' ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
          >
              A Receber
          </button>
          <button 
             onClick={() => setActiveFilter('payables')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeFilter === 'payables' ? 'bg-red-50 text-red-600 border border-transparent' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-red-200 hover:text-red-500'}`}
          >
              A Pagar
          </button>
          <button 
             onClick={() => setActiveFilter('stock')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap ${activeFilter === 'stock' ? 'bg-[#c9a263]/10 text-[#c9a263] border border-transparent' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#c9a263]/40 hover:text-[#c9a263]'}`}
          >
              Capex (Estoque)
          </button>
      </div>

      {activeFilter !== 'all' && (
         <div className="bg-[#fcfaf8] border border-[#c9a263]/20 rounded-xl p-3 flex items-center justify-between mb-4 animate-in slide-in-from-top-2">
             <p className="text-[11px] font-bold text-[#c9a263] uppercase tracking-widest flex items-center gap-2">
                <Info size={14} /> Somente exibindo painéis filtrados
             </p>
             <button onClick={() => setActiveFilter('all')} className="flex items-center gap-1 text-[10px] font-bold text-[#0a0a0a] uppercase tracking-widest hover:text-[#c9a263] transition-colors">
                 Ver tudo <X size={12} />
             </button>
         </div>
      )}

      <div className="flex items-center justify-between">
         <h2 className="text-sm font-serif text-[#0a0a0a]">Painel Financeiro</h2>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${(!showReceivables && !showPayables) ? 'hidden' : ''}`}>
         {/* Pending Receivables */}
         {showReceivables && (
         <div className={`bg-white border border-[#a3a3a3]/10 rounded-[24px] p-8 shadow-sm flex flex-col justify-between ${showPayables ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
             <div>
                 <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 bg-[#0a0a0a] rounded-xl text-white flex items-center justify-center">
                         <DollarSign size={24} />
                     </div>
                     <div>
                         <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest">Total a Receber</p>
                         <p className="text-3xl font-serif text-[#0a0a0a]">R$ {stats?.totalPendingValue?.toLocaleString('pt-BR') || '0,00'}</p>
                     </div>
                 </div>

                 <div className="space-y-3">
                     <div className="flex items-center justify-between bg-[#fcfaf8] border border-[#a3a3a3]/10 px-4 py-3 rounded-2xl">
                         <span className="text-xs font-bold text-[#0a0a0a]">Pedidos Pendentes</span>
                         <span className="text-sm font-serif text-[#0a0a0a]">R$ {stats?.pendingOrdersValue || '0,00'}</span>
                     </div>
                     <div className="flex items-center justify-between bg-[#fcfaf8] border border-[#a3a3a3]/10 px-4 py-3 rounded-2xl">
                         <span className="text-xs font-bold text-[#0a0a0a]">Consignações em Aberto</span>
                         <span className="text-sm font-serif text-[#0a0a0a]">R$ {stats?.pendingConsignmentValue || '0,00'}</span>
                     </div>
                     <div className="flex items-center justify-between bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">
                         <span className="text-xs font-bold text-red-600 flex items-center gap-2"><AlertCircle size={14}/> Atrasadas</span>
                         <span className="text-sm font-serif text-red-600">R$ {stats?.overdueConsignmentsValue || '0,00'}</span>
                     </div>
                 </div>
             </div>
             <button onClick={() => onAction?.('receive_payments')} className="w-full bg-white text-[#0a0a0a] border border-[#a3a3a3]/20 font-bold text-xs uppercase tracking-widest py-3 mt-6 rounded-xl hover:border-[#0a0a0a] transition-colors flex items-center justify-center gap-2 group">
                 Baixar Recebimentos <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </button>
         </div>
         )}

         {/* Payables */}
         {showPayables && (
         <div className={`bg-white border border-[#a3a3a3]/10 rounded-[24px] p-8 shadow-sm flex flex-col justify-between ${showReceivables ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
             <div>
                 <div className="flex items-center gap-3 mb-4">
                     <div className="w-12 h-12 bg-[#f5f5f5] rounded-xl text-red-500 flex items-center justify-center">
                         <Briefcase size={20} />
                     </div>
                     <div>
                         <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest">A Pagar (Mestre)</p>
                         <p className="text-3xl font-serif text-[#0a0a0a]">R$ {stats?.estimatedPayrollValue?.toLocaleString('pt-BR') || '0,00'}</p>
                     </div>
                 </div>
                 <p className="text-xs font-medium text-[#a3a3a3] mt-4">Estimativa baseada nas {stats?.pendingRoasterHours || 0} horas não pagas do período.</p>
             </div>
             <button onClick={() => onAction?.('log_hours')} className="w-full bg-[#0a0a0a] text-white hover:bg-[#c9a263] hover:text-black font-bold text-[10px] uppercase tracking-widest py-4 rounded-xl transition-colors mt-6">
                 Fechar Semana
             </button>
         </div>
         )}
      </div>
      
      {showStock && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 bg-white border border-[#a3a3a3]/10 rounded-[24px] shadow-sm relative overflow-hidden group">
             <h3 className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-2 relative z-10">Capex Lotes Cru</h3>
             <div className="text-4xl font-serif text-[#0a0a0a] relative z-10 transition-transform group-hover:scale-105 origin-left">R$ {stats?.rawInvestmentInPeriod?.toLocaleString('pt-BR') || '0,00'}</div>
             <p className="text-xs font-medium text-[#a3a3a3] mt-4 relative z-10 bg-[#f5f5f5] px-3 py-1.5 rounded-lg inline-block">Custo médio ponderado: R$ {(stats?.averageRawCostPerKg || 0).toFixed(2)}/kg</p>
          </div>
          <div className="p-8 bg-[#111111] border border-[#a3a3a3]/10 rounded-[24px] shadow-[0_10px_30px_rgba(201,162,99,0.05)] relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-48 h-full rounded-r-[24px] overflow-hidden pointer-events-none opacity-10">
                 <div className="absolute top-1/2 right-[-20px] w-32 h-32 bg-[#c9a263] rounded-full blur-[60px] -translate-y-1/2"></div>
             </div>
             <h3 className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-2 relative z-10">Valor Prateleira (Opex)</h3>
             <div className="text-4xl font-serif text-white relative z-10 transition-transform group-hover:scale-105 origin-left">R$ {((stats?.finishedStockUnits || 0) * 45).toLocaleString('pt-BR')}</div>
             <p className="text-xs font-bold text-[#c9a263] mt-4 relative z-10 uppercase tracking-widest flex items-center gap-2">
                <Zap size={12} /> Estimado a 45/unidade
             </p>
          </div>
      </div>
      )}
    </div>
  );
}
