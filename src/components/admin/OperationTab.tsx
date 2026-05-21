import React, { useState, useEffect, Suspense, lazy, useCallback, useRef } from 'react';
import { 
  Scale, 
  Target, 
  Flame, 
  Package, 
  Layers, 
  Handshake, 
  Clock, 
  AlertTriangle,
  History,
  Search,
  RefreshCcw,
  Zap,
  Calendar,
  ChevronDown,
  TrendingDown,
  TrendingUp,
  Minus,
  Briefcase,
  DollarSign,
  Users,
  ChevronRight,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminStatCard } from './AdminStatCard';
import { operationService } from '../../services/operationService';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { toast } from 'react-hot-toast';
import { OperationCockpit } from './operation/OperationCockpit';

// Sub-components (Lazy)
const ProductionFlow = lazy(() => import('./operation/ProductionFlow').then(m => ({ default: m.ProductionFlow })));
const StockOverview = lazy(() => import('./operation/StockOverview').then(m => ({ default: m.StockOverview })));
const ConsignmentsOverview = lazy(() => import('./operation/ConsignmentsOverview').then(m => ({ default: m.ConsignmentsOverview })));
const RoasterHoursControl = lazy(() => import('./operation/RoasterHoursControl').then(m => ({ default: m.RoasterHoursControl })));
const GlobalMovements = lazy(() => import('./operation/GlobalMovements').then(m => ({ default: m.GlobalMovements })));
const DailyOverview = lazy(() => import('./operation/DailyOverview').then(m => ({ default: m.DailyOverview })));
const FinancialOverview = lazy(() => import('./operation/FinancialOverview').then(m => ({ default: m.FinancialOverview })));
const AuditTrailOverview = lazy(() => import('./operation/AuditTrailOverview').then(m => ({ default: m.AuditTrailOverview })));

// Modals (Lazy)
const RoastModal = lazy(() => import('./operation/modals/RoastModal').then(m => ({ default: m.RoastModal })));
const PackagingModal = lazy(() => import('./operation/modals/PackagingModal').then(m => ({ default: m.PackagingModal })));
const TimeEntryModal = lazy(() => import('./operation/modals/TimeEntryModal').then(m => ({ default: m.TimeEntryModal })));
const LaunchLotModal = lazy(() => import('./operation/modals/LaunchLotModal').then(m => ({ default: m.LaunchLotModal })));
const OperationInsightModal = lazy(() => import('./operation/modals/OperationInsightModal').then(m => ({ default: m.OperationInsightModal })));
const NewOperationModal = lazy(() => import('./operation/modals/NewOperationModal').then(m => ({ default: m.NewOperationModal })));
const ConsignmentModal = lazy(() => import('./operation/modals/ConsignmentModal').then(m => ({ default: m.ConsignmentModal })));
const SettleConsignmentModal = lazy(() => import('./operation/modals/SettleConsignmentModal').then(m => ({ default: m.SettleConsignmentModal })));
const AdjustStockModal = lazy(() => import('./operation/modals/AdjustStockModal').then(m => ({ default: m.AdjustStockModal })));
const CourtesyModal = lazy(() => import('./operation/modals/CourtesyModal').then(m => ({ default: m.CourtesyModal })));
import { OperationPrerequisiteModal, OperationConfirmModal } from './operation/modals/OperationFeedbackModals';
import { adminLogService } from '../../services/adminLogService';

type OperationMode = 'cockpit' | 'diario' | 'lancamentos' | 'estoque' | 'consignacoes' | 'financeiro' | 'horas' | 'auditoria';
type PeriodOption = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'custom';

