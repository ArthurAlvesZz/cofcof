import React, { useState } from 'react';
import { AdminPopup } from './AdminPopup';

export interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  requireString?: string;
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDestructive = false,
  requireString
}: AdminConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const isConfirmDisabled = requireString ? inputValue !== requireString : false;

  const handleConfirm = async () => {
    if (isConfirmDisabled) return;
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      if (isOpen) {
        setLoading(false);
        setInputValue('');
      }
    }
  };

  return (
    <AdminPopup
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      variant={isDestructive ? 'danger' : 'default'}
      intent="confirm"
      isBusy={loading}
      preventBackdropClose={true}
      primaryAction={{
        label: confirmLabel,
        onClick: handleConfirm,
        loading: loading,
        disabled: isConfirmDisabled,
        variant: isDestructive ? 'danger' : 'primary'
      }}
      secondaryAction={{
        label: cancelLabel,
        onClick: onClose,
      }}
    >
      <div className={`mb-2 text-sm leading-relaxed ${isDestructive ? 'text-red-950 font-medium' : 'text-[#a3a3a3]'}`}>
        {description}
      </div>
      {requireString && (
        <div className="mt-4">
          <label className={`block text-xs font-bold mb-2 uppercase tracking-widest ${isDestructive ? 'text-red-800' : 'text-[#a3a3a3]'}`}>
            Digite {requireString} para confirmar
          </label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-colors ${
              isDestructive
                ? 'bg-red-50 border-red-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-red-950 placeholder:text-red-300'
                : 'bg-[#111111] border-[#333] focus:border-[#c9a263] text-white'
            }`}
            placeholder={requireString}
          />
        </div>
      )}
    </AdminPopup>
  );
}
