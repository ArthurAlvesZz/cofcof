import { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  PackageOpen,
  Tag,
  Menu,
  LogOut,
  X,
  MapPin,
  Coffee,
  Type,
  Settings,
  Shield,
  Scale,
  Target,
  Flame,
  Package,
  Layers,
  Handshake,
  DollarSign,
  Clock,
  BarChart,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { mockProducts } from "../data/seed";
import { Product } from "../types";
import { useAdminAuthStore } from "../store/adminAuthStore";
import { useNavigate } from "react-router-dom";
import { ProductsTab } from "../components/admin/ProductsTab";
import { OrdersTab } from "../components/admin/OrdersTab";
import { CustomersTab } from "../components/admin/CustomersTab";
import { B2BLeadsTab } from "../components/admin/B2BLeadsTab";
import { PartnersTab } from "../components/admin/PartnersTab";
import { SubscriptionsTab } from "../components/admin/SubscriptionsTab";
import { CouponsTab } from "../components/admin/CouponsTab";
import { ContentTab } from "../components/admin/ContentTab";
import { OperationTab } from "../components/admin/OperationTab";
import { StockTab } from "../components/admin/StockTab";
import { ConsignmentsTab } from "../components/admin/ConsignmentsTab";
import { SellersTab } from "../components/admin/SellersTab";
import { CommissionsTab } from "../components/admin/CommissionsTab";
import { ReportsTab } from "../components/admin/ReportsTab";
import { RoastsTab } from "../components/admin/RoastsTab";
import { PackagingTab } from "../components/admin/PackagingTab";
import { HoursTab } from "../components/admin/HoursTab";
import { canAccessModule } from "../lib/permissions";
import { AdminEmptyState } from "../components/admin/AdminEmptyState";
import { BrandLogo } from "../components/brand/BrandLogo";

const navGroups = [
  {
    title: "Visão geral",
    items: [
      { id: "dashboard", label: "Cockpit", icon: LayoutDashboard },
      { id: "operation", label: "Operação CofCof", icon: Scale },
    ],
  },
  {
    title: "Vendas",
    items: [
      { id: "dashboard_sales", label: "Resumo Vendas", icon: BarChart },
      { id: "orders", label: "Pedidos", icon: ShoppingCart, badge: "orders" },
      {
        id: "products",
        label: "Produtos",
        icon: PackageOpen,
        badge: "products",
      },
      { id: "customers", label: "Clientes", icon: Users },
      { id: "coupons", label: "Cupons", icon: Tag, badge: "coupons" },
    ],
  },
  {
    title: "Site público",
    items: [
      { id: "content_home", label: "Home", icon: LayoutDashboard },
      { id: "content_cafes", label: "Cafés", icon: Coffee },
      { id: "subscriptions_clube", label: "Clube", icon: Package },
      { id: "leads_empresas", label: "Empresas", icon: Target },
      { id: "content_origem", label: "Origem", icon: MapPin },
      { id: "partners_onde", label: "Onde encontrar", icon: MapPin },
      { id: "content_sobre", label: "Sobre", icon: Type },
      { id: "content_faq", label: "FAQ", icon: Type },
      { id: "content_footer", label: "Footer", icon: LayoutDashboard },
    ],
  },
  {
    title: "Rede e B2B",
    items: [
      {
        id: "partners",
        label: "Parceiros",
        icon: Handshake,
        badge: "partners",
      },
      { id: "leads", label: "Leads B2B", icon: Users, badge: "leads" },
      { id: "op_consignments", label: "Consignações", icon: Target },
      { id: "op_sellers", label: "Vendedores", icon: Users },
      { id: "op_commissions", label: "Comissões", icon: DollarSign },
    ],
  },
  {
    title: "Operação",
    items: [
      { id: "operation_central", label: "Central Operacional", icon: Scale },
      { id: "operation_lotes", label: "Lotes", icon: Layers },
      { id: "operation_torra", label: "Torra", icon: Flame },
      { id: "operation_pack", label: "Empacotamento", icon: Package },
      { id: "op_stock", label: "Estoque", icon: PackageOpen },
      { id: "operation_horas", label: "Horas", icon: Clock },
      { id: "operation_auditoria", label: "Auditoria", icon: Shield },
    ],
  },
  {
    title: "Sistema",
    items: [
      { id: "content_global", label: "Conteúdo global", icon: Type },
      { id: "settings_seo", label: "SEO", icon: BarChart },
      { id: "settings_integrations", label: "Integrações", icon: Settings },
      { id: "staff", label: "Usuários", icon: Users },
      { id: "settings", label: "Configurações", icon: Settings },
    ],
  },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem("cofcof-admin-sidebar-collapsed") === "true";
  });
  const [sidebarSearch, setSidebarSearch] = useState("");

  const { user, logout } = useAdminAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("cofcof-admin-sidebar-collapsed", newState.toString());
  };

  const getModuleKey = (id: string) => {
    if (id.startsWith("content_")) return "content";
    if (id.startsWith("operation_")) return "operation";
    if (id.startsWith("settings_")) return "settings";
    if (id.startsWith("dashboard_")) return "dashboard";
    if (id.startsWith("leads_")) return "leads";
    if (id.startsWith("partners_")) return "partners";
    if (id.startsWith("subscriptions_")) return "subscriptions";
    return id;
  };

  const getMappedTab = (tab: string) => {
    if (tab === "dashboard_sales") return "dashboard";
    if (tab.startsWith("content_")) return "content";
    if (tab.startsWith("subscriptions_")) return "subscriptions";
    if (tab.startsWith("leads_")) return "leads";
    if (tab.startsWith("partners_")) return "partners";
    if (tab.startsWith("operation_")) return "operation";
    if (
      tab.startsWith("settings_") &&
      !["settings_seo", "settings_integrations"].includes(tab)
    )
      return "settings";
    return tab;
  };

  const getSidebarBadge = (badgeId?: string) => {
    if (!badgeId) return null;
    let label = "";
    let variant = "ok";

    switch (badgeId) {
      case "orders":
        label = "12";
        variant = "warning";
        break;
      case "products":
        label = "3";
        variant = "critical";
        break;
      case "partners":
        label = "2";
        variant = "warning";
        break;
      case "leads":
        label = "5";
        variant = "warning";
        break;
      case "coupons":
        label = "1";
        variant = "ok";
        break;
      case "content":
        label = "4";
        variant = "warning";
        break;
      default:
        return null;
    }

    if (label === "0" || !label) return null;

    const colors = {
      critical: "bg-red-500/10 text-red-500 border border-red-500/20",
      warning: "bg-[#c9a263]/10 text-[#c9a263] border border-[#c9a263]/30",
      ok: "bg-green-500/10 text-green-500 border border-green-500/20",
    };

    return (
      <div
        className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${colors[variant as keyof typeof colors]}`}
      >
        {label}
      </div>
    );
  };

  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          !sidebarSearch ||
          item.label.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
          group.title.toLowerCase().includes(sidebarSearch.toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length > 0);

  const renderContent = () => {
    const mapped = getMappedTab(activeTab);

    return (
      <div
        className={`flex-1 min-w-0 w-full ${mapped === "operation" ? "" : "p-4 md:p-8"}`}
      >
        <header className="flex md:hidden justify-between items-center p-4 border-b border-[#c9a263]/10 bg-[#13110F] text-white sticky top-0 z-40">
          <h2
            className="text-xl font-serif cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
            onClick={() => navigate("/")}
          >
            Admin{" "}
            <BrandLogo
              size="admin"
              className=""
              asLink={false}
              theme="pure-white"
            />
          </h2>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            <Menu />
          </button>
        </header>

        {mapped === "dashboard" && (
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-serif mb-8 text-[#0a0a0a]">
              Resumo Vendas
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-[#c9a263]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#c9a263] mb-2">
                  Vendas (Mês)
                </p>
                <p className="text-3xl font-serif text-[#0a0a0a]">R$ 4.520</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#c9a263]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#c9a263] mb-2">
                  Pedidos Pendentes
                </p>
                <p className="text-3xl font-serif text-[#0a0a0a]">12</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#c9a263]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#c9a263] mb-2">
                  Total Produtos
                </p>
                <p className="text-3xl font-serif text-[#0a0a0a]">
                  {mockProducts.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-[#c9a263]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#c9a263] mb-2">
                  Leads B2B (Novos)
                </p>
                <p className="text-3xl font-serif text-[#0a0a0a]">3</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#13110F] to-[#1a110a] p-8 text-center sm:text-left rounded-2xl border border-[#c9a263]/20 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl mb-1 flex items-center justify-center sm:justify-start gap-2">
                  Bem-vindo(a), {user?.name}
                </h3>
                <p className="text-[#a3a3a3] text-sm">
                  Seu nível de acesso é:{" "}
                  <strong className="text-[#c9a263] tracking-widest uppercase text-xs">
                    {user?.role}
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setActiveTab("operation")}
                className="px-6 py-3 bg-[#c9a263] text-[#0a0a0a] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors"
              >
                Ir para Operação
              </button>
            </div>
          </div>
        )}

        {mapped === "operation" && <OperationTab />}
        {mapped === "orders" && <OrdersTab />}
        {mapped === "products" && <ProductsTab />}
        {mapped === "customers" && <CustomersTab />}
        {mapped === "leads" && <B2BLeadsTab />}
        {mapped === "partners" && <PartnersTab />}
        {mapped === "subscriptions" && <SubscriptionsTab />}
        {mapped === "coupons" && <CouponsTab />}
        {mapped === "content" && <ContentTab />}

        {mapped === "settings_seo" && (
          <AdminEmptyState
            title="SEO"
            description="Este módulo será usado para configurar metadados, preview e indexação das páginas públicas."
            action={{
              label: "Voltar para Conteúdo",
              onClick: () => setActiveTab("content"),
            }}
          />
        )}

        {mapped === "settings_integrations" && (
          <AdminEmptyState
            title="Integrações"
            description="Este módulo será usado para configurar tokens e chaves de APIs externas."
          />
        )}

        {(mapped === "settings" || mapped === "staff") && (
          <AdminEmptyState
            title={
              mapped === "staff"
                ? "Usuários do Sistema"
                : "Configurações Globais"
            }
            description={
              mapped === "staff"
                ? "Gestão de usuários e permissões do painel interno."
                : "Configurações gerais do sistema e ambiente."
            }
          />
        )}

        {mapped === "op_reports" && <ReportsTab />}
        {mapped === "op_stock" && <StockTab />}
        {mapped === "op_consignments" && <ConsignmentsTab />}
        {mapped === "op_sellers" && <SellersTab />}
        {mapped === "op_commissions" && <CommissionsTab />}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen bg-[#fcfaf8] bg-gradient-to-br from-[#fcfaf8] to-[#f5f0eb] font-sans w-full relative`}
    >
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen bg-[#13110F] text-[#a3a3a3] border-r border-[#c9a263]/10 ${isSidebarCollapsed ? "w-[80px]" : "w-[260px]"} shrink-0 flex flex-col self-start z-50 transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div
          className={`p-6 flex ${isSidebarCollapsed ? "justify-center" : "justify-between"} items-center shrink-0`}
        >
          <div
            className={`flex flex-col ${isSidebarCollapsed ? "items-center" : "items-start gap-1"} cursor-pointer hover:opacity-80 transition-opacity min-w-0`}
            onClick={() => navigate("/")}
          >
            <BrandLogo
              size={isSidebarCollapsed ? "sidebar" : "admin"}
              compact={isSidebarCollapsed}
              className=""
              asLink={false}
              theme="pure-white"
            />
            {!isSidebarCollapsed && (
              <span className="text-[10px] text-[#a3a3a3] font-medium tracking-widest uppercase mt-0.5">
                Painel Admin
              </span>
            )}
          </div>
          {!isSidebarCollapsed && (
            <button
              className="md:hidden text-[#a3a3a3]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {!isSidebarCollapsed && (
          <div className="px-4 pb-4 shrink-0 border-b border-[#a3a3a3]/10 mb-2">
            <div className="bg-[#1a1a1a] border border-[#a3a3a3]/10 rounded-xl flex items-center px-3 py-2 gap-2">
              <Search size={14} className="text-[#a3a3a3]" />
              <input
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Buscar no painel..."
                className="bg-transparent border-none text-xs w-full focus:ring-0 outline-none text-white placeholder:text-[#a3a3a3]"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto hide-scrollbar">
          {filteredGroups.map((group, idx) => {
            return (
              <div key={idx} className="mb-6 last:mb-0">
                {!isSidebarCollapsed && (
                  <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#a3a3a3]/60">
                    {group.title}
                  </div>
                )}
                <div
                  className={`flex flex-col ${isSidebarCollapsed ? "gap-2 items-center" : "gap-1"}`}
                >
                  {group.items.map((item) => {
                    const moduleKey = getModuleKey(item.id);
                    if (
                      !user ||
                      (!canAccessModule(user.role as any, moduleKey as any) &&
                        user.role !== "admin")
                    ) {
                      return null;
                    }
                    const Icon = item.icon!;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        title={isSidebarCollapsed ? item.label : undefined}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center ${isSidebarCollapsed ? "justify-center px-0 w-10" : "gap-3 px-3 w-full"} h-10 rounded-lg text-sm transition-all relative group ${isActive ? "bg-[#1a1a1a] shadow-[0_4px_10px_rgba(0,0,0,0.2)] text-white" : "text-[#a3a3a3] hover:bg-[#1a1a1a] hover:text-[#e5e5e5]"}`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-white rounded-r-full shadow-[0_0_8px_rgba(255,255,255,0.3)]"></div>
                        )}
                        <Icon
                          size={16}
                          strokeWidth={isActive ? 2 : 1.5}
                          className={`shrink-0 transition-colors ${isActive ? "text-[#c9a263]" : "text-[#a3a3a3] group-hover:text-white"}`}
                        />
                        {!isSidebarCollapsed && (
                          <>
                            <span className="truncate text-left flex-1 font-medium tracking-wide">
                              {item.label}
                            </span>
                            {getSidebarBadge(item.badge)}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div
          className={`relative p-4 border-t border-[#c9a263]/10 shrink-0 flex flex-col gap-3 transition-all ${isSidebarCollapsed ? "items-center" : ""} bg-[#0a0a0a]`}
        >
          <div
            className={`flex ${isSidebarCollapsed ? "justify-center w-full" : "items-center gap-3"} w-full`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#c9a263]/10 text-[#c9a263] border border-[#c9a263]/20 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0 overflow-hidden text-left">
                <p className="text-sm font-bold text-white truncate">
                  {user?.name || "Administrador"}
                </p>
                <p className="text-[10px] text-[#a3a3a3] uppercase tracking-widest truncate mt-0.5">
                  {user?.role || "Admin"}
                </p>
              </div>
            )}
          </div>

          <div
            className={`flex ${isSidebarCollapsed ? "flex-col gap-2" : "gap-2 w-full"} items-center mt-1`}
          >
            <button
              onClick={() => setActiveTab("settings")}
              title="Configurações"
              className={`flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#a3a3a3] hover:text-white p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors ${isSidebarCollapsed ? "w-full" : "flex-1 border border-transparent hover:border-[#a3a3a3]/10"}`}
            >
              <Settings size={14} />
              {!isSidebarCollapsed && <span>Sistema</span>}
            </button>
            <button
              onClick={handleLogout}
              title="Sair"
              className={`flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#ff4e4e] hover:text-[#ff7e7e] p-2 rounded-lg hover:bg-[#ff4e4e]/10 transition-colors ${isSidebarCollapsed ? "w-full" : "flex-1 border border-transparent hover:border-[#ff4e4e]/20"}`}
            >
              <LogOut size={14} />
              {!isSidebarCollapsed && <span>Sair</span>}
            </button>
          </div>

          <button
            onClick={toggleSidebar}
            className={`absolute ${isSidebarCollapsed ? "-right-3.5" : "-right-3.5"} bottom-24 w-7 h-7 bg-[#13110F] border border-[#c9a263]/20 rounded-full text-[#a3a3a3] hover:text-[#c9a263] shadow-lg hidden md:flex items-center justify-center z-50 transition-colors hover:bg-black`}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 w-full overflow-x-hidden flex flex-col min-h-screen relative">
        {renderContent()}
      </main>
    </div>
  );
}
