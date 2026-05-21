import React from 'react';
import { Eye, Monitor, Smartphone } from 'lucide-react';

export interface AdminPublicPreviewProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function AdminPublicPreview({ title = 'Live Preview', description, children }: AdminPublicPreviewProps) {
  return (
    <div className="bg-white rounded-[24px] border border-[#a3a3a3]/20 overflow-hidden shadow-xl shadow-black/5">
      <div className="bg-[#111111] px-5 py-4 border-b border-[#333]">
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
             <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{title}</span>
           </div>
           <div className="flex gap-2">
             <div className="p-1 pb-0.5 border-b-2 border-white text-white">
               <Monitor size={14} />
             </div>
           </div>
         </div>
         {description && (
           <p className="mt-2 text-[10px] text-[#a3a3a3] leading-relaxed opacity-80">{description}</p>
         )}
      </div>
      
      <div className="bg-[#fcfaf8] p-[2px] flex justify-center items-center relative overflow-hidden">
        {/* Subtle dot pattern background to simulate a neutral studio context */}
        <div className="absolute inset-0 bg-[radial-gradient(#d1cfcd_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
        <div className="relative w-full">
           {children}
        </div>
      </div>
    </div>
  );
}
