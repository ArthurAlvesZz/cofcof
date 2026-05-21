import React, { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AdminPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  statusBadge?: React.ReactNode;
  variant?: 'default' | 'danger' | 'operation' | 'dark';
  intent?: "create" | "edit" | "review" | "publish" | "confirm" | "insight";
  preventBackdropClose?: boolean;
  isDirty?: boolean;
  isBusy?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | 'premium' | 'operation';
  disableClickOutside?: boolean; // Keep for backward compatibility
  primaryAction?: {
    label: string;
    onClick: () => void | Promise<void>;
    disabled?: boolean;
    loading?: boolean;
    variant?: "primary" | "danger";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  tertiaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function AdminPopup({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  eyebrow,
  statusBadge,
  variant = 'default',
  intent,
  preventBackdropClose,
  isDirty,
  isBusy,
  children, 
  footer, 
  size = 'lg',
  disableClickOutside = false,
  primaryAction,
  secondaryAction,
  tertiaryAction
}: AdminPopupProps) {

  const canCloseOutside = !disableClickOutside && !preventBackdropClose && !isDirty && !isBusy;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canCloseOutside) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, canCloseOutside]);

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    '2xl': 'max-w-7xl',
    premium: 'max-w-[1180px]',
    operation: 'max-w-[1040px] w-[calc(100vw-32px)]'
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          border: 'border-red-200/50',
          headerBg: 'bg-red-50/50',
          titleColor: 'text-red-950',
          subtitleColor: 'text-red-800/70',
          closeBtn: 'text-red-400 hover:text-red-600 hover:bg-red-100/50',
          bodyBg: 'bg-[#fcfaf8]',
          eyebrowColor: 'text-red-700/60'
        };
      case 'operation':
        return {
          border: 'border-[#c9a263]/20',
          headerBg: 'bg-[#1a1a1a]',
          titleColor: 'text-white',
          subtitleColor: 'text-[#a3a3a3]',
          closeBtn: 'text-[#a3a3a3] hover:text-white hover:bg-white/10',
          bodyBg: 'bg-[#111111]',
          eyebrowColor: 'text-[#c9a263]'
        };
      case 'dark':
        return {
          border: 'border-[#333]',
          headerBg: 'bg-[#0a0a0a]',
          titleColor: 'text-white',
          subtitleColor: 'text-[#a3a3a3]',
          closeBtn: 'text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]',
          bodyBg: 'bg-[#111111]',
          eyebrowColor: 'text-[#c9a263]'
        };
      default:
        // default / create / edit
        return {
          border: 'border-[#c9a263]/20',
          headerBg: 'bg-[#111111]',
          titleColor: 'text-white',
          subtitleColor: 'text-[#a3a3a3]',
          closeBtn: 'text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]',
          bodyBg: 'bg-[#fcfaf8]',
          eyebrowColor: 'text-[#c9a263]'
        };
    }
  };

  const vStyles = getVariantStyles();

  // Custom standard footer logic
  const renderFooter = () => {
    if (footer) return footer;

    if (primaryAction || secondaryAction || tertiaryAction) {
      return (
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
          <div className="w-full sm:w-auto">
            {tertiaryAction && (
              <button
                onClick={tertiaryAction.onClick}
                disabled={isBusy}
                className="w-full sm:w-auto px-4 py-2 text-sm font-bold text-[#a3a3a3] hover:text-[#0a0a0a] transition-colors disabled:opacity-50"
              >
                {tertiaryAction.label}
              </button>
            )}
          </div>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                disabled={isBusy}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 border ${variant === 'dark' || variant === 'operation' ? 'border-[#333] text-white hover:bg-[#1a1a1a]' : 'border-[#a3a3a3]/20 text-[#0a0a0a] hover:border-[#0a0a0a]'}`}
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled || isBusy || primaryAction.loading}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                  ${(primaryAction.variant === 'danger' || variant === 'danger')
                    ? 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md'
                    : (variant === 'dark' || variant === 'operation') 
                      ? 'bg-[#c9a263] text-black hover:bg-[#d4b075] hover:shadow-md'
                      : 'bg-[#0a0a0a] text-white hover:bg-black hover:shadow-md hover:shadow-black/20'
                  }`}
              >
                {primaryAction.loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {primaryAction.label}
              </button>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const generatedFooter = renderFooter();

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-popup-title"
          aria-describedby={subtitle ? "admin-popup-subtitle" : undefined}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => canCloseOutside && onClose()} 
            className="absolute inset-0 bg-[#0a0a0a]/70 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${sizeClasses[size]} rounded-[20px] sm:rounded-[24px] shadow-2xl flex flex-col z-10 max-h-[92dvh] sm:max-h-[90dvh] overflow-hidden border ${vStyles.border} ${vStyles.bodyBg}`}
          >
            {/* Header */}
            <div className={`flex items-start justify-between px-6 py-5 border-b ${vStyles.border} ${vStyles.headerBg} shrink-0`}>
              <div className="flex-1 min-w-0 pr-4">
                {eyebrow && <div className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${vStyles.eyebrowColor}`}>{eyebrow}</div>}
                <div className="flex items-center gap-3">
                  {variant === 'danger' && <AlertCircle size={24} className="text-red-500 shrink-0" />}
                  <h2 id="admin-popup-title" className={`text-xl sm:text-2xl font-serif ${vStyles.titleColor} truncate`}>{title}</h2>
                  {statusBadge && <div className="shrink-0">{statusBadge}</div>}
                </div>
                {subtitle && <p id="admin-popup-subtitle" className={`text-sm mt-1.5 line-clamp-2 ${vStyles.subtitleColor}`}>{subtitle}</p>}
              </div>
              <button 
                onClick={onClose}
                aria-label="Fechar"
                disabled={isBusy}
                className={`p-2 rounded-full transition-colors shrink-0 outline-none border border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${vStyles.closeBtn}`}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className={`flex-1 overflow-y-auto p-5 sm:p-6 custom-scrollbar ${vStyles.bodyBg}`}>
              {children}
            </div>

            {/* Footer */}
            {generatedFooter && (
              <div className={`border-t px-6 py-4 flex items-center shrink-0 ${variant === 'dark' || variant === 'operation' ? 'border-[#333] bg-[#0a0a0a]' : 'border-[#a3a3a3]/10 bg-white'}`}>
                {generatedFooter}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
