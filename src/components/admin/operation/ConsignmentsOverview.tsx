import React, { useState, useEffect } from 'react';
import { consignmentService } from '../../../services/consignmentService';
import { Consignment } from '../../../types/admin';
import { Handshake, AlertCircle, TrendingUp, DollarSign, Clock, ArrowRight, User, MoreVertical, MessageCircle, Info, Filter, X, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { OperationEmptyState } from './OperationEmptyState';

interface ConsignmentsOverviewProps {
  onAction?: (action: string) => void;
}

type ConsignmentFilter = 'all' | 'open' | 'overdue';

export function ConsignmentsOverview({ onAction }: ConsignmentsOverviewProps) {
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ConsignmentFilter>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const c = await consignmentService.listConsignments();
      setConsignments(c);
    } catch (error) {
      toast.error("Erro ao carregar consignações");
    } finally {
      setLoading(false);
    }
  };

  const activeConsignments = consignments.filter(c => c.status === 'aberta' || c.status === 'vencida');
  const overdueCount = consignments.filter(c => c.status === 'vencida').length;
  const totalPendingValue = activeConsignments.reduce((acc, c) => acc + (c.pendingValue || 0), 0);

  const filteredConsignments = activeConsignments.filter(c => {
    if (activeFilter === 'open') return c.status === 'aberta';
    if (activeFilter === 'overdue') return c.status === 'vencida';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Internal Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#a3a3a3]/10">
          <Filter size={14} className="text-[#a3a3a3] mr-2" />
          <button 
             onClick={() => setActiveFilter('all')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeFilter === 'all' ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
          >
              Todas
          </button>
          <button 
             onClick={() => setActiveFilter('open')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeFilter === 'open' ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
          >
              Abertas
          </button>
          <button 
             onClick={() => setActiveFilter('overdue')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeFilter === 'overdue' ? 'bg-amber-100 text-amber-700 border-transparent border' : 'bg-white border border-amber-200/50 text-amber-600 hover:border-amber-400'}`}
          >
              Vencidas ({overdueCount})
          </button>
      </div>

      {activeFilter !== 'all' && (
         <div className="bg-[#fcfaf8] border border-[#c9a263]/20 rounded-xl p-3 flex items-center justify-between mb-4 animate-in slide-in-from-top-2">
             <p className="text-[11px] font-bold text-[#c9a263] uppercase tracking-widest flex items-center gap-2">
                <Info size={14} /> Filtro estrito aplicado
             </p>
             <button onClick={() => setActiveFilter('all')} className="flex items-center gap-1 text-[10px] font-bold text-[#0a0a0a] uppercase tracking-widest hover:text-[#c9a263] transition-colors">
                 Limpar filtro <X size={12} />
             </button>
         </div>
      )}

      {/* 1. Dashboard de Consignação */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-[24px] border border-[#a3a3a3]/10 shadow-sm relative overflow-hidden group hover:border-[#c9a263]/40 transition-colors">
            <div className="w-10 h-10 bg-[#0a0a0a] text-[#c9a263] rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform">
               <DollarSign size={20} />
            </div>
            <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-1">Valor Pendente</p>
            <p className="text-2xl font-serif text-[#0a0a0a]">R$ {totalPendingValue.toLocaleString()}</p>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-[#a3a3a3]/10 shadow-sm relative overflow-hidden group hover:border-[#c9a263]/40 transition-colors">
            <div className="w-10 h-10 bg-[#f5f5f5] text-[#0a0a0a] rounded-xl flex items-center justify-center mb-4 relative z-10 group-hover:scale-110 transition-transform">
               <Handshake size={20} />
            </div>
            <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-1">Guias Ativas</p>
            <p className="text-2xl font-serif text-[#0a0a0a]">{activeConsignments.length}</p>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-[#a3a3a3]/10 shadow-sm border-l-4 border-l-amber-500 relative overflow-hidden group">
            <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-4 relative z-10">
               <AlertCircle size={20} />
            </div>
            <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-1">Vencidas</p>
            <p className="text-2xl font-serif text-[#0a0a0a]">{overdueCount}</p>
         </div>
         <div className="bg-[#111111] p-6 rounded-[24px] border border-[#c9a263]/20 text-white relative overflow-hidden">
            <div className="w-10 h-10 bg-[#1a1a1a] text-[#c9a263] border border-[#c9a263]/20 rounded-xl flex items-center justify-center mb-4">
               <TrendingUp size={20} />
            </div>
            <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-1">Ticket Médio</p>
            <p className="text-2xl font-serif text-white">R$ 450</p>
         </div>
      </div>

      <div className="space-y-6 pt-6">
         <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif text-[#0a0a0a]">Consignações Filtradas</h3>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredConsignments.map(cons => (
              <div key={cons.id} className="bg-white p-6 rounded-[24px] border border-[#a3a3a3]/10 shadow-sm group hover:border-[#c9a263]/40 transition-all relative overflow-hidden">
                 <div className={`absolute top-0 left-0 w-1.5 h-full ${cons.status === 'vencida' ? 'bg-amber-500' : 'bg-[#c9a263]'}`} />
                 
                 <div className="flex justify-between items-start mb-6 pl-2">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-[#f5f5f5] rounded-2xl flex items-center justify-center text-[#0a0a0a] group-hover:bg-[#0a0a0a] group-hover:text-white transition-all">
                          <User size={20} />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-[#0a0a0a] uppercase tracking-wider line-clamp-1">{cons.recipientName}</h4>
                          <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mt-0.5">Guia #{cons.code}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${cons.status === 'vencida' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-[#fcfaf8] text-[#c9a263] border border-[#c9a263]/20'}`}>
                         {cons.status}
                       </span>
                       <p className="text-[9px] font-bold text-[#a3a3a3] uppercase tracking-widest mt-2 flex items-center justify-end gap-1">
                          <Clock size={10} /> Expira: {cons.dueDate ? new Date(cons.dueDate).toLocaleDateString() : 'A definir'}
                       </p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-[#a3a3a3]/10 pl-2">
                    <div>
                       <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-1">Valor Total</p>
                       <p className="text-lg font-serif text-[#a3a3a3]">R$ {cons.totalValue?.toLocaleString()}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-[#c9a263] uppercase tracking-widest mb-1">Saldo a Receber</p>
                       <p className="text-xl font-serif text-[#0a0a0a]">R$ {cons.pendingValue?.toLocaleString()}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 pl-2">
                    <button onClick={() => onAction?.('settle_consignment')} className="flex-[2] bg-[#0a0a0a] text-white px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-[#c9a263] active:scale-95 transition-all shadow-sm">
                       Registrar Acerto
                    </button>
                    <button className="flex-1 bg-white border border-[#a3a3a3]/20 text-[#0a0a0a] px-4 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:border-[#0a0a0a] transition-all flex items-center justify-center gap-2">
                       <MessageCircle size={14} /> Cobrar
                    </button>
                 </div>
              </div>
            ))}

            {filteredConsignments.length === 0 && (
              <div className="col-span-1 md:col-span-2">
                 <OperationEmptyState 
                    icon={Handshake}
                    title="Nenhuma consignação encontrada"
                    description="Não existem guias ativas neste filtro."
                    actionLabel="Nova Consignação"
                    onAction={() => onAction?.('create_consignment')}
                 />
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
