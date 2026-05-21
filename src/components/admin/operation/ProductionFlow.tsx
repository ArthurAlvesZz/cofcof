import React from 'react';
import { Target, Flame, Package, Layers, Handshake, AlertTriangle, Briefcase, Lock, ArrowRight, Zap } from 'lucide-react';

interface ProductionFlowProps {
  stats: any;
  onAction: (type: string) => void;
}

export function ProductionFlow({ stats, onAction }: ProductionFlowProps) {
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
       case 'register_courtesy':
         return { status: 'blocked', reason: 'Em desenvolvimento' };
       default: 
         return { status: 'available' };
    }
  };

  const actions = [
    { id: 'launch_lot', label: 'Lançar lote cru', desc: 'Cadastre um novo lote com origem, pontuação, custo e estoque inicial.', icon: Target },
    { id: 'register_roast', label: 'Registrar torra', desc: 'Consuma café cru, informe rendimento e gere estoque torrado.', icon: Flame },
    { id: 'package_coffee', label: 'Registrar empacotamento', desc: 'Transforme café torrado em pacotes de 200g, 1kg ou outros formatos.', icon: Package },
    { id: 'adjust_stock', label: 'Ajustar estoque', desc: 'Faça correções manuais de inventário.', icon: Layers },
    { id: 'register_loss', label: 'Registrar perda', desc: 'Informe uma perda operacional na produção.', icon: AlertTriangle },
    { id: 'create_consignment', label: 'Criar consignação', desc: 'Envie pacotes para pontos de venda e parceiros.', icon: Handshake },
    { id: 'register_courtesy', label: 'Registrar cortesia', desc: 'Registre saídas de estoque para degustação.', icon: Briefcase }
  ];

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      <div className="border-b border-[#a3a3a3]/10 pb-4 mb-4">
          <h2 className="text-xl font-serif text-[#0a0a0a]">Lançar movimentação</h2>
          <p className="text-sm text-[#a3a3a3] font-medium mt-1">Registre as entradas e saídas de produtos no sistema operacional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map(action => {
            const status = getActionStatus(action.id);
            const blocked = status.status === 'blocked';
            return (
                <button
                    key={action.id}
                    onClick={() => {
                        if (!blocked) onAction(action.id);
                    }}
                    disabled={blocked}
                    className={`w-full text-left p-6 rounded-[24px] transition-all flex flex-col justify-between group h-[160px] border shadow-sm relative overflow-hidden ${blocked ? 'bg-[#f5f5f5] border-transparent opacity-80 cursor-not-allowed' : 'bg-white border-[#a3a3a3]/10 hover:border-[#c9a263]/40 hover:shadow-md'}`}
                >
                    <div className="flex items-start justify-between">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 border ${blocked ? 'bg-[#ebebeb] text-[#a3a3a3] border-[#a3a3a3]/10' : 'bg-[#0a0a0a] text-white border-[#c9a263]/20 group-hover:scale-105 group-hover:text-[#c9a263]'}`}>
                            {blocked ? <Lock size={20} /> : <action.icon size={22} strokeWidth={1.5} />}
                        </div>
                        {!blocked ? (
                           <div className="w-8 h-8 rounded-full border border-[#a3a3a3]/20 flex items-center justify-center text-[#a3a3a3] opacity-0 group-hover:opacity-100 transition-all bg-[#fafafa]">
                               <ArrowRight size={14} />
                           </div>
                        ) : (
                           <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-1 rounded">Bloqueado</span>
                        )}
                    </div>
                    
                    <div className="mt-4">
                        <p className={`text-sm font-bold ${blocked ? 'text-[#a3a3a3]' : 'text-[#0a0a0a]'}`}>{action.label}</p>
                        <p className={`text-[11px] font-medium leading-relaxed mt-1 line-clamp-2 ${blocked ? 'text-amber-600' : 'text-[#a3a3a3]'}`}>
                            {blocked ? status.reason : action.desc}
                        </p>
                    </div>
                </button>
            );
        })}
      </div>
    </div>
  );
}
