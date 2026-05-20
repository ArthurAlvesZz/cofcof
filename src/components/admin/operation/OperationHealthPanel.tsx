import React from 'react';
import { Globe, MapPin, Coffee, Star, Tag, MessageSquare, AlertTriangle } from 'lucide-react';
import { OperationStatusChip } from './OperationStatusChip';

interface OperationHealthPanelProps {
  // We can pass data if we want, or it can be generic for now based on the prompt
  // The prompt says "Se aparece no site público, precisa ser editável e validável no admin."
}

export function OperationHealthPanel({}: OperationHealthPanelProps) {
  // This will be a UI component, later fed by real stats
  return (
    <div className="bg-[#111111] rounded-[24px] border border-[#a3a3a3]/10 p-6 md:p-8 flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-serif text-white mb-2">Central de Publicação</h2>
        <p className="text-sm text-[#a3a3a3] font-medium max-w-2xl">
          Regra de Ouro: Se aparece no site público, precisa estar validável e completo aqui.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Bloco: Produtos públicos */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#a3a3a3]/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#c9a263]">
            <Coffee size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Produtos</h3>
          </div>
          <div>
            <p className="text-2xl font-serif text-white">24</p>
            <p className="text-[10px] text-[#a3a3a3] font-bold uppercase tracking-widest">Total</p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#a3a3a3]">Publicados</span>
              <span className="text-white font-medium">18</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#a3a3a3]">Com Pendência</span>
              <span className="text-amber-400 font-medium">2</span>
            </div>
          </div>
          <div className="mt-auto pt-4 flex flex-wrap gap-1">
             <OperationStatusChip label="Sem imagem" />
          </div>
        </div>

        {/* Bloco: Parceiros no mapa */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#a3a3a3]/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#c9a263]">
            <MapPin size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Parceiros</h3>
          </div>
          <div>
            <p className="text-2xl font-serif text-white">12</p>
            <p className="text-[10px] text-[#a3a3a3] font-bold uppercase tracking-widest">No Mapa</p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#a3a3a3]">Validados</span>
              <span className="text-white font-medium">10</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#a3a3a3]">Com Pendência</span>
              <span className="text-amber-400 font-medium">2</span>
            </div>
          </div>
          <div className="mt-auto pt-4 flex flex-wrap gap-1">
             <OperationStatusChip label="Sem coordenada" />
          </div>
        </div>

        {/* Bloco: Lotes e origem */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#a3a3a3]/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#c9a263]">
            <Globe size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Lotes</h3>
          </div>
          <div>
            <p className="text-2xl font-serif text-white">8</p>
            <p className="text-[10px] text-[#a3a3a3] font-bold uppercase tracking-widest">Ativos</p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs">
               <span className="text-[#a3a3a3]">Publicados</span>
               <span className="text-white font-medium">8</span>
            </div>
          </div>
          <div className="mt-auto pt-4 flex flex-wrap gap-1">
             <OperationStatusChip label="Saudável" />
          </div>
        </div>

        {/* Bloco: Assinaturas */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#a3a3a3]/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#c9a263]">
            <Star size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Assinaturas</h3>
          </div>
          <div>
            <p className="text-2xl font-serif text-white">4</p>
            <p className="text-[10px] text-[#a3a3a3] font-bold uppercase tracking-widest">Planos</p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs">
               <span className="text-[#a3a3a3]">Ativos</span>
               <span className="text-white font-medium">4</span>
            </div>
          </div>
          <div className="mt-auto pt-4 flex flex-wrap gap-1">
             <OperationStatusChip label="Saudável" />
          </div>
        </div>

        {/* Bloco: Cupons */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#a3a3a3]/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#c9a263]">
            <Tag size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Cupons</h3>
          </div>
          <div>
            <p className="text-2xl font-serif text-white">5</p>
            <p className="text-[10px] text-[#a3a3a3] font-bold uppercase tracking-widest">Ativos</p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs">
               <span className="text-[#a3a3a3]">Expirados ativos</span>
               <span className="text-red-400 font-medium">1</span>
            </div>
          </div>
          <div className="mt-auto pt-4 flex flex-wrap gap-1">
             <OperationStatusChip label="Problema" />
          </div>
        </div>

        {/* Bloco: Conteúdo */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-[#a3a3a3]/10 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#c9a263]">
            <MessageSquare size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Conteúdo</h3>
          </div>
          <div>
            <p className="text-2xl font-serif text-white">3</p>
            <p className="text-[10px] text-[#a3a3a3] font-bold uppercase tracking-widest">Páginas</p>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between text-xs">
               <span className="text-[#a3a3a3]">Home, Sobre, B2B</span>
               <span className="text-green-400 font-medium">✓</span>
            </div>
          </div>
          <div className="mt-auto pt-4 flex flex-wrap gap-1">
             <OperationStatusChip label="Saudável" />
          </div>
        </div>
      </div>
    </div>
  );
}
