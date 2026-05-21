import React, { useState } from 'react';
import { AdminPopup } from '../../ui/AdminPopup';
import { Lock, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface PrerequisiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  missingRequirements: string[];
  primaryActionLabel: string;
  onPrimaryAction: () => void;
}

export function OperationPrerequisiteModal({ isOpen, onClose, title, description, missingRequirements, primaryActionLabel, onPrimaryAction }: PrerequisiteModalProps) {
  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Primeiro passo necessário"
      size="md"
      variant="operation"
      primaryAction={{
        label: primaryActionLabel,
        onClick: () => {
          onClose();
          onPrimaryAction();
        }
      }}
      secondaryAction={{
        label: "Voltar",
        onClick: onClose
      }}
    >
      <div className="flex flex-col items-center justify-center text-center p-2 mb-4">
        <div className="w-16 h-16 bg-[#c9a263]/10 text-[#c9a263] rounded-[16px] flex items-center justify-center mb-6 border border-[#c9a263]/20">
          <Lock size={32} />
        </div>
        
        <p className="text-white font-medium mb-6 max-w-sm">{description}</p>
        
        <div className="bg-[#111111] border border-[#c9a263]/10 rounded-[16px] p-5 text-left w-full shadow-sm">
           <h4 className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold mb-4 flex items-center gap-2">
               Pré-requisito
           </h4>
           <ul className="space-y-3">
             {missingRequirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-white font-medium">
                  <div className="w-5 h-5 rounded-full border border-[#a3a3a3]/30 flex items-center justify-center text-[#a3a3a3] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
             ))}
           </ul>
        </div>
      </div>
    </AdminPopup>
  );
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  summary: React.ReactNode;
  primaryActionLabel: string;
  onConfirm: () => Promise<void> | void;
  isDestructive?: boolean;
}

export function OperationConfirmModal({ isOpen, onClose, title, description, summary, primaryActionLabel, onConfirm, isDestructive }: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (onConfirm) await onConfirm();
    } finally {
      if (isOpen) setLoading(false);
      onClose();
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant={isDestructive ? 'danger' : 'operation'}
      intent="confirm"
      isBusy={loading}
      preventBackdropClose={true}
      size="md"
      primaryAction={{
        label: primaryActionLabel,
        onClick: handleConfirm,
        loading: loading,
        variant: isDestructive ? 'danger' : 'primary'
      }}
      secondaryAction={{
        label: "Cancelar",
        onClick: onClose
      }}
    >
      <div className="flex flex-col p-2">
        <p className={`font-medium mb-6 text-sm ${isDestructive ? 'text-red-950 font-medium' : 'text-white'}`}>{description}</p>
        
        {summary && (
          <div className={`${isDestructive ? 'bg-[#fcfaf8] border-red-200/50' : 'bg-[#111111] border-[#333] text-white'} border rounded-[16px] p-5 text-left w-full shadow-sm`}>
             {summary}
          </div>
        )}
      </div>
    </AdminPopup>
  );
}
