import React from 'react';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import type { OperationAlertSeverity } from '../../../services/operationHealthService';

interface OperationAlertCardProps {
  key?: string | number;
  id: string;
  severity: OperationAlertSeverity;
  message: string;
  actionLabel: string;
  onAction: (id: string) => void;
}

export function OperationAlertCard({ id, severity, message, actionLabel, onAction }: OperationAlertCardProps) {
  const getSeverityStyles = () => {
    switch (severity) {
      case 'critical':
        return 'bg-red-950/20 border-red-900/50 text-red-400';
      case 'warning':
        return 'bg-amber-950/20 border-amber-900/50 text-amber-400';
      case 'info':
        return 'bg-blue-950/20 border-blue-900/50 text-blue-400';
      default:
        return 'bg-[#1a1a1a] border-[#a3a3a3]/20 text-[#a3a3a3]';
    }
  };

  const getIcon = () => {
    switch (severity) {
      case 'critical':
        return <ShieldAlert size={18} />;
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'info':
        return <Info size={18} />;
      default:
        return <CheckCircle2 size={18} />;
    }
  };

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${getSeverityStyles()}`}>
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          {getIcon()}
        </div>
        <p className="text-sm font-medium leading-tight">
          {message}
        </p>
      </div>
      <button 
        onClick={() => onAction(id)}
        className="shrink-0 text-xs font-bold uppercase tracking-widest px-4 py-2 border rounded-lg hover:bg-white/5 transition-all text-current border-current"
      >
        {actionLabel}
      </button>
    </div>
  );
}