export function OperationTab() {
  const [mode, setMode] = useState<OperationMode>('cockpit');
  const [period, setPeriod] = useState<PeriodOption>('today');
  const [dates, setDates] = useState<{start: Date, end: Date}>({ start: new Date(), end: new Date() });
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [insightModal, setInsightModal] = useState<{isOpen: boolean, type: string | null}>({ isOpen: false, type: null });
  const { user } = useAdminAuthStore();

  const [isLaunchLotModalOpen, setIsLaunchLotModalOpen] = useState(false);
  const [isRoastModalOpen, setIsRoastModalOpen] = useState(false);
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isOperationMenuOpen, setIsOperationMenuOpen] = useState(false);
  const [isConfirmClosePeriodOpen, setConfirmClosePeriodOpen] = useState(false);
  const [isConsignmentModalOpen, setIsConsignmentModalOpen] = useState(false);
  const [isSettleConsignmentModalOpen, setIsSettleConsignmentModalOpen] = useState(false);
  const [isAdjustStockModalOpen, setIsAdjustStockModalOpen] = useState(false);
  const [isCourtesyModalOpen, setIsCourtesyModalOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Modais de feedback
  const [prerequisiteModal, setPrerequisiteModal] = useState<{isOpen: boolean, actionParams: any}>({isOpen: false, actionParams: null});

  const performOperationalSearch = (query: string) => {
     if (!query.trim()) {
        setSearchResults([]);
        setIsSearchOpen(false);
        return;
     }
     
     // Simulando uma busca rápida nos mock/fallback (na vida real isso chamaria um debounce fetch)
     const q = query.toLowerCase();
     const results: any[] = [];
     
     if (q.includes('lote') || q.includes('cru')) {
        results.push({ type: 'lote', title: 'Ver todos os lotes', description: 'Abrir gestão de lotes', action: 'view_raw_stock' });
     }
     if (q.includes('torra')) {
        results.push({ type: 'torra', title: 'Ver todas as torras', description: 'Histórico e lançamentos', action: 'view_roasted' });
     }
     if (q.includes('cliente') || q.includes('parceiro')) {
        results.push({ type: 'cliente', title: 'Consultar módulo de parceiros', description: 'Abrir menu lateral', action: 'view_b2b_module' });
     }
     
     if (results.length === 0) {
        results.push({ type: 'empty', title: 'Nenhum resultado operacional encontrado.', description: 'Tente buscar por termos como lote, torra, cliente.'});
     }
     
     setSearchResults(results);
     setIsSearchOpen(true);
  };

  const handleOperationAction = (actionType: string) => {
    // Fecha menu de operações se estiver aberto
    setIsOperationMenuOpen(false);
    
    switch(actionType) {
      case 'launch_lot':
      case 'launchLot':
        setIsLaunchLotModalOpen(true);
        break;
      case 'register_roast':
      case 'roast':
        if ((stats?.activeLotsCount || 0) === 0 && (stats?.rawKgAvailable || 0) === 0) {
           setPrerequisiteModal({
             isOpen: true,
             actionParams: {
               title: 'Você precisa lançar um lote primeiro',
               description: 'Para registrar uma torra, é necessário ter café cru disponível em pelo menos um lote ativo.',
               missingRequirements: ['Lote de café cru com estoque > 0'],
               primaryActionLabel: 'Lançar novo lote',
               onPrimaryAction: () => handleOperationAction('launch_lot')
             }
           });
        } else {
           setIsRoastModalOpen(true);
        }
        break;
      case 'package_coffee':
      case 'pack':
        if ((stats?.roastedKgAvailable || 0) <= 0) {
           setPrerequisiteModal({
             isOpen: true,
             actionParams: {
               title: 'Restrição de empacotamento',
               description: 'Para empacotar produtos, você precisa ter saldo de café torrado disponível. Registre uma torra primeiro.',
               missingRequirements: ['Café torrado aguardando empacotamento com saldo > 0kg'],
               primaryActionLabel: 'Registrar torra agora',
               onPrimaryAction: () => handleOperationAction('register_roast')
             }
           });
        } else {
           setIsPackModalOpen(true);
        }
        break;
      case 'create_consignment':
      case 'consignment':
        if ((stats?.finishedStockUnits || 0) <= 0) {
           setPrerequisiteModal({
             isOpen: true,
             actionParams: {
               title: 'Estoque insuficiente',
               description: 'Você precisa ter produtos finalizados em estoque para iniciar uma consignação.',
               missingRequirements: ['Pacotes de café disponíveis no estoque'],
               primaryActionLabel: 'Empacotar lote',
               onPrimaryAction: () => handleOperationAction('package_coffee')
             }
           });
        } else {
           setIsConsignmentModalOpen(true);
        }
        break;
      case 'settle_consignment':
      case 'settleConsignment':
        setIsSettleConsignmentModalOpen(true);
        break;
      case 'launch_hours':
      case 'timeEntry':
      case 'log_hours':
        setIsTimeModalOpen(true);
        break;
      case 'adjust_stock':
        setIsAdjustStockModalOpen(true);
        break;
      case 'close_period':
        if ((stats?.criticalAlertsCount + stats?.overdueConsignmentsCount) > 0) {
            setPrerequisiteModal({
              isOpen: true,
              actionParams: {
                title: 'Bloqueio de Fechamento',
                description: 'Existem pendências operacionais que devem ser resolvidas antes do fechamento.',
                missingRequirements: ['Resolver estocagem crítica', 'Lançar ou quitar horas pendentes', 'Verificar inconsistências na produção'],
                primaryActionLabel: 'Ver Raio-X de Pendências',
                onPrimaryAction: () => setInsightModal({ isOpen: true, type: 'alerts' })
              }
            });
        } else {
            setConfirmClosePeriodOpen(true);
        }
        break;
      case 'register_courtesy':
        setIsCourtesyModalOpen(true);
        break;
      case 'export_csv':
        if (!stats) {
            toast.error("Nenhum dado para exportar");
            return;
        }
        toast.success("Iniciando geração de CSV...");
        
        // CSV Generation Logic
        try {
          const header = "Data,Tipo,Entidade,Quantidade,Valor,Status\n";
          const rows = [];
          
          if(stats.rawLotsLaunchedInPeriod > 0) rows.push(`"${new Date().toLocaleDateString()}","Lote Cru Lançado","${stats.lastLotName}","${stats.rawKgPurchasedInPeriod} kg","R$ ${stats.rawInvestmentInPeriod}","ativo"`);
          if(stats.roastedKgInPeriod > 0) rows.push(`"${new Date().toLocaleDateString()}","Torra","Múltiplas","${stats.roastedKgInPeriod} kg","N/A","registrada"`);
          if(stats.packagedUnitsInPeriod > 0) rows.push(`"${new Date().toLocaleDateString()}","Pacotes","Vários formatos","${stats.packagedUnitsInPeriod} un","N/A","pronto"`);
          if(stats.roasterHoursInPeriod > 0) rows.push(`"${new Date().toLocaleDateString()}","Horas Totais","Mestre","${stats.roasterHoursInPeriod} h","R$ ${stats.estimatedPayrollValue}","pendente"`);
          
          const csvContent = "data:text/csv;charset=utf-8," + header + rows.join("\n");
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `cofcof-operacao-${new Date().toISOString().split('T')[0]}.csv`);
          document.body.appendChild(link);
          
          link.click();
          document.body.removeChild(link);
          
          adminLogService.logAdminAction({
             userId: user?.id || 'user',
             userEmail: user?.email || 'contato@cofcof.co',
             action: 'EXPORT_CSV',
             entity: 'operation',
             entityId: 'period',
             after: { period, rows: rows.length }
          } as any);

          toast.success("Relatório CSV gerado e baixado com sucesso!");
        } catch(e) {
          toast.error("Falha ao gerar o CSV");
        }
        break;
      
      // View actions (from Cards, Links, Filters)
      case 'view_raw_stock':
         if (stats?.rawKgAvailable > 0) {
             setInsightModal({ isOpen: true, type: 'raw_stock' });
         } else {
             handleOperationAction('launch_lot');
         }
         break;
      case 'view_roasted':
         if (stats?.roastedKgInPeriod > 0) {
             setInsightModal({ isOpen: true, type: 'roasted' });
         } else {
             handleOperationAction('register_roast');
         }
         break;
      case 'view_packaged':
      case 'view_stock':
         if (stats?.finishedStockUnits > 0) {
             setInsightModal({ isOpen: true, type: 'finished_stock' });
         } else {
             handleOperationAction('package_coffee');
         }
         break;
      case 'view_consigned':
         setMode('consignacoes');
         break;
      case 'view_alerts':
         if ((stats?.criticalAlertsCount + stats?.overdueConsignmentsCount) > 0) {
             setInsightModal({ isOpen: true, type: 'alerts' });
         } else {
             toast.success('Tudo em ordem neste momento.');
         }
         break;
      case 'view_lots':
         setMode('estoque');
         break;
      case 'view_pending_values':
      case 'view_financial':
         setMode('financeiro');
         break;
      case 'view_new_customers':
         setInsightModal({ isOpen: true, type: 'new_customers' });
         break;
      case 'view_hours':
         setMode('horas');
         break;
      case 'view_movements':
         setMode('diario');
         break;

      // Filter Actions
      case 'filter_lotes':
         setMode('lancamentos');
         break;
      case 'filter_torra':
         setMode('lancamentos');
         break;
      case 'filter_horas':
         setMode('horas');
         break;
         
      case 'view_b2b_module':
         setInsightModal({ isOpen: true, type: 'b2b_module' });
         break;

      default:
        toast.error("Ação não mapeada.");
    }
  };

  useEffect(() => {
    // Reset dates based on period
    const now = new Date();
    let start = new Date(now.setHours(0,0,0,0));
    let end = new Date(now.setHours(23,59,59,999));

    if (period === 'today') {
      // already set
    } else if (period === 'yesterday') {
      start = new Date(start.setDate(start.getDate() - 1));
      end = new Date(end.setDate(end.getDate() - 1));
    } else if (period === 'last7') {
      start = new Date(start.setDate(start.getDate() - 7));
    } else if (period === 'last30') {
      start = new Date(start.setDate(start.getDate() - 30));
    } else if (period === 'thisMonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'lastMonth') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23,59,59,999);
    }
    
    setDates({ start, end });
  }, [period]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadStats = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const cacheKey = `cofcof-operation-dashboard:${period}:${dates.start.toISOString()}:${dates.end.toISOString()}`;
    const cachedStr = sessionStorage.getItem(cacheKey);
    let hasValidCache = false;

    if (cachedStr) {
      try {
        const cached = JSON.parse(cachedStr);
        if (Date.now() - cached.timestamp < 60000) { // 60s TTL
          setStats(cached.data);
          hasValidCache = true;
          setLoading(false);
        }
      } catch (e) {
        // ignore
      }
    }

    setLoading(!hasValidCache);

    try {
      const s = await operationService.getOperationDashboard({ startDate: dates.start, endDate: dates.end });
      if (!controller.signal.aborted) {
        setStats(s);
        sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: s }));
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error(error);
        toast.error("Erro ao carregar métricas operacionais");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [dates, period]);

  useEffect(() => {
    if (dates.start && dates.end) {
        loadStats();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [dates, loadStats]);

  const menuActions = [
    { label: 'Lançar Novo Lote', icon: Target, color: 'text-indigo-600', bg: 'bg-indigo-50', onClick: () => setIsLaunchLotModalOpen(true) },
    { label: 'Registrar Torra', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50', onClick: () => setIsRoastModalOpen(true) },
    { label: 'Registrar Empacotamento', icon: Package, color: 'text-amber-600', bg: 'bg-amber-50', onClick: () => setIsPackModalOpen(true) },
    { label: 'Lançar Horas Mestre', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50', onClick: () => setIsTimeModalOpen(true) },
  ];

  const getPeriodLabel = () => {
    switch (period) {
      case 'today': return 'Hoje';
      case 'yesterday': return 'Ontem';
      case 'last7': return 'Últimos 7 dias';
      case 'last30': return 'Últimos 30 dias';
      case 'thisMonth': return 'Este mês';
      case 'lastMonth': return 'Mês passado';
      default: return 'Personalizado';
    }
  };

  return (
    <div className="animate-in fade-in duration-500 bg-[#fcfaf8] min-h-screen relative flex flex-col w-full min-w-0">
      {/* 1. TOPO DE COMANDO EM DUAS LINHAS */}
      <div className="bg-[#111111] text-white px-6 py-4 shadow-sm border-b border-[#c9a263]/20 flex flex-col gap-4 sticky top-0 z-40">
         {/* Linha 1 */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex flex-1 items-center gap-4 min-w-0">
                 {/* Search */}
                 <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-2.5 rounded-xl border border-[#c9a263]/10 max-w-sm w-full">
                    <Search size={16} className="text-[#a3a3a3] shrink-0" />
                    <input 
                       type="text" 
                       value={searchQuery}
                       onChange={(e) => {
                           setSearchQuery(e.target.value);
                           performOperationalSearch(e.target.value);
                       }}
                       placeholder="Buscar lote, torra, parceiro..." 
                       className="bg-transparent border-none text-sm w-full focus:ring-0 outline-none placeholder:text-[#a3a3a3] text-white font-medium min-w-0" 
                    />
                 </div>
                 
                 {/* Period */}
                 <div className="flex items-center gap-1 shrink-0 overflow-x-auto hide-scrollbar bg-[#1a1a1a] p-1 rounded-xl border border-[#c9a263]/10">
                     {[
                         { id: 'today', label: 'Hoje' },
                         { id: 'last7', label: '7 dias' },
                         { id: 'last30', label: '30 dias' },
                         { id: 'thisMonth', label: 'Mês' }
                     ].map(opt => (
                         <button 
                            key={opt.id}
                            onClick={() => setPeriod(opt.id as PeriodOption)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${period === opt.id ? 'bg-[#111111] shadow-sm text-[#c9a263] border border-[#c9a263]/30' : 'text-[#a3a3a3] hover:text-white hover:bg-[#111111] border border-transparent'}`}
                         >
                            {opt.label}
                         </button>
                     ))}
                 </div>
                 {loading && <div className="flex items-center"><RefreshCcw size={14} className="animate-spin text-[#c9a263]" /></div>}
             </div>

             <button 
                onClick={() => setIsOperationMenuOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#c9a263] text-[#0a0a0a] px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(201,162,99,0.2)] active:scale-95 whitespace-nowrap shrink-0"
              >
                <Zap size={16} className="text-[#0a0a0a]" />
                Criar lançamento
              </button>
         </div>

         {/* Linha 2 - Tabs */}
         <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pt-2 border-t border-white/5">
             {[
                 { id: 'cockpit', label: 'Cockpit' },
                 { id: 'diario', label: 'Diário do dia' },
                 { id: 'lancamentos', label: 'Lançar movimentação' },
                 { id: 'estoque', label: 'Estoque' },
                 { id: 'consignacoes', label: 'Consignações' },
                 { id: 'financeiro', label: 'Custos e margens' },
                 { id: 'horas', label: 'Horas do mestre' },
                 { id: 'auditoria', label: 'Auditoria' }
             ].map(m => (
                 <button 
                     key={m.id} 
                     onClick={() => setMode(m.id as OperationMode)} 
                     className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-sm shrink-0 whitespace-nowrap ${mode === m.id ? 'text-[#0a0a0a] bg-[#c9a263] border-transparent' : 'text-[#a3a3a3] hover:text-white border border-transparent hover:bg-[#1a1a1a]'}`}
                 >
                     {m.label}
                 </button>
             ))}
         </div>
      </div>

      <div className="p-4 md:p-8 w-full max-w-[1440px] mx-auto min-w-0">
         {/* GRID PRINCIPAL */}
         {mode === 'cockpit' ? (
          <div className="flex flex-col gap-6 items-start w-full">
            <OperationCockpit onNavigate={(dest) => {
                 if (['estoque', 'consignacoes', 'financeiro', 'auditoria', 'horas', 'diario', 'lancamentos'].includes(dest)) {
                     setMode(dest as OperationMode);
                 } else if (dest === 'lot' || dest === 'stock') {
                     setMode('estoque');
                 } else {
                     const destMap: Record<string, string> = {
                        order: 'order_module',
                        product: 'product_module',
                        partner: 'partner_module',
                        b2b: 'b2b_module',
                     };
                     const mappedDest = destMap[dest];
                     if (mappedDest) {
                        setInsightModal({ isOpen: true, type: mappedDest });
                     } else {
                        const labels: Record<string, string> = {
                           subscription: 'Assinaturas',
                           content: 'Conteúdo',
                           coupon: 'Marketing'
                        };
                        const label = labels[dest] || dest;
                        toast(`Por favor, acesse o módulo de ${label} usando o menu lateral.`);
                     }
                 }
             }} />
            
          </div>
         ) : (
               <div className="flex-1 relative min-w-0 w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="h-full">
                      <Suspense fallback={<div className="p-12 flex items-center justify-center"><RefreshCcw className="animate-spin text-[#c9a263]" /></div>}>
                        {mode === 'diario' && <DailyOverview dates={dates} stats={stats} onAction={handleOperationAction} />}
                        {mode === 'lancamentos' && <ProductionFlow stats={stats} onAction={handleOperationAction} />}
                        {mode === 'estoque' && <StockOverview onAction={handleOperationAction} />}
                        {mode === 'consignacoes' && <ConsignmentsOverview onAction={handleOperationAction} />}
                        {mode === 'financeiro' && <FinancialOverview stats={stats} onAction={handleOperationAction} />}
                        {mode === 'horas' && <RoasterHoursControl onAction={handleOperationAction} />}
                        {mode === 'auditoria' && <AuditTrailOverview />}
                      </Suspense>
                    </motion.div>
                  </AnimatePresence>
               </div>
         )}
      </div>

      <Suspense fallback={null}>
        {isRoastModalOpen && <RoastModal isOpen={isRoastModalOpen} onClose={() => setIsRoastModalOpen(false)} onSave={loadStats} />}
        {isPackModalOpen && <PackagingModal isOpen={isPackModalOpen} onClose={() => setIsPackModalOpen(false)} onSave={loadStats} />}
        {isTimeModalOpen && <TimeEntryModal isOpen={isTimeModalOpen} onClose={() => setIsTimeModalOpen(false)} onSave={loadStats} />}
        {isLaunchLotModalOpen && <LaunchLotModal isOpen={isLaunchLotModalOpen} onClose={() => setIsLaunchLotModalOpen(false)} onSave={loadStats} />}
        {insightModal.isOpen && <OperationInsightModal isOpen={insightModal.isOpen} type={insightModal.type} dates={dates} stats={stats} onAction={handleOperationAction} onClose={() => setInsightModal({ isOpen: false, type: null })} />}
        {isOperationMenuOpen && <NewOperationModal isOpen={isOperationMenuOpen} onClose={() => setIsOperationMenuOpen(false)} onAction={(id) => handleOperationAction(id)} stats={stats} />}
        
        {/* New Flow Modals */}
        {isConsignmentModalOpen && <ConsignmentModal isOpen={isConsignmentModalOpen} onClose={() => setIsConsignmentModalOpen(false)} onSave={loadStats} stats={stats} />}
        {isSettleConsignmentModalOpen && <SettleConsignmentModal isOpen={isSettleConsignmentModalOpen} onClose={() => setIsSettleConsignmentModalOpen(false)} onSave={loadStats} />}
        {isAdjustStockModalOpen && <AdjustStockModal isOpen={isAdjustStockModalOpen} onClose={() => setIsAdjustStockModalOpen(false)} onSave={loadStats} stats={stats} />}
        {isCourtesyModalOpen && <CourtesyModal isOpen={isCourtesyModalOpen} onClose={() => setIsCourtesyModalOpen(false)} onSave={loadStats} stats={stats} />}
      </Suspense>

      {/* Modais de Feedback */}
      {prerequisiteModal.actionParams && (
        <OperationPrerequisiteModal 
          isOpen={prerequisiteModal.isOpen} 
          onClose={() => setPrerequisiteModal({...prerequisiteModal, isOpen: false})}
          {...prerequisiteModal.actionParams}
        />
      )}

      <OperationConfirmModal
        isOpen={isConfirmClosePeriodOpen}
        onClose={() => setConfirmClosePeriodOpen(false)}
        title="Fechar Período Operacional"
        description="Você está prestes a fechar o período ativo. Isso irá congelar os lançamentos dentro desta janela e preparar os relatórios contábeis."
        primaryActionLabel="Confirmar Fechamento"
        onConfirm={async () => {
           try {
             await adminLogService.logAdminAction({
               userId: user?.id || 'user',
               userEmail: user?.email || 'contato@cofcof.co',
               action: 'CLOSE_PERIOD',
               entity: 'operation',
               entityId: period,
               after: { dates, stats: { ...stats, issues: undefined } }
             } as any);
             toast.success("Período fechado com sucesso!");
             setConfirmClosePeriodOpen(false);
           } catch(e) {
             toast.error("Erro ao fechar período");
           }
        }}
        summary={
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Período:</span>
                <span className="font-black text-[#1C1A17]">{getPeriodLabel()}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Lotes Lançados:</span>
                <span className="font-black text-[#1C1A17]">{stats?.rawLotsLaunchedInPeriod || 0}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Investimento Cru:</span>
                <span className="font-black text-[#1C1A17]">R$ {(stats?.rawInvestmentInPeriod || 0).toLocaleString('pt-BR')}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Folha a Pagar (Mestre):</span>
                <span className="font-black text-[#1C1A17]">R$ {(stats?.estimatedPayrollValue || 0).toLocaleString('pt-BR')}</span>
             </div>
          </div>
        }
      />
    </div>
  );
}
