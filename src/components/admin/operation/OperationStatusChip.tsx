import React from 'react';

type ChipType = 'success' | 'warning' | 'critical' | 'neutral';

interface OperationStatusChipProps {
  label: string;
  type?: ChipType | string;
}

export function OperationStatusChip({ label, type = 'neutral' }: OperationStatusChipProps) {
  let mappedType: ChipType = 'neutral';
  
  const l = label.toLowerCase();
  
  if (['publicado', 'pago', 'entregue', 'ativo', 'destaque', 'saudável', 'healthy'].includes(l)) {
    mappedType = 'success';
  } else if (['rascunho', 'novo', 'separando', 'torrando', 'embalado', 'enviado', 'safra atual'].includes(l)) {
    mappedType = 'neutral';
  } else if (['estoque baixo', 'sem imagem', 'sem foto', 'sem preço', 'pendente de validação', 'sem coordenada', 'inativo', 'sem qr', 'attention'].includes(l)) {
    mappedType = 'warning';
  } else if (['esgotado', 'problema', 'critical'].includes(l)) {
    mappedType = 'critical';
  } else {
    // try to use passed type if it matches valid ones
    if (['success', 'warning', 'critical', 'neutral'].includes(type as string)) {
      mappedType = type as ChipType;
    }
  }

  const getStyles = () => {
    switch (mappedType) {
      case 'success':
        return 'bg-green-950/30 text-green-400 border border-green-900/50';
      case 'warning':
        return 'bg-amber-950/30 text-amber-400 border border-amber-900/50';
      case 'critical':
        return 'bg-red-950/30 text-red-500 border border-red-900/50';
      case 'neutral':
      default:
        return 'bg-[#1a1a1a] text-[#a3a3a3] border border-[#a3a3a3]/20';
    }
  };

  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${getStyles()}`}>
      {label}
    </span>
  );
}
