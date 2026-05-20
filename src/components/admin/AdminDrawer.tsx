import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl';
}

export function AdminDrawer({ isOpen, onClose, title, subtitle, children, footer, width = 'md' }: AdminDrawerProps) {
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

  const widthClasses = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-sm transition-opacity" 
          />
          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`w-screen ${widthClasses[width]}`}
            >
              <div className="flex h-full flex-col bg-[#fcfaf8] shadow-2xl">
                <div className="flex items-start justify-between px-6 py-5 border-b border-[#c9a263]/20 bg-[#111111] shrink-0">
                  <div>
                    <h2 className="text-xl font-serif text-white">{title}</h2>
                    {subtitle && <p className="text-sm text-[#a3a3a3] mt-1">{subtitle}</p>}
                  </div>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-2 text-[#a3a3a3] hover:text-white hover:bg-[#1a1a1a] rounded-full transition-colors shrink-0 outline-none border border-transparent hover:border-[#a3a3a3]/10"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
                <div className="relative flex-1 px-4 sm:px-6 py-6 overflow-y-auto custom-scrollbar">
                  {children}
                </div>
                {footer && (
                  <div className="flex-shrink-0 border-t border-[#a3a3a3]/10 bg-white px-6 py-4 flex items-center justify-between">
                    {footer}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
