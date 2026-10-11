import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Menu,
  Footprints,
  FolderTree,
  Package,
  Boxes,
  ShoppingBag,
  Sparkles,
  FolderKanban,
  MessageSquare,
  HelpCircle,
  Mail,
  Image,
  Palette,
  Type,
  Globe,
  Smartphone,
  PhoneCall,
  Users,
  ShieldCheck,
  Database,
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  ArrowLeft,
  X,
  CreditCard,
  Wallet,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/ThemeContext';
import { AdminLogin } from './AdminLogin';
import {
  ServiceItem,
  ServiceCategory,
  OrderItem,
  CustomRequestItem,
  ContactMessageItem,
  PageSectionItem,
  PortfolioProjectItem,
  TestimonialItem,
  FaqItem,
} from '../../types';
import {
  getServices,
  getCategories,
  getOrders,
  getCustomRequests,
  getContactMessages,
  getPageSections,
  getPortfolioProjects,
  getTestimonials,
  getFaqs,
} from '../../lib/dataService';

// Module Components
import { AdminDashboardModule } from './modules/AdminDashboardModule';
import { AdminOrdersModule } from './modules/AdminOrdersModule';
import { AdminCustomRequestsModule } from './modules/AdminCustomRequestsModule';
import { AdminServicesModule } from './modules/AdminServicesModule';
import { AdminCategoriesModule } from './modules/AdminCategoriesModule';
import { AdminSectionsModule } from './modules/AdminSectionsModule';
import { AdminDesignSettingsModule } from './modules/AdminDesignSettingsModule';
import { AdminWhatsAppModule } from './modules/AdminWhatsAppModule';
import { AdminContactMessagesModule } from './modules/AdminContactMessagesModule';
import { AdminPortfolioModule } from './modules/AdminPortfolioModule';
import { AdminTestimonialsModule } from './modules/AdminTestimonialsModule';
import { AdminFaqsModule } from './modules/AdminFaqsModule';
import { AdminMediaLibraryModule } from './modules/AdminMediaLibraryModule';
import { AdminUserRolesModule } from './modules/AdminUserRolesModule';
import { AdminActivityLogsModule } from './modules/AdminActivityLogsModule';
import { AdminBackupRestoreModule } from './modules/AdminBackupRestoreModule';
import { AdminGeneralSettingsModule } from './modules/AdminGeneralSettingsModule';
import { AdminTypographyModule } from './modules/AdminTypographyModule';
import { AdminSeoModule } from './modules/AdminSeoModule';
import { AdminContactSettingsModule } from './modules/AdminContactSettingsModule';
import { AdminPagesModule } from './modules/AdminPagesModule';
import { AdminNavigationModule, AdminFooterModule } from './modules/AdminNavigationModule';
import { AdminPricingPackagesModule } from './modules/AdminPricingPackagesModule';
import { AdminSubscriptionsModule } from './modules/AdminSubscriptionsModule';
import { AdminPaymentGatewaysModule } from './modules/AdminPaymentGatewaysModule';
import { AdminTransactionsModule } from './modules/AdminTransactionsModule';
import { AdminInvoicesModule } from './modules/AdminInvoicesModule';
import { AdminSalesReportsModule } from './modules/AdminSalesReportsModule';
import { AdminClientLogosModule } from './modules/AdminClientLogosModule';
import { AdminMessagingModule } from './modules/AdminMessagingModule';
import { AdminEmailLogsModule } from './modules/AdminEmailLogsModule';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, role, logout, user, demoUser } = useAuth();
  const { settings } = useSiteSettings();

  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Database states
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [customRequests, setCustomRequests] = useState<CustomRequestItem[]>([]);
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [sections, setSections] = useState<PageSectionItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProjectItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all live database data
  const loadData = async () => {
    try {
      const [s, c, o, cr, m, sec, p, t, f] = await Promise.all([
        getServices(),
        getCategories(),
        getOrders(),
        getCustomRequests(),
        getContactMessages(),
        getPageSections(),
        getPortfolioProjects(),
        getTestimonials(),
        getFaqs(),
      ]);
      setServices(s);
      setCategories(c);
      setOrders(o);
      setCustomRequests(cr);
      setMessages(m);
      setSections(sec);
      setPortfolio(p);
      setTestimonials(t);
      setFaqs(f);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // If unauthenticated or no admin role, render secure login
  if (!isAuthenticated || !role) {
    return <AdminLogin />;
  }

  // Badges
  const newOrdersCount = orders.filter(o => o.status === 'new').length;
  const pendingRequestsCount = customRequests.filter(r => r.status === 'pending').length;
  const unreadMessagesCount = messages.filter(m => !m.isRead).length;

  // Admin Modules Definition organized into logical business groups
  const menuGroups: MenuGroup[] = [
    {
      group: 'Executive & Overview',
      items: [
        { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
        { id: 'sales-reports', label: 'Sales & Revenue Reports', icon: TrendingUp },
      ],
    },
    {
      group: 'Subscriptions & Finance',
      items: [
        { id: 'subscriptions', label: 'Subscription Management', icon: CreditCard },
        { id: 'gateways', label: 'Payment Gateways', icon: Wallet },
        { id: 'transactions', label: 'Transactions Ledger', icon: DollarSign },
        { id: 'invoices', label: 'Invoices & Receipts', icon: FileText },
      ],
    },
    {
      group: 'Content & Catalog',
      items: [
        { id: 'pages', label: 'Website Pages', icon: FileText },
        { id: 'sections', label: 'Homepage Sections', icon: Layers },
        { id: 'navigation', label: 'Navigation', icon: Menu },
        { id: 'footer', label: 'Footer', icon: Footprints },
        { id: 'categories', label: 'Service Categories', icon: FolderTree },
        { id: 'services', label: 'Services', icon: Package },
        { id: 'packages', label: 'Pricing & Packages', icon: Boxes },
        { id: 'portfolio', label: 'Portfolio', icon: FolderKanban },
        { id: 'client-logos', label: 'Client Logo Board', icon: Image },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
        { id: 'faqs', label: 'FAQs', icon: HelpCircle },
        { id: 'media', label: 'Media Library', icon: Image },
      ],
    },
    {
      group: 'Client Operations & Communications',
      items: [
        { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: newOrdersCount },
        { id: 'custom-requests', label: 'Custom Requests', icon: Sparkles, badge: pendingRequestsCount },
        { id: 'messaging', label: 'Unified Messaging Inbox', icon: MessageSquare },
        { id: 'email-logs', label: 'Email Notifications & Logs', icon: Mail },
        { id: 'contact-messages', label: 'Contact Messages', icon: Mail, badge: unreadMessagesCount },
      ],
    },
    {
      group: 'Design & Marketing',
      items: [
        { id: 'design-settings', label: 'Design Settings', icon: Palette },
        { id: 'typography', label: 'Typography', icon: Type },
        { id: 'seo', label: 'SEO Settings', icon: Globe },
        { id: 'whatsapp', label: 'WhatsApp Settings', icon: Smartphone },
        { id: 'contact-settings', label: 'Contact Settings', icon: PhoneCall },
      ],
    },
    {
      group: 'System & Security',
      items: [
        { id: 'user-roles', label: 'User & Role Management', icon: Users },
        { id: 'activity-logs', label: 'Security & Activity Logs', icon: ShieldCheck },
        { id: 'backup-restore', label: 'Backup & Restore', icon: Database },
        { id: 'general-settings', label: 'General Settings', icon: Settings },
      ],
    },
  ];

  const adminEmail = user?.email || demoUser?.email || 'mdshihabhossen.web@gmail.com';

  return (
    <div className="min-h-screen bg-[#080B14] text-[#F8FAFC] flex">
      {/* Persistent Left Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#101626] border-r border-[#263249] h-screen sticky top-0 flex-shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#263249] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4F8CFF] to-[#22D3EE] p-[1px]">
              <div className="w-full h-full bg-[#080B14] rounded-[7px] flex items-center justify-center font-mono font-bold text-cyan-400 text-xs">
                FT
              </div>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] font-bold text-sm text-white block">
                Futurent CMS
              </span>
              <span className="text-[10px] text-[#A7B2C8] font-mono">2026 Production</span>
            </div>
          </div>
          <a
            href="/"
            title="Public Website"
            className="p-1.5 rounded-lg border border-[#263249] text-slate-400 hover:text-white hover:bg-[#141C2E]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 24 Modules Menu List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </div>
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/30 to-purple-600/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'text-[#A7B2C8] hover:text-white hover:bg-[#141C2E]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Admin User Footer in Sidebar */}
        <div className="p-4 border-t border-[#263249] bg-[#080B14]/80 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs font-mono">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <span className="block text-xs font-bold text-white truncate max-w-[120px]">
                {adminEmail}
              </span>
              <span className="text-[10px] text-cyan-400 font-mono capitalize">
                {role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg border border-[#263249] text-slate-400 hover:text-rose-400 hover:bg-[#141C2E]"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header className="h-16 bg-[#101626]/90 backdrop-blur-md border-b border-[#263249] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg bg-[#141C2E] border border-[#263249] text-white"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-base sm:text-lg font-bold font-['Space_Grotesk'] text-white capitalize flex items-center gap-2">
              <span>{activeModule.replace('-', ' ')}</span>
              <span className="text-slate-400 text-xs font-normal hidden sm:inline">• Futurent Technology</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
              Role: {role.toUpperCase()}
            </span>
            <a
              href="/"
              className="px-3 py-1.5 rounded-lg bg-[#141C2E] border border-[#263249] hover:border-cyan-400 text-slate-300 hover:text-white text-xs font-medium"
            >
              View Public Site
            </a>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {activeModule === 'dashboard' && (
            <AdminDashboardModule
              services={services}
              orders={orders}
              customRequests={customRequests}
              messages={messages}
              onNavigateModule={id => setActiveModule(id)}
            />
          )}

          {activeModule === 'orders' && (
            <AdminOrdersModule
              orders={orders}
              onOrderUpdated={updated => {
                setOrders(orders.map(o => (o.id === updated.id ? updated : o)));
              }}
            />
          )}

          {activeModule === 'custom-requests' && (
            <AdminCustomRequestsModule
              customRequests={customRequests}
              onRequestUpdated={updated => {
                setCustomRequests(customRequests.map(r => (r.id === updated.id ? updated : r)));
              }}
              onOrderCreatedFromRequest={newOrder => {
                setOrders([newOrder, ...orders]);
              }}
            />
          )}

          {activeModule === 'services' && (
            <AdminServicesModule
              services={services}
              categories={categories}
              onServicesUpdated={updated => setServices(updated)}
            />
          )}

          {activeModule === 'categories' && (
            <AdminCategoriesModule
              categories={categories}
              onCategoriesUpdated={updated => setCategories(updated)}
            />
          )}

          {activeModule === 'sections' && (
            <AdminSectionsModule
              sections={sections}
              onSectionsUpdated={updated => setSections(updated)}
            />
          )}

          {activeModule === 'design-settings' && <AdminDesignSettingsModule />}

          {activeModule === 'whatsapp' && <AdminWhatsAppModule />}

          {activeModule === 'contact-messages' && (
            <AdminContactMessagesModule
              messages={messages}
              onMessagesUpdated={updated => setMessages(updated)}
            />
          )}

          {activeModule === 'portfolio' && (
            <AdminPortfolioModule
              portfolio={portfolio}
              onPortfolioUpdated={updated => setPortfolio(updated)}
            />
          )}

          {activeModule === 'testimonials' && (
            <AdminTestimonialsModule
              testimonials={testimonials}
              onTestimonialsUpdated={updated => setTestimonials(updated)}
            />
          )}

          {activeModule === 'faqs' && (
            <AdminFaqsModule
              faqs={faqs}
              onFaqsUpdated={updated => setFaqs(updated)}
            />
          )}

          {activeModule === 'media' && <AdminMediaLibraryModule />}

          {activeModule === 'user-roles' && <AdminUserRolesModule />}

          {activeModule === 'activity-logs' && <AdminActivityLogsModule />}

          {activeModule === 'backup-restore' && <AdminBackupRestoreModule />}

          {activeModule === 'general-settings' && <AdminGeneralSettingsModule />}

          {activeModule === 'typography' && <AdminTypographyModule />}

          {activeModule === 'seo' && <AdminSeoModule />}

          {activeModule === 'contact-settings' && <AdminContactSettingsModule />}

          {activeModule === 'pages' && <AdminPagesModule />}

          {activeModule === 'navigation' && <AdminNavigationModule />}

          {activeModule === 'footer' && <AdminFooterModule />}

          {activeModule === 'packages' && (
            <AdminPricingPackagesModule
              services={services}
              onNavigateToServices={() => setActiveModule('services')}
            />
          )}

          {activeModule === 'subscriptions' && <AdminSubscriptionsModule />}

          {activeModule === 'gateways' && <AdminPaymentGatewaysModule />}

          {activeModule === 'transactions' && <AdminTransactionsModule />}

          {activeModule === 'invoices' && <AdminInvoicesModule />}

          {activeModule === 'sales-reports' && <AdminSalesReportsModule />}

          {activeModule === 'client-logos' && <AdminClientLogosModule />}

          {activeModule === 'messaging' && <AdminMessagingModule />}

          {activeModule === 'email-logs' && <AdminEmailLogsModule />}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 bg-[#101626] border-r border-[#263249] flex flex-col h-full z-10">
            <div className="p-4 border-b border-[#263249] flex items-center justify-between">
              <span className="font-['Space_Grotesk'] font-bold text-sm text-white">
                Admin Modules
              </span>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {menuGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="px-3 text-[10px] font-mono uppercase text-slate-400">
                    {group.group}
                  </div>
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs ${
                        activeModule === item.id
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-[#A7B2C8]'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
