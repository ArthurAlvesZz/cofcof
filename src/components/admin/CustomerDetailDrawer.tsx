import React, { useState } from 'react';
import { CustomerAdmin } from '../../types/admin';
import { ExternalLink, MessageCircle, Mail, MapPin, Briefcase, Star, ShoppingBag, Clock, Send, Archive } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminDrawer } from './AdminDrawer';

interface CustomerDetailDrawerProps {
  customer: CustomerAdmin | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<CustomerAdmin>) => void;
  onAddNote: (id: string, text: string) => void;
}

export function CustomerDetailDrawer({ customer, isOpen, onClose, onUpdate, onAddNote }: CustomerDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'financial' | 'b2b' | 'subscription' | 'notes'>('overview');
  const [noteText, setNoteText] = useState('');

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'b2b': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'b2c': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'partner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'subscription': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-200 text-gray-600';
      case 'pending_payment': return 'bg-red-100 text-red-800';
      case 'recurring': return 'bg-emerald-100 text-emerald-800';
      case 'new': return 'bg-amber-100 text-amber-800';
      case 'vip': return 'bg-yellow-100 text-yellow-800 font-bold border-yellow-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (t: string) => ({ b2b: 'B2B', b2c: 'B2C', partner: 'Parceiro', subscription: 'Assinante', consignment: 'Consignação', lead_converted: 'Lead Convertido' }[t] || t);
  const getStatusLabel = (s: string) => ({ active: 'Ativo', inactive: 'Inativo', pending_payment: 'Com Pendência', recurring: 'Recorrente', new: 'Novo', vip: 'VIP', archived: 'Arquivado' }[s] || s);

  const handleAddNote = () => {
    if (!noteText.trim() || !customer) return;
    onAddNote(customer.id, noteText);
    setNoteText('');
  };

  const openWhatsApp = (msgType: 'general' | 'reminder' | 'b2b' | 'reactivation') => {
    if (!customer?.whatsapp) return;
    let text = `Olá, ${customer.name}! `;
    switch (msgType) {
      case 'reminder': text += `Tudo bem? Passando para lembrar do valor em aberto referente aos cafés CofCof. Valor pendente: R$ ${customer.stats.totalPending.toFixed(2)}. Podemos acertar por Pix?`; break;
      case 'reactivation': text += `Faz um tempo que você não pede CofCof. Chegaram novos lotes selecionados e achei que poderia gostar.`; break;
      case 'b2b': text += `Podemos montar uma sugestão de fornecimento de café especial para o escritório?`; break;
      default: text += "Aqui é da CofCof. ";
    }
    window.open(`https://wa.me/55${customer.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!customer) return null;

  const headerContent = (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl font-serif text-white">{customer.name}</span>
        {customer.company?.name && <span className="text-sm font-medium text-gray-500">@{customer.company.name}</span>}
      </div>
      <div className="flex flex-wrap gap-2 items-center mt-2">
         <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTypeColor(customer.type)} uppercase`}>{getTypeLabel(customer.type)}</span>
         <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>{getStatusLabel(customer.status)}</span>
         {customer.tags?.map(t => (
           <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] uppercase font-bold">{t}</span>
         ))}
      </div>
      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-4 mt-6 -mb-5 border-b border-[#333] scrollbar-hide">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'orders', label: 'Pedidos', count: customer.stats.totalOrders },
          { id: 'financial', label: 'Financeiro', alert: customer.stats.totalPending > 0 },
          { id: 'b2b', label: 'B2B / Empresa', hide: customer.type !== 'b2b' && !customer.company?.name },
          { id: 'subscription', label: 'Assinatura', hide: !customer.subscription?.interested },
          { id: 'notes', label: 'Observações' }
        ].filter(t => !t.hide).map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-1 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-[#c9a263] text-white' : 'border-transparent text-[#a3a3a3] hover:text-white'}`}
          >
            {tab.label}
            {tab.count !== undefined && <span className="ml-2 bg-[#1a1a1a] text-[#a3a3a3] px-1.5 py-0.5 rounded-full text-xs">{tab.count}</span>}
            {tab.alert && <span className="ml-1.5 w-2 h-2 inline-block rounded-full bg-red-500" />}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AdminDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={headerContent}
      width="lg"
      variant="dark"
      footer={
         <div className="flex justify-between items-center w-full">
             <button onClick={() => openWhatsApp('general')} className="px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
               <MessageCircle size={16} /> Falar no WhatsApp
             </button>
             <button onClick={onClose} className="px-5 py-2 text-sm font-bold text-[#a3a3a3] bg-transparent border border-[#333] hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-colors">
               Fechar
             </button>
         </div>
      }
    >
       {/* Tab Content */}
       <div className="space-y-4 pt-2">
         {activeTab === 'overview' && (
           <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-[#B06A32]" />
                   <h3 className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider mb-4 flex items-center gap-2"><Briefcase size={16}/> Contato</h3>
                   <div className="space-y-3 text-sm">
                     {customer.whatsapp && <div className="flex justify-between border-b border-[#333]/50 pb-2"><span className="text-[#a3a3a3]">WhatsApp:</span> <span className="font-medium text-white">{customer.whatsapp}</span></div>}
                     {customer.email && <div className="flex justify-between border-b border-[#333]/50 pb-2"><span className="text-[#a3a3a3]">E-mail:</span> <span className="font-medium text-white">{customer.email}</span></div>}
                     {(customer.cpf || customer.cnpj) && <div className="flex justify-between border-b border-[#333]/50 pb-2"><span className="text-[#a3a3a3]">Documento:</span> <span className="font-medium text-white">{customer.cpf || customer.cnpj}</span></div>}
                     <div className="flex justify-between pt-1"><span className="text-[#a3a3a3]">Origem:</span> <span className="font-bold uppercase text-xs text-white">{customer.source}</span></div>
                   </div>
                </div>
                <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-white" />
                   <h3 className="text-xs font-bold text-[#a3a3a3] uppercase tracking-wider mb-4 flex items-center gap-2"><ShoppingBag size={16}/> Resumo de Vendas</h3>
                   <div className="space-y-3 text-sm">
                     <div className="flex justify-between border-b border-[#333]/50 pb-2"><span className="text-[#a3a3a3]">Total Gasto:</span> <span className="font-medium text-emerald-400">R$ {customer.stats.totalSpent.toFixed(2)}</span></div>
                     <div className="flex justify-between border-b border-[#333]/50 pb-2"><span className="text-[#a3a3a3]">Ticket Médio:</span> <span className="font-medium text-white">R$ {customer.stats.averageTicket.toFixed(2)}</span></div>
                     <div className="flex justify-between border-b border-[#333]/50 pb-2"><span className="text-[#a3a3a3]">Pedidos:</span> <span className="font-medium text-white">{customer.stats.totalOrders}</span></div>
                     <div className="flex justify-between border-b border-[#333]/50 pb-2"><span className="text-[#a3a3a3]">Primeira Compra:</span> <span className="text-white">{customer.stats.firstOrderAt ? new Date(customer.stats.firstOrderAt).toLocaleDateString() : '-'}</span></div>
                     <div className="flex justify-between pt-1"><span className="text-[#a3a3a3]">Última Compra:</span> <span className="text-white">{customer.stats.lastOrderAt ? new Date(customer.stats.lastOrderAt).toLocaleDateString() : '-'}</span></div>
                   </div>
                </div>
             </div>

             {customer.address?.city && (
               <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] shadow-sm flex items-start gap-4">
                 <div className="p-3 bg-[#111] text-[#a3a3a3] rounded-xl border border-[#333]"><MapPin size={24} /></div>
                 <div className="flex-1">
                   <h3 className="font-bold text-white mb-1">Endereço Principal</h3>
                   <p className="text-sm text-[#a3a3a3] leading-relaxed">
                     {customer.address.street}{customer.address.number && `, ${customer.address.number}`} {customer.address.complement && ` - ${customer.address.complement}`}
                     <br />
                     {customer.address.neighborhood} - {customer.address.city} / {customer.address.state}
                     <br />
                     CEP: {customer.address.cep}
                   </p>
                 </div>
               </div>
             )}

             <div className="flex gap-3">
                <button onClick={() => openWhatsApp('reactivation')} className="px-4 py-2 bg-transparent border border-[#333] rounded-xl text-sm font-bold hover:bg-[#1a1a1a] shadow-sm text-white">
                  Mensagem de Reativação
                </button>
                {customer.stats.totalPending > 0 && (
                  <button onClick={() => openWhatsApp('reminder')} className="px-4 py-2 bg-red-900/20 text-red-500 border border-red-900/30 rounded-xl text-sm font-bold hover:bg-red-900/40 shadow-sm">
                    Cobrar Pendência (R$ {customer.stats.totalPending.toFixed(2)})
                  </button>
                )}
             </div>
           </div>
         )}

         {activeTab === 'notes' && (
           <div className="space-y-4 max-w-2xl mx-auto">
             <div className="bg-[#1a1a1a] p-5 rounded-2xl border border-[#333] shadow-sm">
               <h3 className="font-bold text-white mb-4">Adicionar Observação</h3>
               <textarea 
                 value={noteText}
                 onChange={e => setNoteText(e.target.value)}
                 className="w-full bg-[#111] border border-[#333] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#c9a263] focus:ring-1 focus:ring-[#c9a263] resize-none h-24 mb-3 placeholder:text-[#333]"
                 placeholder="Ex: Cliente prefere moagem fina, sempre enviar junto com pedido X..."
               />
               <div className="flex justify-end">
                 <button onClick={handleAddNote} className="px-4 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-[#c9a263] flex items-center gap-2 transition-colors">
                   <Send size={16} /> Salvar Observação
                 </button>
               </div>
             </div>

             <div className="space-y-3 pt-4">
               <h3 className="font-bold text-white mb-2">Histórico</h3>
               {customer.notes && customer.notes.length > 0 ? (
                 customer.notes.map(note => (
                   <div key={note.id} className="bg-[#111] border border-[#333] p-4 rounded-xl">
                     <p className="text-white text-sm whitespace-pre-wrap">{note.text}</p>
                     <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#333] text-xs text-[#a3a3a3]">
                       <span className="font-medium text-[#c9a263]">{note.userName}</span>
                       <span>{new Date(note.createdAt).toLocaleString()}</span>
                     </div>
                   </div>
                 )).reverse()
               ) : (
                 <div className="p-8 text-center text-[#a3a3a3] border border-dashed border-[#333] rounded-xl bg-[#111]">
                   Nenhuma observação registrada neste cliente.
                 </div>
               )}
             </div>
           </div>
         )}

         {activeTab === 'orders' && (
           <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] shadow-sm p-12 text-center">
             <ShoppingBag size={48} className="mx-auto text-[#333] mb-4" />
             <h3 className="text-lg font-bold text-white mb-2">Histórico de Pedidos Pendente</h3>
             <p className="text-sm text-[#a3a3a3] mb-4">Os pedidos deste cliente ({customer.stats.totalOrders}) serão carregados aqui dinamicamente através do OrderService no futuro.</p>
           </div>
         )}
         
         {activeTab === 'financial' && (
           <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] shadow-sm p-6 max-w-xl mx-auto">
              <h3 className="font-serif text-xl border-b border-[#333] pb-4 mb-4 text-white">Resumo Financeiro</h3>
              <div className="space-y-3">
                 <div className="flex justify-between items-center p-4 bg-[#111] border border-[#333] rounded-xl">
                   <span className="text-[#a3a3a3] font-medium">Total Comprado</span>
                   <span className="font-bold text-lg text-white">R$ {customer.stats.totalSpent.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center p-4 bg-emerald-900/10 border border-emerald-900/20 rounded-xl text-emerald-400">
                   <span className="font-medium">Total Pago</span>
                   <span className="font-bold text-lg">R$ {customer.stats.totalPaid.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center p-5 bg-red-900/10 border border-red-900/30 rounded-xl text-red-500 shadow-sm mt-2">
                   <span className="font-bold">Saldo Pendente (Em Aberto)</span>
                   <span className="font-bold text-xl">R$ {customer.stats.totalPending.toFixed(2)}</span>
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'b2b' && customer.company && (
           <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#333] shadow-sm max-w-2xl mx-auto">
             <h3 className="font-serif text-xl mb-6 text-white">Dados Comerciais / Empresa</h3>
             <div className="grid grid-cols-2 gap-4 text-sm">
               <div className="col-span-2 sm:col-span-1">
                 <label className="block text-xs font-bold text-[#a3a3a3] uppercase mb-1">Empresa</label>
                 <div className="p-3 bg-[#111] border border-[#333] rounded-xl font-medium text-white">{customer.company.name || '-'}</div>
               </div>
               <div className="col-span-2 sm:col-span-1">
                 <label className="block text-xs font-bold text-[#a3a3a3] uppercase mb-1">CNPJ</label>
                 <div className="p-3 bg-[#111] border border-[#333] rounded-xl font-medium text-white">{customer.company.cnpj || '-'}</div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-[#a3a3a3] uppercase mb-1">Segmento</label>
                 <div className="p-3 bg-[#111] border border-[#333] rounded-xl font-medium text-white">{customer.company.segment || '-'}</div>
               </div>
               <div>
                 <label className="block text-xs font-bold text-[#a3a3a3] uppercase mb-1">Estimativa (Kg/Mês)</label>
                 <div className="p-3 bg-[#111] border border-[#333] rounded-xl font-medium text-white">{customer.company.estimatedMonthlyKg || 0} Kg</div>
               </div>
               <div className="col-span-2 mt-2">
                 <label className="block text-xs font-bold text-[#a3a3a3] uppercase mb-1">Status Comercial</label>
                 <div className="inline-block px-3 py-1.5 bg-blue-900/20 text-blue-400 rounded-lg font-bold uppercase text-xs tracking-wider border border-blue-900/30">
                   {customer.company.commercialStatus || 'novo'}
                 </div>
               </div>
             </div>
           </div>
         )}
       </div>
    </AdminDrawer>
  );
}
