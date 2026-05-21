import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export interface AdminPublishChecklistProps {
  items: { 
    label: string; 
    complete: boolean; 
    critical?: boolean;
  }[];
}

export function AdminPublishChecklist({ items }: AdminPublishChecklistProps) {
  const completed = items.filter(i => i.complete).length;
  const total = items.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="bg-[#fcfaf8] border border-[#a3a3a3]/20 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#a3a3a3]/10">
        <h4 className="text-xs font-bold text-[#0a0a0a] uppercase tracking-widest">Status de Preenchimento</h4>
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${percentage === 100 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
          {percentage}% Completo
        </span>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            {item.complete ? (
              <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
            ) : (
              <Circle size={16} className={`${item.critical ? 'text-red-400' : 'text-[#a3a3a3]/50'} mt-0.5 shrink-0`} />
            )}
            <div>
              <p className={`text-sm ${item.complete ? 'text-[#a3a3a3] line-through' : 'text-[#0a0a0a]'}`}>
                {item.label}
              </p>
              {!item.complete && item.critical && (
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-0.5">
                  Obrigatório para publicação
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
