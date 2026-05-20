import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AdminPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  eyebrow?: React.ReactNode;
  statusBadge?: React.ReactNode;
  variant?: 'default' | 'danger' | 'operation';
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl' | '2xl' | 'premium' | 'operation';
  disableClickOutside?: boolean;
}

export function AdminPopup({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  eyebrow,
  statusBadge,
  variant = 'default',
  children, 
  footer, 
  size = 'lg',
  disableClickOutside = false
}: AdminPopupProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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
  }, [isOpen, onClose]);

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
          border: 'border-red-900/50',
          headerBg: 'bg-red-950/20',
          titleColor: 'text-red-50',
          closeBtn: 'text-red-400 hover:text-red-200 hover:bg-red-900/50'
        };
      case 'operation':
        return {
          border: 'border-[#c9a263]/20',
          headerBg: 'bg-[#0a0a0a]',
          titleColor: 'text-[#c9a263]',
          closeBtn: 'text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]'
        };
      default:
        return {
          border: 'border-[#c9a263]/20',
          headerBg: 'bg-[#111111]',
          titleColor: 'text-white',
          closeBtn: 'text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a]'
        };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !disableClickOutside && onClose()} 
            className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`relative w-full ${sizeClasses[size]} bg-[#fcfaf8] rounded-2xl sm:rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col z-10 max-h-[92dvh] sm:max-h-[90dvh] overflow-hidden border ${vStyles.border}`}
          >
            <div className={`flex items-start justify-between px-6 py-5 border-b ${vStyles.border} ${vStyles.headerBg} shrink-0`}>
              <div className="flex-1 min-w-0 pr-4">
                {eyebrow && <div className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] mb-1">{eyebrow}</div>}
                <div className="flex items-center gap-3">
                  <h2 className={`text-xl sm:text-2xl font-serif ${vStyles.titleColor} truncate`}>{title}</h2>
                  {statusBadge && <div>{statusBadge}</div>}
                </div>
                {subtitle && <p className="text-sm text-[#a3a3a3] mt-1 line-clamp-2">{subtitle}</p>}
              </div>
              <button 
                onClick={onClose}
                aria-label="Fechar"
                className={`p-2 rounded-full transition-colors shrink-0 outline-none border border-transparent hover:border-[#a3a3a3]/10 ${vStyles.closeBtn}`}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#fcfaf8]">
              {children}
            </div>

            {footer && (
              <div className="border-t border-[#a3a3a3]/10 bg-white px-6 py-4 flex items-center shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
