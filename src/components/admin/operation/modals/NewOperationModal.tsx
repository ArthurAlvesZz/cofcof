import React, { useState, useEffect, useRef } from 'react';
import { X, Target, Flame, Package, Layers, Handshake, Clock, AlertTriangle, Briefcase, Zap, Search, ArrowRight, Lock } from 'lucide-react';
import { AdminPopup } from '../../ui/AdminPopup';
import { motion, AnimatePresence } from 'motion/react';

interface NewOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionId: string) => void;
  stats?: any;
}

export function NewOperationModal({ isOpen, onClose, onAction, stats }: NewOperationModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Enter') {
          const visible = getGroupedActions().flatMap(g => g.items);
          if (visible.length > 0) {
              const action = visible[0];
              if (action.status.status === 'available') {
                  onAction(action.id);
                  onClose();
              }
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, searchQuery]);

  const getActionStatus = (id: string): { status: 'available'|'blocked', reason?: string } => {
    switch(id) {
       case 'register_roast': 
         if ((stats?.activeLotsCount || 0) === 0 && (stats?.rawKgAvailable || 0) === 0) 
            return { status: 'blocked', reason: 'Exige lote cru ativo' };
         return { status: 'available' };
       case 'package_coffee':
         if ((stats?.roastedKgInPeriod || 0) <= 0)
            return { status: 'blocked', reason: 'Exige torra registrada' };
         return { status: 'available' };
       case 'create_consignment':
         if ((stats?.finishedStockUnits || 0) <= 0)
            return { status: 'blocked', reason: 'Exige estoque pronto' };
         return { status: 'available' };
       case 'register_loss':
       case 'manual_sale':
       case 'create_partner':
       case 'create_product':
         return { status: 'blocked', reason: 'Em desenvolvimento' };
       default: 
         return { status: 'available' };
    }
  };

  const getGroupedActions = () => {
    const actions = [
      { group: 'Produção', items: [
        { id: 'launch_lot', label: 'Lançar lote cru', desc: 'Cadastre um novo lote com origem, pontuação, custo e estoque inicial.', icon: Target, keywords: 'compra verde cru sacaria' },
        { id: 'register_roast', label: 'Registrar torra', desc: 'Consuma café cru, informe rendimento e gere estoque torrado.', icon: Flame, keywords: 'forno maquina mestre queima perfil' },
        { id: 'package_coffee', label: 'Registrar empacotamento', desc: 'Transforme café torrado em pacotes de 200g, 1kg ou outros formatos.', icon: Package, keywords: 'embalagem final produto' },
        { id: 'adjust_stock', label: 'Ajustar estoque', desc: 'Faça correções manuais de inventário (perda, avaria).', icon: Layers, keywords: 'correcao manual contagem inventario' },
        { id: 'register_loss', label: 'Registrar perda', desc: 'Informe uma perda operacional na produção.', icon: AlertTriangle, keywords: 'perda quebra defeito' }
      ]},
      { group: 'Comercial', items: [
        { id: 'create_consignment', label: 'Criar consignação', desc: 'Envie pacotes para pontos de venda e parceiros.', icon: Handshake, keywords: 'venda b2b parceiro prateleira' },
        { id: 'register_courtesy', label: 'Registrar cortesia', desc: 'Registre saídas de estoque para degustação ou brinde.', icon: Briefcase, keywords: 'brinde doacao provador evento degustacao' },
        { id: 'settle_consignment', label: 'Registrar acerto', desc: 'Receba valores e registre devoluções de consignações.', icon: AlertTriangle, keywords: 'receber cobranca dinheiro puxar devolucao' },
        { id: 'manual_sale', label: 'Registrar venda manual', desc: 'Registre uma venda B2B ou atacado fora do site.', icon: Handshake, keywords: 'venda offline balcao' }
      ]},
      { group: 'Cadastros Básicos', items: [
        { id: 'create_partner', label: 'Criar parceiro', desc: 'Novo cadastro corporativo ou ponto de venda.', icon: Briefcase, keywords: 'parceiro b2b cnpj nova' },
        { id: 'create_product', label: 'Criar produto', desc: 'Novo tipo de torra ou embalagem no portfólio.', icon: Package, keywords: 'produto novo skus' }
      ]},
      { group: 'Equipe / Financeiro', items: [
        { id: 'launch_hours', label: 'Lançar horas', desc: 'Registre o trabalho do mestre de torra por dia e atividade.', icon: Clock, keywords: 'trabalho mestre ponto relogio' },
        { id: 'close_period', label: 'Fechar período', desc: 'Consolide as horas trabalhadas e gere valor a pagar.', icon: Zap, keywords: 'pagamento acerto salario fechamento' },
        { id: 'view_hours', label: 'Aprovar horas', desc: 'Revise e aprove registros de horas pendentes.', icon: Clock, keywords: 'aprovar mestre salario validar' }
      ]}
    ];

    if (!searchQuery) {
        return actions.map(g => ({
            ...g,
            items: g.items.map(item => ({ ...item, status: getActionStatus(item.id) }))
        }));
    }

    const filtered = actions.map(g => ({
        ...g,
        items: g.items.filter(a => 
            a.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
            a.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.keywords.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(item => ({ ...item, status: getActionStatus(item.id) }))
    })).filter(g => g.items.length > 0);
    return filtered;
  };

  const groupedActions = getGroupedActions();

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      title="O que você deseja registrar?"
      subtitle="Escolha uma ação operacional para continuar."
      variant="operation"
      size="md"
    >
      {/* Search Input */}
      <div className="flex items-center p-3 mb-4 rounded-xl border border-[#333] bg-[#1a1a1a] shadow-inner">
         <div className="px-2 text-[#c9a263]">
             <Search size={20} className="opacity-80" />
         </div>
         <input 
            ref={inputRef}
            type="text" 
            placeholder="Buscar operação..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-[#a3a3a3]/50 outline-none text-sm"
         />
         <div className="px-2">
             <kbd className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 text-[9px] font-bold uppercase text-[#a3a3a3] bg-[#0a0a0a] border border-[#a3a3a3]/20 rounded">Enter</kbd>
         </div>
      </div>

      <div className="flex flex-col gap-6">
          {groupedActions.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                  <Zap size={32} className="text-[#a3a3a3]/30 mb-4" />
                  <p className="text-sm font-bold text-[#a3a3a3]">Nenhuma operação encontrada. Tente 'lote' ou 'horas'.</p>
              </div>
          ) : (
              groupedActions.map((group, gIdx) => (
                  <div key={gIdx} className="space-y-3">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#c9a263] pl-2">{group.group}</h3>
                      <div className="grid grid-cols-1 gap-2">
                          {group.items.map((action, index) => {
                              const blocked = action.status.status === 'blocked';
                              return (
                                  <button
                                      key={action.id}
                                      disabled={blocked}
                                      onClick={() => {
                                          if (!blocked) {
                                            onAction(action.id);
                                            onClose();
                                          }
                                      }}
                                      className={`w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-[#c9a263]/20 relative border ${blocked ? 'bg-[#1a1a1a] border-[#333]/50 opacity-80 cursor-not-allowed' : 'bg-[#1a1a1a] border-[#333] hover:bg-[#222] hover:border-[#c9a263]/40'}`}
                                  >
                                      <div className="flex items-center gap-4">
                                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shrink-0 border ${blocked ? 'bg-[#111111] text-[#a3a3a3] border-[#333]' : 'bg-[#0a0a0a] text-white border-[#c9a263]/20 group-hover:scale-105 group-hover:text-[#c9a263]'}`}>
                                              {blocked ? <Lock size={20} /> : <action.icon size={22} strokeWidth={1.5} />}
                                          </div>
                                          <div>
                                              <div className="flex items-center gap-2 mb-1">
                                                  <p className={`text-sm font-bold ${blocked ? 'text-[#a3a3a3]' : 'text-white'}`}>{action.label}</p>
                                              </div>
                                              <p className={`text-[11px] font-medium leading-relaxed ${blocked ? 'text-amber-500/80' : 'text-[#a3a3a3]/80'}`}>
                                                  {blocked ? action.status.reason : action.desc}
                                              </p>
                                          </div>
                                      </div>
                                      
                                      {!blocked && (
                                      <div className="hidden sm:flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#c9a263]">
                                          <span className="text-[10px] font-bold uppercase tracking-widest">Iniciar</span>
                                          <div className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center bg-[#0a0a0a] border border-[#c9a263]/20">
                                              <ArrowRight size={14} />
                                          </div>
                                      </div>
                                      )}
                                      {blocked && (
                                        <div className="hidden sm:flex items-center opacity-60 text-amber-500/80 transition-opacity">
                                            <span className="text-[10px] font-bold uppercase tracking-widest pl-2">Bloqueado</span>
                                        </div>
                                      )}
                                  </button>
                              );
                          })}
                      </div>
                  </div>
              ))
          )}
      </div>
    </AdminPopup>
  );
}
