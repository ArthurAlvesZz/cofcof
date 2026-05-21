import React, { useState } from 'react';
import { AdminPageHeader } from './AdminPageHeader';
import { MapPin, Search, Edit, Trash2, ExternalLink, Plus, CheckCircle2, XCircle, Store, Eye, Check, AlertCircle } from 'lucide-react';
import { AdminPopup } from './ui/AdminPopup';
import { AdminDrawer } from './AdminDrawer';
import { AdminPublishChecklist } from './ui/AdminPublishChecklist';
import { AdminPublicPreview } from './ui/AdminPublicPreview';
import toast from 'react-hot-toast';
import { Partner } from '../../types';
import { mockPartners } from '../../data/seed';

export function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>(mockPartners);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);

  const filteredPartners = partners.filter(p => 
    (p.publicName || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || p.type || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (p?: Partner) => {
    if (p) {
      setEditingPartner(p);
    } else {
      setEditingPartner({
        publicName: '', category: 'Cafeteria', city: '', state: 'SP', neighborhood: '', address: '', active: false, lat: 0, lng: 0, status: 'inactive', isPendingValidation: true
      });
    }
    setIsFormOpen(true);
  };

  const getChecklist = (partner: Partial<Partner> | null) => {
    if (!partner) return [];
    return [
      { label: 'Nome Público preenchido', status: !!partner.publicName || !!partner.name, critical: true },
      { label: 'Categoria definida', status: !!partner.category, critical: true },
      { label: 'Endereço completo', status: !!partner.address, critical: true },
      { label: 'Coordenadas (Lat/Lng)', status: !!partner.lat && !!partner.lng, critical: true },
      { label: 'Localização confirmada', status: !!partner.coordinatesConfirmed, critical: true },
      { label: 'Descrição curta', status: !!partner.shortDescription, critical: true },
      { label: 'Horário de funcionamento', status: !!partner.openingHours, critical: false },
    ];
  };

  const currentChecklist = getChecklist(editingPartner);
  const canPublish = currentChecklist.filter(i => i.critical && !i.status).length === 0;

  const handleSave = (publish = false) => {
    if (!editingPartner?.publicName && !editingPartner?.name) {
      toast.error('Nome é obrigatório');
      return;
    }

    if (publish) {
      if (!canPublish) {
        toast.error('Preencha os itens obrigatórios antes de publicar');
        return;
      }
      editingPartner.active = true;
      editingPartner.status = 'published';
      editingPartner.isPendingValidation = false;
    } else {
      if (!editingPartner.active && (editingPartner.id || !canPublish)) {
         // Keep it inactive if saving draft
         editingPartner.active = false;
         editingPartner.status = 'inactive';
      }
    }

    if (editingPartner.id) {
      setPartners(partners.map(p => p.id === editingPartner.id ? { ...p, ...editingPartner } as Partner : p));
      toast.success(publish ? 'Parceiro publicado!' : 'Rascunho salvo!');
    } else {
      const newId = Math.random().toString();
      const name = editingPartner.publicName || editingPartner.name || '';
      setPartners([{ ...editingPartner, id: newId, slug: name.toLowerCase().replace(/\s+/g, '-') } as Partner, ...partners]);
      toast.success(publish ? 'Parceiro publicado!' : 'Parceiro salvo como rascunho!');
    }
    setIsFormOpen(false);
  };

  const toggleActive = (id: string, currentActive: boolean) => {
    const partner = partners.find(p => p.id === id);
    if (!currentActive && partner) {
      if (!partner.category || !partner.address || !partner.city || !partner.lat || !partner.lng || !partner.coordinatesConfirmed || !partner.shortDescription) {
        toast.error('Parceiro incompleto. Edite e confirme os dados de localização antes de ativar.');
        return;
      }
    }
    setPartners(partners.map(p => p.id === id ? { ...p, active: !currentActive, status: !currentActive ? 'published' : 'inactive', isPendingValidation: !currentActive ? false : p.isPendingValidation } : p));
    toast.success(!currentActive ? 'Parceiro reativado e publicado.' : 'Parceiro desativado.');
  };

  const handleAddressChange = (newAddress: string) => {
    setEditingPartner({
      ...editingPartner, 
      address: newAddress, 
      coordinatesConfirmed: false, 
      locationStatus: 'suggested' 
    });
  };

  return (
    <div className="pb-24">
       <AdminPageHeader
         title="Parceiros no Mapa"
         subtitle="Gerencie os parceiros e a rede CofCof exibidos na página Onde Encontrar."
         action={{
           label: "Novo Parceiro",
           onClick: () => handleOpenForm()
         }}
       />

       {/* Filters */}
       <div className="flex flex-col sm:flex-row gap-4 mb-6">
         <div className="relative flex-1 max-w-md">
           <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
           <input 
             type="text" 
             placeholder="Buscar por nome, cidade ou categoria..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-[#111111] border border-[#a3a3a3]/20 pl-10 pr-4 py-2.5 rounded-xl text-white focus:outline-none focus:border-[#c9a263]/50 text-sm"
           />
         </div>
       </div>

       <div className="bg-[#111111] border text-sm max-w-full overflow-x-auto border-[#c9a263]/20 rounded-2xl shadow-xl">
         <table className="w-full text-left whitespace-nowrap min-w-[900px]">
           <thead className="bg-[#1a1a1a] border-b border-white/10">
             <tr>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px]">Nome</th>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px]">Categoria</th>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px]">Localização</th>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px]">Status</th>
               <th className="px-6 py-4 font-medium text-[#a3a3a3] uppercase tracking-widest text-[10px] text-right">Ações</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-white/5">
             {filteredPartners.map(p => (
               <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                 <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       {p.coverImage ? (
                         <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-[#0a0a0a]">
                            <img src={p.coverImage} alt={p.publicName || p.name} className="w-full h-full object-cover" />
                         </div>
                       ) : (
                         <div className="w-10 h-10 rounded shrink-0 bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                            <Store size={18} className="text-[#a3a3a3]" />
                         </div>
                       )}
                       <div>
                         <div className="font-bold text-white flex items-center gap-2">
                           {p.publicName || p.name}
                           {p.featured && <span className="text-[#c9a263] text-[9px] uppercase tracking-widest bg-[#c9a263]/10 px-1.5 py-0.5 rounded border border-[#c9a263]/20">Destaque</span>}
                         </div>
                         <div className="text-[11px] text-[#a3a3a3] truncate max-w-[200px]">{p.shortDescription || 'Sem preview'}</div>
                       </div>
                    </div>
                 </td>
                 <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3] bg-[#0a0a0a] px-2 py-1 rounded border border-[#a3a3a3]/10">
                      {p.category || p.type}
                    </span>
                 </td>
                 <td className="px-6 py-4">
                   <div className="flex flex-col">
                     <span className="text-white text-sm flex items-center gap-1"><MapPin size={12} className="text-[#c9a263]" /> {p.city}, {p.state}</span>
                     <span className="text-[11px] text-[#a3a3a3]">{p.neighborhood}</span>
                   </div>
                 </td>
                 <td className="px-6 py-4">
                    {p.isPendingValidation ? (
                      <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        Pendente
                      </span>
                    ) : p.active ? (
                      <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        <CheckCircle2 size={12} /> Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        <XCircle size={12} /> Inativo
                      </span>
                    )}
                 </td>
                 <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <a href={`/parceiros/${p.slug}`} target="_blank" rel="noreferrer" className="p-2 text-[#a3a3a3] hover:text-[#c9a263] transition-colors rounded-lg hover:bg-[#0a0a0a]" title="Ver Página Pública">
                         <ExternalLink size={16} />
                       </a>
                       <button onClick={() => toggleActive(p.id, !!p.active)} className="p-2 text-[#a3a3a3] hover:text-white transition-colors rounded-lg hover:bg-[#0a0a0a]" title={p.active ? 'Desativar' : 'Ativar'}>
                         {p.active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                       </button>
                       <button onClick={() => handleOpenForm(p)} className="p-2 text-[#a3a3a3] hover:text-white transition-colors rounded-lg hover:bg-[#0a0a0a]" title="Editar">
                         <Edit size={16} />
                       </button>
                    </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>

       <AdminDrawer
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          width="xl"
          title={editingPartner?.id ? "Editar Parceiro" : "Novo Parceiro"}
          subtitle="Preencha as informações para que o parceiro apareça no mapa descritivo do site."
          statusBadge={editingPartner?.active ? <span className="px-2 py-0.5 rounded-full bg-green-100/10 text-green-500 text-[10px] font-bold uppercase tracking-wider border border-green-500/20">Publicado</span> : <span className="px-2 py-0.5 rounded-full bg-amber-100/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">Rascunho</span>}
          primaryAction={{
            label: "Publicar",
            onClick: () => handleSave(true)
          }}
          secondaryAction={{
            label: "Salvar Rascunho",
            onClick: () => handleSave(false)
          }}
          tertiaryAction={{
            label: "Cancelar",
            onClick: () => setIsFormOpen(false)
          }}
          variant="light"
       >
         <div className="flex flex-col lg:flex-row gap-8 pb-10 mt-6 text-[#0a0a0a]">
           
           <div className="flex-1 space-y-8">
             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-sm font-bold border-b pb-3 uppercase tracking-widest text-gray-500">1. Informações Básicas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Nome Público *</label>
                    <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] focus:ring-1 focus:ring-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.publicName || editingPartner?.name || ''} onChange={e => setEditingPartner({...editingPartner, publicName: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Categoria *</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] focus:ring-1 focus:ring-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.category || editingPartner?.type || ''} onChange={e => setEditingPartner({...editingPartner, category: e.target.value})}>
                      <option value="Cafeteria">Cafeteria</option>
                      <option value="Empório">Empório</option>
                      <option value="Restaurante">Restaurante</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Padaria">Padaria</option>
                      <option value="Posto">Posto</option>
                      <option value="Conveniência">Conveniência</option>
                      <option value="Revenda">Revenda</option>
                    </select>
                  </div>
                  <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Sub Categoria / Tipo</label>
                      <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] focus:ring-1 focus:ring-[#b06a32] outline-none transition-colors text-black placeholder:text-gray-400" placeholder="Ex: Cafeteria e Torrefação" value={editingPartner?.type || ''} onChange={e => setEditingPartner({...editingPartner, type: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Resumo Curto *</label>
                    <textarea rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] focus:ring-1 focus:ring-[#b06a32] outline-none transition-colors text-black resize-none" value={editingPartner?.shortDescription || ''} onChange={e => setEditingPartner({...editingPartner, shortDescription: e.target.value})} maxLength={120} />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Descrição Longa</label>
                    <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] focus:ring-1 focus:ring-[#b06a32] outline-none transition-colors text-black resize-none" value={editingPartner?.longDescription || ''} onChange={e => setEditingPartner({...editingPartner, longDescription: e.target.value})} />
                  </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-sm font-bold border-b pb-3 uppercase tracking-widest text-gray-500">2. Localização</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Endereço Completo *</label>
                     <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.address || ''} onChange={e => handleAddressChange(e.target.value)} />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Cidade</label>
                     <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.city || ''} onChange={e => setEditingPartner({ ...editingPartner, city: e.target.value, coordinatesConfirmed: false, locationStatus: 'suggested' })} />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Bairro</label>
                     <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.neighborhood || ''} onChange={e => setEditingPartner({ ...editingPartner, neighborhood: e.target.value, coordinatesConfirmed: false, locationStatus: 'suggested' })} />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Latitude</label>
                     <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.lat || 0} onChange={e => setEditingPartner({...editingPartner, lat: parseFloat(e.target.value) || 0, coordinatesConfirmed: false, locationStatus: 'suggested'})} />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Longitude</label>
                     <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.lng || 0} onChange={e => setEditingPartner({...editingPartner, lng: parseFloat(e.target.value) || 0, coordinatesConfirmed: false, locationStatus: 'suggested'})} />
                   </div>
                   
                   <div className="col-span-2 bg-[#fcfaf8] p-6 rounded-xl border border-[#b06a32]/20 mt-2">
                     <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin size={18} className="text-[#b06a32]" />
                          <span className="font-bold text-sm text-[#0a0a0a]">Validação da Localização *</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">O parceiro só pode ser publicado quando a localização for validada manualmente. Confirme se o PIN aponta exatamente para a entrada no mapa.</p>
                        
                        <div className="flex flex-wrap gap-2">
                           <a href={`https://www.google.com/maps/search/?api=1&query=${editingPartner?.lat},${editingPartner?.lng}`} target="_blank" rel="noreferrer" className="bg-white border border-gray-200 hover:border-gray-400 text-gray-800 text-xs px-4 py-2 flex items-center gap-1.5 rounded-lg transition-colors font-medium cursor-pointer">
                             🗺️ Verificar no Google
                           </a>
                           <button 
                              type="button" 
                              onClick={() => {
                                if (editingPartner?.lat && editingPartner?.lng) {
                                  setEditingPartner({...editingPartner, coordinatesConfirmed: true, locationStatus: 'confirmed'});
                                  toast.success("Localização confirmada!");
                                } else {
                                  toast.error("Preencha LAT e LNG primeiro");
                                }
                              }}
                              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${editingPartner?.coordinatesConfirmed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 pointer-events-none' : 'bg-[#111111] text-white hover:bg-[#b06a32]'}`}
                           >
                             {editingPartner?.coordinatesConfirmed ? <><Check size={14} /> Confirmada</> : 'Confirmar Localização'}
                           </button>
                        </div>
                     </div>
                     
                     {!editingPartner?.coordinatesConfirmed && (
                       <div className="mt-4 bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-200 flex items-start gap-2">
                         <AlertCircle size={14} className="shrink-0 mt-0.5" />
                         <p>Pendente de validação. Parceiro não aparecerá no mapa com essa configuração.</p>
                       </div>
                     )}
                   </div>
                </div>
             </div>

             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-sm font-bold border-b pb-3 uppercase tracking-widest text-gray-500">3. Informações de Contato</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Horário Simplificado</label>
                     <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.openingHours || ''} onChange={e => setEditingPartner({...editingPartner, openingHours: e.target.value})} placeholder="Ex: Seg-Sex: 8h as 18h" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Instagram</label>
                     <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.instagram || ''} onChange={e => setEditingPartner({...editingPartner, instagram: e.target.value})} placeholder="@nomedolocal" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">WhatsApp</label>
                     <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#b06a32] outline-none transition-colors text-black" value={editingPartner?.whatsapp || ''} onChange={e => setEditingPartner({...editingPartner, whatsapp: e.target.value})} placeholder="551199999999" />
                   </div>
                </div>
             </div>
           </div>
           
           <div className="lg:w-[360px] shrink-0 space-y-6">
             <AdminPublishChecklist items={currentChecklist.map(i => ({ label: i.label, complete: i.status, critical: i.critical }))} />
             
             <AdminPublicPreview title="Preview do Card Flutuante" description="Como este parceiro aparecerá no mapa para os clientes">
               <div className="bg-white p-5 m-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#a3a3a3]/10 max-w-[280px] mx-auto text-center relative pointer-events-none mt-10">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-[#0a0a0a] rounded-full border-[3px] border-white shadow-md flex items-center justify-center">
                     <Store size={20} className="text-white" />
                  </div>
                  <div className="pt-6">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-[#c9a263] mb-1 block">{editingPartner?.category || 'Categoria'}</span>
                    <h3 className="font-serif text-lg font-bold text-[#0a0a0a] leading-tight mb-2 truncate px-2">{editingPartner?.publicName || editingPartner?.name || 'Nome do Parceiro'}</h3>
                    <p className="text-xs text-[#a3a3a3] mb-4 line-clamp-2">{editingPartner?.shortDescription || 'Adicione uma descrição curta...'}</p>
                    <div className="w-full py-2 bg-[#fcfaf8] rounded-lg text-[10px] font-bold uppercase tracking-widest text-[#0a0a0a]">
                       Ver Detalhes
                    </div>
                  </div>
               </div>
             </AdminPublicPreview>

             <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Flags de Sistema</h3>
                
                <div className="flex flex-col gap-4">
                  <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={editingPartner?.featured || false} onChange={e => setEditingPartner({...editingPartner, featured: e.target.checked})} className="w-5 h-5 mt-0.5 accent-[#b06a32]" />
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0a0a0a]">Destaque no Mapa</span>
                      <span className="text-[10px] text-gray-500">Exibir com Pin Maior e animação.</span>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={editingPartner?.isOpen24h || false} onChange={e => setEditingPartner({...editingPartner, isOpen24h: e.target.checked})} className="w-5 h-5 mt-0.5 accent-[#b06a32]" />
                    <div className="flex flex-col">
                      <span className="font-bold text-[#0a0a0a]">Aberto 24 horas</span>
                      <span className="text-[10px] text-gray-500">Adiciona tag especial de disponibilidade.</span>
                    </div>
                  </label>
                </div>
             </div>
           </div>

         </div>
       </AdminDrawer>
    </div>
  );
}
