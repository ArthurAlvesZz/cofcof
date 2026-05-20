import { stockService } from './stockService';
import { productService } from './productService';
import { orderService } from './orderService';
import { b2bLeadService } from './b2bLeadService';
import { mockPartners } from '../data/seed';

export type OperationHealthStatus = "healthy" | "attention" | "critical";
export type OperationAlertSeverity = "info" | "warning" | "critical";
export type OperationAlertEntity = "order" | "product" | "partner" | "lot" | "subscription" | "b2b" | "coupon" | "content" | "stock";

export interface OperationHealthAlert {
  id: string;
  entity: OperationAlertEntity;
  severity: OperationAlertSeverity;
  message: string;
  actionLabel: string;
  actionParams?: any;
}

export interface OperationHealthMetric {
  label: string;
  value: string | number;
  status: OperationHealthStatus;
  trend?: "up" | "down" | "stable";
}

export interface OperationHealthSection {
  id: OperationAlertEntity;
  title: string;
  status: OperationHealthStatus;
  pendingCount: number;
  totalCount: number;
  mainIssue?: string;
  ctaLabel: string;
}

export interface OperationHealthReport {
  score: number;
  overallStatus: OperationHealthStatus;
  metrics: OperationHealthMetric[];
  alerts: OperationHealthAlert[];
  sections: OperationHealthSection[];
}

