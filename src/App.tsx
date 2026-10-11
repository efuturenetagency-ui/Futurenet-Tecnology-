import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { OrderModal } from './components/common/OrderModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import {
  ServiceItem,
  ServiceCategory,
  PageSectionItem,
  PortfolioProjectItem,
  TestimonialItem,
  FaqItem,
  ServicePackage,
  OrderItem,
} from './types';
import {
  getServices,
  getCategories,
  getPageSections,
  getPortfolioProjects,
  getTestimonials,
  getFaqs,
} from './lib/dataService';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { CustomServicePage } from './pages/CustomServicePage';
import { ContactPage } from './pages/ContactPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { PrivacyPolicyPage, TermsPage, NotFoundPage } from './pages/LegalPages';
import { LiveChatWidget } from './components/common/LiveChatWidget';

// Admin Portal
import { AdminLayout } from './pages/admin/AdminLayout';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [sections, setSections] = useState<PageSectionItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioProjectItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Global Order Modal State
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderModalService, setOrderModalService] = useState<ServiceItem | null>(null);
  const [orderModalPackage, setOrderModalPackage] = useState<ServicePackage | null>(null);

  useEffect(() => {
    // Intercept pushState and popstate for smooth SPA routing
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    // Initial data load
    const initData = async () => {
      try {
        const [s, c, sec, p, t, f] = await Promise.all([
          getServices(),
          getCategories(),
          getPageSections('home'),
          getPortfolioProjects(),
          getTestimonials(),
          getFaqs(),
        ]);
        setServices(s);
        setCategories(c);
        setSections(sec);
        setPortfolio(p);
        setTestimonials(t);
        setFaqs(f);
      } catch (e) {
        console.error('Data initialization error:', e);
      } finally {
        setLoading(false);
      }
    };

    initData();

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Intercept click on internal links
  const handleDocumentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (
      anchor &&
      anchor.getAttribute('href')?.startsWith('/') &&
      !anchor.getAttribute('target') &&
      !anchor.getAttribute('download')
    ) {
      e.preventDefault();
      const href = anchor.getAttribute('href')!;
      window.history.pushState({}, '', href);
      setCurrentPath(href.split('?')[0]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openOrderModal = (service?: ServiceItem, pkg?: ServicePackage) => {
    setOrderModalService(service || services[0] || null);
    setOrderModalPackage(pkg || null);
    setOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setOrderModalOpen(false);
    setOrderModalService(null);
    setOrderModalPackage(null);
  };

  // Determine current page
  const isAdminRoute = currentPath.startsWith('/admin');

  // Route matching
  let pageContent = null;
  if (currentPath === '/') {
    pageContent = (
      <HomePage
        services={services}
        categories={categories}
        sections={sections}
        portfolio={portfolio}
        testimonials={testimonials}
        faqs={faqs}
        onOpenOrderModal={s => openOrderModal(s)}
      />
    );
  } else if (currentPath === '/about') {
    pageContent = <AboutPage onOpenOrderModal={() => openOrderModal()} />;
  } else if (currentPath === '/services') {
    const searchParams = new URLSearchParams(window.location.search);
    const cat = searchParams.get('category') || undefined;
    pageContent = (
      <ServicesPage
        services={services}
        categories={categories}
        initialCategory={cat}
        onOpenOrderModal={s => openOrderModal(s)}
      />
    );
  } else if (currentPath.startsWith('/services/')) {
    const slug = currentPath.replace('/services/', '');
    const service = services.find(s => s.slug === slug || s.id === slug) || null;
    pageContent = (
      <ServiceDetailPage
        service={service}
        onOpenOrderModal={(s, pkg) => openOrderModal(s, pkg)}
      />
    );
  } else if (currentPath === '/custom-service') {
    pageContent = <CustomServicePage />;
  } else if (currentPath === '/subscriptions' || currentPath === '/pricing') {
    pageContent = <SubscriptionsPage />;
  } else if (currentPath === '/contact') {
    pageContent = <ContactPage />;
  } else if (currentPath === '/order/success') {
    pageContent = <OrderSuccessPage />;
  } else if (currentPath === '/privacy-policy') {
    pageContent = <PrivacyPolicyPage />;
  } else if (currentPath === '/terms') {
    pageContent = <TermsPage />;
  } else if (isAdminRoute) {
    pageContent = <AdminLayout />;
  } else {
    pageContent = <NotFoundPage />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
        <div onClick={handleDocumentClick} className="min-h-screen bg-[#080B14] text-[#F8FAFC]">
          {/* If on Admin route, render AdminLayout directly without public Header/Footer */}
          {isAdminRoute ? (
            pageContent
          ) : (
            <>
              <Header
                currentPath={currentPath}
                categories={categories}
                onOpenOrderModal={() => openOrderModal()}
              />

              <main>{pageContent}</main>

              <Footer
                categories={categories}
                onOpenOrderModal={() => openOrderModal()}
              />

              {/* Floating WhatsApp Action Button */}
              <WhatsAppButton variant="floating" />

              {/* Real-time Interactive Live Chat Widget */}
              <LiveChatWidget />

              {/* Global Order Now Modal */}
              <OrderModal
                isOpen={orderModalOpen}
                onClose={closeOrderModal}
                service={orderModalService}
                selectedPackage={orderModalPackage}
                allServices={services}
                onOrderSuccess={order => {
                  window.history.pushState({}, '', `/order/success?ref=${order.orderReference}`);
                  setCurrentPath('/order/success');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </div>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
