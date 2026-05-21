import React, { useState, useEffect } from 'react';
import { stockService } from '../../../services/stockService';
import { rawCoffeeLotService } from '../../../services/rawCoffeeLotService';
import { StockItem, RawCoffeeLot } from '../../../types/admin';
import { Layers, Package, Target, Flame, AlertTriangle, ArrowRight, Info, Filter, X } from 'lucide-react';
import { OperationEmptyState } from './OperationEmptyState';

interface StockOverviewProps {
  onAction?: (action: string) => void;
}

type StockFilter = 'all' | 'raw' | 'roasted' | 'finished' | 'alert';

export function StockOverview({ onAction }: StockOverviewProps) {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [lots, setLots] = useState<RawCoffeeLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<StockFilter>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [s, l] = await Promise.all([
      stockService.listStockItems(),
      rawCoffeeLotService.listRawCoffeeLots()
    ]);
    setStockItems(s);
    setLots(l);
    setLoading(false);
  };

  const rawStock = stockItems.filter(i => i.type === 'raw');
  const roastedStock = stockItems.filter(i => i.type === 'roasted');
  const finishedStock = stockItems.filter(i => i.type === 'finished');

  const showRaw = activeFilter === 'all' || activeFilter === 'raw' || activeFilter === 'alert';
  const showRoasted = activeFilter === 'all' || activeFilter === 'roasted';
  const showFinished = activeFilter === 'all' || activeFilter === 'finished' || activeFilter === 'alert';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Internal Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#a3a3a3]/10">
          <Filter size={14} className="text-[#a3a3a3] mr-2" />
          <button 
             onClick={() => setActiveFilter('all')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeFilter === 'all' ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
          >
              Todos
          </button>
          <button 
             onClick={() => setActiveFilter('raw')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeFilter === 'raw' ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
          >
              Cru
          </button>
          <button 
             onClick={() => setActiveFilter('roasted')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeFilter === 'roasted' ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
          >
              Torrado
          </button>
          <button 
             onClick={() => setActiveFilter('finished')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeFilter === 'finished' ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#a3a3a3]/20 text-[#a3a3a3] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'}`}
          >
              Pronto
          </button>
          <button 
             onClick={() => setActiveFilter('alert')}
             className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-colors ${activeFilter === 'alert' ? 'bg-amber-100 text-amber-700 border-transparent border' : 'bg-white border border-amber-200/50 text-amber-600 hover:border-amber-400'}`}
          >
              Atenção
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

      <div className="space-y-12">
      {/* 1. Raw Lots Section */}
      {showRaw && (
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#0a0a0a] text-white rounded-lg flex items-center justify-center">
                <Target size={18} />
             </div>
             <h3 className="text-sm font-serif text-[#0a0a0a]">Café Cru (Lotes)</h3>
          </div>
          <span className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest">{lots.length} lotes ativos</span>
        </div>

        {lots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {lots.filter(l => activeFilter === 'alert' ? l.availableKg < (l.lowStockThresholdKg || 50) : true).map(lot => (
               <div key={lot.id} className="bg-white p-6 rounded-3xl border border-[#a3a3a3]/10 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-start mb-4">
                     <div className="px-3 py-1 bg-[#f5f5f5] rounded-lg text-[9px] font-bold text-[#0a0a0a] uppercase tracking-widest group-hover:bg-[#0a0a0a] group-hover:text-white transition-colors">
                       {lot.code}
                     </div>
                     {lot.availableKg < (lot.lowStockThresholdKg || 50) && (
                       <div className="flex items-center gap-1 text-amber-600 animate-pulse">
                          <AlertTriangle size={14} />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Baixo Estoque</span>
                       </div>
                     )}
                  </div>
                  <h4 className="text-sm font-bold text-[#0a0a0a] mb-1">{lot.name}</h4>
                  <p className="text-[10px] font-bold text-[#a3a3a3] uppercase tracking-widest mb-4">{lot.supplier || 'Fornecedor não informado'}</p>
                  
                  <div className="space-y-3 pt-4 border-t border-[#a3a3a3]/10">
                     <div className="flex justify-between items-end">
                        <p className="text-[9px] font-bold text-[#a3a3a3] uppercase tracking-widest">Disponível</p>
                        <p className="text-xl font-serif text-[#0a0a0a]">{lot.availableKg}<span className="text-xs text-[#a3a3a3] ml-1 font-sans">kg</span></p>
                     </div>
                     <div className="w-full h-1.5 bg-[#f5f5f5] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${lot.availableKg < 50 ? 'bg-amber-500' : 'bg-[#c9a263]'}`} 
                          style={{ width: `${Math.min(100, (lot.availableKg / lot.purchasedKg) * 100)}%` }}
                        ></div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        ) : (
          <OperationEmptyState 
            icon={Target}
            title="Nenhum lote ativo"
            description="Sem lotes cru listados. Comece lançando um lote com origem, custo e pontuação."
            actionLabel="Lançar Novo Lote"
            onAction={() => onAction?.('launch_lot')}
          />
        )}
      </section>
      )}

      {/* 2. Roasted & Finished Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Roasted */}
         {showRoasted && (
         <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 bg-[#0a0a0a] text-[#c9a263] rounded-lg flex items-center justify-center">
                  <Flame size={18} />
               </div>
               <h3 className="text-sm font-serif text-[#0a0a0a]">Café Torrado (Aguardando)</h3>
            </div>
            
            <div className="space-y-3">
               {roastedStock.length > 0 ? roastedStock.map(item => (
                 <div key={item.id} className="bg-white p-5 rounded-2xl border border-[#a3a3a3]/10 flex items-center justify-between group hover:border-[#c9a263]/40 transition-all shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold text-[#c9a263] uppercase tracking-widest mb-0.5">Lote Torra {item.roastBatchId}</p>
                      <p className="text-sm font-bold text-[#0a0a0a]">Torra Industrial #104</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-serif text-[#0a0a0a]">{item.availableKg}kg</p>
                       <p className="text-[9px] font-bold text-[#a3a3a3] uppercase">Pronto p/ Empacotar</p>
                    </div>
                 </div>
               )) : (
                 <OperationEmptyState 
                   icon={Flame}
                   title="Nenhum café aguardando"
                   description="Não há saldo de produto torrado esperando para ser empacotado."
                   actionLabel="Registrar Torra"
                   onAction={() => onAction?.('register_roast')}
                 />
               )}
            </div>
         </section>
         )}

         {/* Finished */}
         {showFinished && (
         <section className={!showRoasted ? 'lg:col-span-2' : ''}>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-8 h-8 flex items-center justify-center text-[#c9a263] bg-[#0a0a0a] rounded-lg">
                  <Package size={18} />
               </div>
               <h3 className="text-sm font-serif text-[#0a0a0a]">Produto Acabado (Venda)</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {finishedStock.length > 0 ? ['200g', '250g', '500g', '1kg'].map(format => {
                 const itemsInFormat = finishedStock.filter(i => i.format === format);
                 if (itemsInFormat.length === 0) return null;
                 
                 const available = itemsInFormat.reduce((acc, i) => acc + (i.availableUnits || 0), 0);
                 const consigned = itemsInFormat.reduce((acc, i) => acc + (i.consignedUnits || 0), 0);
                 const reserved = itemsInFormat.reduce((acc, i) => acc + (i.reservedUnits || 0), 0);
                 
                 if (activeFilter === 'alert' && available >= 20) return null;

                 return (
                 <div key={format} className={`bg-white p-6 rounded-3xl border group hover:shadow-md transition-all flex flex-col justify-between ${available === 0 ? 'border-red-200' : (available < 20 ? 'border-amber-200' : 'border-[#a3a3a3]/10 hover:border-[#c9a263]/40')}`}>
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-bold uppercase tracking-widest text-[#0a0a0a]">{format}</p>
                            {available === 0 ? (
                                <span className="text-[9px] bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded font-bold uppercase tracking-widest">Esgotado</span>
                            ) : available < 20 ? (
                                <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-1 rounded font-bold uppercase tracking-widest">Baixo</span>
                            ) : (
                                <span className="text-[10px] text-[#a3a3a3] font-bold uppercase tracking-widest">Normal</span>
                            )}
                        </div>
                        
                        <div className="space-y-3 mb-2 mt-4 pt-4 border-t border-[#a3a3a3]/10">
                           <div className="flex justify-between items-center">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">Disponível</span>
                               <span className={`font-serif text-lg ${available === 0 ? 'text-red-600' : (available < 20 ? 'text-amber-600' : 'text-[#0a0a0a]')}`}>{available}</span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">Consignado</span>
                               <span className="font-serif text-sm text-[#0a0a0a]">{consigned}</span>
                           </div>
                           <div className="flex justify-between items-center">
                               <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]">Reservado</span>
                               <span className="font-serif text-sm text-[#0a0a0a]">{reserved}</span>
                           </div>
                        </div>
                    </div>
                 </div>
                 );
               }) : (
                  <div className="col-span-1 sm:col-span-2">
                     <OperationEmptyState 
                       icon={Package}
                       title="Nenhum pacote pronto"
                       description="Nenhum café embalado no momento."
                       actionLabel="Empacotar Café"
                       onAction={() => onAction?.('package_coffee')}
                     />
                  </div>
               )}
            </div>
         </section>
         )}
      </div>
     </div>
    </div>
  );
}