// NOTE: This service aggregates data from mock/real existing services
// to provide a single "health" overview of the operation.
export const operationHealthService = {
  async getHealthReport(): Promise<OperationHealthReport> {
    try {
      // 1. Fetch data from existing services (or mock data for now)
      // We will try to load whatever is possible.
      
      const orders = await orderService.listOrders();
      const products = await productService.listProducts();
      const stockItems = await stockService.listStockItems();
      const b2bLeads = await b2bLeadService.listLeads();
      const partners = await Promise.resolve(mockPartners);
      const lots: any[] = []; // Mock logic for lots if not properly typed in seed

      const today = new Date();
      today.setHours(0,0,0,0);

      // Metricas - Pedidos
      const ordersToday = orders.filter((o: any) => new Date(o.createdAt) >= today);
      const revenueToday = ordersToday.reduce((acc: any, o: any) => acc + o.total, 0);
      const pendingOrders = orders.filter((o: any) => o.status === 'paid' || o.status === 'preparing');

      // Metricas - Produtos/Estoque
      const criticalStock = stockItems.filter(s => (s.availableUnits || 0) <= (s.lowStockThresholdUnits || 0));
      const publishedProducts = products.filter(p => p.active);
      const productsWithoutImages = products.filter(p => !p.mainImage);
      const productsWithoutPrice = products.filter(p => p.price <= 0);
      
      const alerts: OperationHealthAlert[] = [];

      // Validations and Alertas
      
      // Stock Alerts
      if (criticalStock.length > 0) {
        alerts.push({
          id: 'crit_stock_1',
          entity: 'stock',
          severity: 'critical',
          message: `${criticalStock.length} lote(s) com estoque crítico.`,
          actionLabel: 'Ver Estoque',
        });
      }

      // Order Alerts
      if (pendingOrders.length > 0) {
        alerts.push({
          id: 'pend_orders_1',
          entity: 'order',
          severity: 'warning',
          message: `${pendingOrders.length} pedido(s) pendentes de envio.`,
          actionLabel: 'Ver pedidos pendentes',
        });
      }

      // Product Alerts
      productsWithoutImages.forEach(p => {
        alerts.push({
          id: `prod_img_${p.id}`,
          entity: 'product',
          severity: 'warning',
          message: `Produto "${p.name}" sem imagem principal.`,
          actionLabel: 'Corrigir produto',
        });
      });

      productsWithoutPrice.forEach(p => {
        alerts.push({
          id: `prod_price_${p.id}`,
          entity: 'product',
          severity: 'critical',
          message: `Produto "${p.name}" sem preço configurado.`,
          actionLabel: 'Corrigir produto',
        });
      });

      // B2B Leads Alerts
      const openLeads = b2bLeads.filter(l => l.status === 'new' || l.status === 'contacted');
      if (openLeads.length > 0) {
        alerts.push({
          id: 'b2b_leads_1',
          entity: 'b2b',
          severity: 'warning',
          message: `${openLeads.length} lead(s) B2B aberto(s) aguardando retorno.`,
          actionLabel: 'Responder leads B2B',
        });
      }

      // Partner Alerts
      const partnersWithoutCoords = partners.filter(p => !p.lat || !p.lng);
      if (partnersWithoutCoords.length > 0) {
        alerts.push({
          id: 'part_coord_1',
          entity: 'partner',
          severity: 'warning',
          message: `${partnersWithoutCoords.length} parceiro(s) sem coordenadas validadas no mapa.`,
          actionLabel: 'Validar localização',
        });
      }

      // Lots Alerts
      const lotsWithoutProduct = lots.filter(l => !l.productId);
      if (lotsWithoutProduct.length > 0) {
        alerts.push({
          id: 'lot_prod_1',
          entity: 'lot',
          severity: 'info',
          message: `${lotsWithoutProduct.length} lote(s) sem produto vinculado no e-commerce.`,
          actionLabel: 'Revisar Lotes',
        });
      }

      const metrics: OperationHealthMetric[] = [
        { label: 'Pedidos Hoje', value: ordersToday.length, status: 'healthy' },
        { label: 'Faturamento', value: `R$ ${revenueToday.toFixed(2)}`, status: 'healthy' },
        { label: 'Pendentes', value: pendingOrders.length, status: pendingOrders.length > 5 ? 'attention' : 'healthy' },
        { label: 'Estoque Crítico', value: criticalStock.length, status: criticalStock.length > 0 ? 'critical' : 'healthy' },
      ];

      const sections: OperationHealthSection[] = [
        {
          id: 'order',
          title: 'Pedidos',
          status: pendingOrders.length > 5 ? 'attention' : 'healthy',
          pendingCount: pendingOrders.length,
          totalCount: orders.length,
          mainIssue: pendingOrders.length > 0 ? 'Pedidos aguardando envio' : undefined,
          ctaLabel: 'Ver pedidos pendentes',
        },
        {
          id: 'product',
          title: 'Produtos & Estoque',
          status: criticalStock.length > 0 || productsWithoutImages.length > 0 || productsWithoutPrice.length > 0 ? 'critical' : 'healthy',
          pendingCount: criticalStock.length + productsWithoutImages.length + productsWithoutPrice.length,
          totalCount: products.length,
          mainIssue: criticalStock.length > 0 ? 'Estoque crítico detectado' : 'Revisão de catálogo pendente',
          ctaLabel: 'Corrigir produtos',
        },
        {
          id: 'partner',
          title: 'Parceiros',
          status: partnersWithoutCoords.length > 0 ? 'attention' : 'healthy',
          pendingCount: partnersWithoutCoords.length,
          totalCount: partners.length,
          mainIssue: partnersWithoutCoords.length > 0 ? 'Parceiros fora do mapa' : undefined,
          ctaLabel: 'Validar localização',
        },
        {
          id: 'b2b',
          title: 'B2B Leads',
          status: openLeads.length > 0 ? 'attention' : 'healthy',
          pendingCount: openLeads.length,
          totalCount: b2bLeads.length,
          mainIssue: openLeads.length > 0 ? 'Leads sem resposta' : undefined,
          ctaLabel: 'Responder leads B2B',
        },
        {
          id: 'lot',
          title: 'Lotes & Origem',
          status: lotsWithoutProduct.length > 0 ? 'info' as any : 'healthy', // cast info to avoid type error if strictly healthy|attention|critical
          pendingCount: lotsWithoutProduct.length,
          totalCount: lots.length,
          mainIssue: lotsWithoutProduct.length > 0 ? 'Lotes sem produto vinculado' : undefined,
          ctaLabel: 'Ver lotes',
        }
      ];

      const criticalCount = alerts.filter(a => a.severity === 'critical').length;
      const attentionCount = alerts.filter(a => a.severity === 'warning').length;
      
      let overallStatus: OperationHealthStatus = 'healthy';
      let score = 100;

      if (criticalCount > 0) {
        overallStatus = 'critical';
        score -= (criticalCount * 10);
      } else if (attentionCount > 0) {
        overallStatus = 'attention';
        score -= (attentionCount * 5);
      }
      
      score = Math.max(0, score);

      return {
        score,
        overallStatus,
        metrics,
        alerts,
        sections
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
};
