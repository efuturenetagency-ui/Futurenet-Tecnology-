import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  SiteSettings,
  ServiceCategory,
  ServiceItem,
  OrderItem,
  CustomRequestItem,
  ContactMessageItem,
  PageSectionItem,
  PortfolioProjectItem,
  TestimonialItem,
  FaqItem,
  ActivityLogItem,
  SubscriptionPlan,
  SubscriptionItem,
  PaymentGatewaySettings,
  TransactionItem,
  InvoiceItem,
  InvoiceSettings,
  ClientLogoItem,
  ConversationItem,
  ChatMessage,
  RoleDefinition,
  EmailLogItem,
} from '../types';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_SERVICES,
  INITIAL_PAGE_SECTIONS,
  INITIAL_PORTFOLIO,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  INITIAL_SUBSCRIPTION_PLANS,
  INITIAL_PAYMENT_GATEWAYS,
  INITIAL_CLIENT_LOGOS,
  INITIAL_INVOICE_SETTINGS,
  INITIAL_ROLES,
} from './seedData';

// Generate unique order reference (e.g. FT-2026-8742)
export function generateOrderReference(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `FT-2026-${randomNum}`;
}

export function generateSubscriptionReference(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `FT-SUB-2026-${randomNum}`;
}

export function generateTransactionReference(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `TXN-2026-${randomNum}`;
}

export function generateInvoiceNumber(seq: number = 1001): string {
  return `FT-INV-2026-${seq}`;
}

// Local fallback cache in case Firestore is offline or during cold starts
const localCache = {
  settings: { ...INITIAL_SITE_SETTINGS },
  categories: [...INITIAL_CATEGORIES],
  services: [...INITIAL_SERVICES],
  sections: [...INITIAL_PAGE_SECTIONS],
  portfolio: [...INITIAL_PORTFOLIO],
  testimonials: [...INITIAL_TESTIMONIALS],
  faqs: [...INITIAL_FAQS],
  subscriptionPlans: [...INITIAL_SUBSCRIPTION_PLANS] as SubscriptionPlan[],
  subscriptions: [] as SubscriptionItem[],
  gateways: [...INITIAL_PAYMENT_GATEWAYS] as PaymentGatewaySettings[],
  transactions: [] as TransactionItem[],
  invoices: [] as InvoiceItem[],
  invoiceSettings: { ...INITIAL_INVOICE_SETTINGS } as InvoiceSettings,
  clientLogos: [...INITIAL_CLIENT_LOGOS] as ClientLogoItem[],
  conversations: [] as ConversationItem[],
  messages: {} as Record<string, ChatMessage[]>,
  roles: [...INITIAL_ROLES] as unknown as RoleDefinition[],
  orders: [] as OrderItem[],
  customRequests: [] as CustomRequestItem[],
  contactMessages: [] as ContactMessageItem[],
  logs: [] as ActivityLogItem[],
  emailLogs: [] as EmailLogItem[],
};

// ==================== SITE SETTINGS ====================

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'siteSettings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as SiteSettings;
      localCache.settings = { ...localCache.settings, ...data };
      return localCache.settings;
    } else {
      // First time initialization
      await setDoc(docRef, INITIAL_SITE_SETTINGS);
      return INITIAL_SITE_SETTINGS;
    }
  } catch (error) {
    console.warn('Using local fallback for site settings:', error);
    return localCache.settings;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const updated = {
    ...localCache.settings,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  localCache.settings = updated;
  try {
    const docRef = doc(db, 'siteSettings', 'global');
    await setDoc(docRef, updated, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'siteSettings/global');
  }
  return updated;
}

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<ServiceCategory[]> {
  try {
    const colRef = collection(db, 'serviceCategories');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceCategory));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      localCache.categories = list;
      return list;
    } else {
      // Seed categories
      for (const cat of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'serviceCategories', cat.id), cat);
      }
      return INITIAL_CATEGORIES;
    }
  } catch (error) {
    console.warn('Using local fallback for categories:', error);
    return localCache.categories;
  }
}

export async function saveCategory(category: ServiceCategory): Promise<ServiceCategory> {
  const index = localCache.categories.findIndex(c => c.id === category.id);
  if (index >= 0) {
    localCache.categories[index] = category;
  } else {
    localCache.categories.push(category);
  }
  try {
    await setDoc(doc(db, 'serviceCategories', category.id), category);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `serviceCategories/${category.id}`);
  }
  return category;
}

export async function deleteCategory(id: string): Promise<void> {
  localCache.categories = localCache.categories.filter(c => c.id !== id);
  try {
    await deleteDoc(doc(db, 'serviceCategories', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `serviceCategories/${id}`);
  }
}

// ==================== SERVICES ====================

export async function getServices(): Promise<ServiceItem[]> {
  try {
    const colRef = collection(db, 'services');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceItem));
      list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      localCache.services = list;
      return list;
    } else {
      // Seed services
      for (const s of INITIAL_SERVICES) {
        await setDoc(doc(db, 'services', s.id), s);
      }
      return INITIAL_SERVICES;
    }
  } catch (error) {
    console.warn('Using local fallback for services:', error);
    return localCache.services;
  }
}

export async function getServiceBySlug(slug: string): Promise<ServiceItem | null> {
  const all = await getServices();
  return all.find(s => s.slug === slug || s.id === slug) || null;
}

export async function saveService(service: ServiceItem): Promise<ServiceItem> {
  const updated = { ...service, updatedAt: new Date().toISOString() };
  const index = localCache.services.findIndex(s => s.id === service.id);
  if (index >= 0) {
    localCache.services[index] = updated;
  } else {
    localCache.services.push(updated);
  }
  try {
    await setDoc(doc(db, 'services', service.id), updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `services/${service.id}`);
  }
  return updated;
}

export async function deleteService(id: string): Promise<void> {
  localCache.services = localCache.services.filter(s => s.id !== id);
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
  }
}

// ==================== ORDERS ====================

export async function createOrder(
  data: Omit<OrderItem, 'id' | 'orderReference' | 'status' | 'createdAt'>
): Promise<OrderItem> {
  const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderReference = generateOrderReference();
  const newOrder: OrderItem = {
    ...data,
    id,
    orderReference,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  localCache.orders.unshift(newOrder);

  try {
    await setDoc(doc(db, 'orders', id), newOrder);
  } catch (error) {
    // If client SDK restricted, still check if server created it or fallback
    console.error('Failed to write order via client SDK:', error);
  }

  return newOrder;
}

export async function getOrders(): Promise<OrderItem[]> {
  try {
    const colRef = collection(db, 'orders');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as OrderItem));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    localCache.orders = list;
    return list;
  } catch (error) {
    console.warn('Orders read fallback (admin only access):', error);
    return localCache.orders;
  }
}

export async function updateOrder(id: string, updates: Partial<OrderItem>): Promise<OrderItem> {
  const index = localCache.orders.findIndex(o => o.id === id);
  const current = index >= 0 ? localCache.orders[index] : ({} as OrderItem);
  const updated: OrderItem = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  if (index >= 0) {
    localCache.orders[index] = updated;
  }
  try {
    await updateDoc(doc(db, 'orders', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `orders/${id}`);
  }
  return updated;
}

// ==================== CUSTOM REQUESTS ====================

export async function createCustomRequest(
  data: Omit<CustomRequestItem, 'id' | 'status' | 'createdAt'>
): Promise<CustomRequestItem> {
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newRequest: CustomRequestItem = {
    ...data,
    id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  localCache.customRequests.unshift(newRequest);

  try {
    await setDoc(doc(db, 'customRequests', id), newRequest);
  } catch (error) {
    console.error('Failed to write custom request via client SDK:', error);
  }

  return newRequest;
}

export async function getCustomRequests(): Promise<CustomRequestItem[]> {
  try {
    const colRef = collection(db, 'customRequests');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as CustomRequestItem));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    localCache.customRequests = list;
    return list;
  } catch (error) {
    console.warn('Custom requests read fallback:', error);
    return localCache.customRequests;
  }
}

export async function updateCustomRequest(
  id: string,
  updates: Partial<CustomRequestItem>
): Promise<CustomRequestItem> {
  const index = localCache.customRequests.findIndex(r => r.id === id);
  const current = index >= 0 ? localCache.customRequests[index] : ({} as CustomRequestItem);
  const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
  if (index >= 0) localCache.customRequests[index] = updated;

  try {
    await updateDoc(doc(db, 'customRequests', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `customRequests/${id}`);
  }
  return updated;
}

export async function convertCustomRequestToOrder(
  requestId: string,
  managerName?: string
): Promise<OrderItem | null> {
  const requests = await getCustomRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return null;

  const orderId = `order_${Date.now()}_conv`;
  const orderReference = generateOrderReference();

  const newOrder: OrderItem = {
    id: orderId,
    orderReference,
    serviceId: 'custom-technology-solutions',
    serviceName: `Custom: ${req.projectTitle}`,
    fullName: req.fullName,
    businessName: req.businessName,
    email: req.email,
    phone: req.phone,
    whatsappNumber: req.whatsappNumber,
    projectTitle: req.projectTitle,
    requirements: `Project Type: ${req.projectType}\nTimeline: ${req.expectedTimeline}\nBudget: ${req.budgetRange}\n\nFeatures:\n${(req.features || []).join(', ')}\n\nDescription:\n${req.description}`,
    budgetRange: req.budgetRange,
    expectedDeliveryDate: req.expectedTimeline,
    referenceUrls: req.referenceUrls,
    preferredContactMethod: (req.preferredContactMethod as any) || 'whatsapp',
    privacyConsent: true,
    status: 'under_review',
    assignedManager: managerName || req.assignedManager || 'Lead Project Manager',
    customRequestId: req.id,
    createdAt: new Date().toISOString(),
  };

  localCache.orders.unshift(newOrder);

  // Update original custom request to preserve traceability!
  await updateCustomRequest(requestId, {
    status: 'converted_to_order',
    convertedOrderId: orderId,
  });

  try {
    await setDoc(doc(db, 'orders', orderId), newOrder);
  } catch (error) {
    console.error('Error saving converted order:', error);
  }

  return newOrder;
}

// ==================== CONTACT MESSAGES ====================

export async function submitContactMessage(
  data: Omit<ContactMessageItem, 'id' | 'isRead' | 'status' | 'createdAt'>
): Promise<ContactMessageItem> {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const message: ContactMessageItem = {
    ...data,
    id,
    isRead: false,
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  localCache.contactMessages.unshift(message);

  try {
    await setDoc(doc(db, 'contactMessages', id), message);
  } catch (error) {
    console.error('Failed to save contact message to Firestore:', error);
  }

  return message;
}

export async function getContactMessages(): Promise<ContactMessageItem[]> {
  try {
    const colRef = collection(db, 'contactMessages');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessageItem));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    localCache.contactMessages = list;
    return list;
  } catch (error) {
    return localCache.contactMessages;
  }
}

export async function updateContactMessage(
  id: string,
  updates: Partial<ContactMessageItem>
): Promise<ContactMessageItem> {
  const index = localCache.contactMessages.findIndex(m => m.id === id);
  const current = index >= 0 ? localCache.contactMessages[index] : ({} as ContactMessageItem);
  const updated = { ...current, ...updates };
  if (index >= 0) localCache.contactMessages[index] = updated;

  try {
    await updateDoc(doc(db, 'contactMessages', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `contactMessages/${id}`);
  }
  return updated;
}

// ==================== PAGE SECTIONS ====================

export async function getPageSections(pageId: string = 'home'): Promise<PageSectionItem[]> {
  try {
    const colRef = collection(db, 'pageSections');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() } as PageSectionItem))
        .filter(s => s.pageId === pageId);
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      localCache.sections = list;
      return list;
    } else {
      for (const s of INITIAL_PAGE_SECTIONS) {
        await setDoc(doc(db, 'pageSections', s.id), s);
      }
      return INITIAL_PAGE_SECTIONS;
    }
  } catch (error) {
    return localCache.sections.filter(s => s.pageId === pageId);
  }
}

export async function savePageSection(section: PageSectionItem): Promise<PageSectionItem> {
  const updated = { ...section, updatedAt: new Date().toISOString() };
  const index = localCache.sections.findIndex(s => s.id === section.id);
  if (index >= 0) localCache.sections[index] = updated;
  else localCache.sections.push(updated);

  try {
    await setDoc(doc(db, 'pageSections', section.id), updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `pageSections/${section.id}`);
  }
  return updated;
}

export async function deletePageSection(id: string): Promise<void> {
  localCache.sections = localCache.sections.filter(s => s.id !== id);
  try {
    await deleteDoc(doc(db, 'pageSections', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `pageSections/${id}`);
  }
}

// ==================== PORTFOLIO ====================

export async function getPortfolioProjects(): Promise<PortfolioProjectItem[]> {
  try {
    const colRef = collection(db, 'portfolioProjects');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioProjectItem));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      localCache.portfolio = list;
      return list;
    } else {
      for (const p of INITIAL_PORTFOLIO) {
        await setDoc(doc(db, 'portfolioProjects', p.id), p);
      }
      return INITIAL_PORTFOLIO;
    }
  } catch (error) {
    return localCache.portfolio;
  }
}

export async function savePortfolioProject(project: PortfolioProjectItem): Promise<PortfolioProjectItem> {
  const index = localCache.portfolio.findIndex(p => p.id === project.id);
  if (index >= 0) localCache.portfolio[index] = project;
  else localCache.portfolio.push(project);

  try {
    await setDoc(doc(db, 'portfolioProjects', project.id), project);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `portfolioProjects/${project.id}`);
  }
  return project;
}

export async function deletePortfolioProject(id: string): Promise<void> {
  localCache.portfolio = localCache.portfolio.filter(p => p.id !== id);
  try {
    await deleteDoc(doc(db, 'portfolioProjects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `portfolioProjects/${id}`);
  }
}

// ==================== TESTIMONIALS ====================

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const colRef = collection(db, 'testimonials');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as TestimonialItem));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      localCache.testimonials = list;
      return list;
    } else {
      for (const t of INITIAL_TESTIMONIALS) {
        await setDoc(doc(db, 'testimonials', t.id), t);
      }
      return INITIAL_TESTIMONIALS;
    }
  } catch (error) {
    return localCache.testimonials;
  }
}

export async function saveTestimonial(t: TestimonialItem): Promise<TestimonialItem> {
  const index = localCache.testimonials.findIndex(item => item.id === t.id);
  if (index >= 0) localCache.testimonials[index] = t;
  else localCache.testimonials.push(t);

  try {
    await setDoc(doc(db, 'testimonials', t.id), t);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `testimonials/${t.id}`);
  }
  return t;
}

export async function deleteTestimonial(id: string): Promise<void> {
  localCache.testimonials = localCache.testimonials.filter(item => item.id !== id);
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
  }
}

// ==================== FAQS ====================

export async function getFaqs(): Promise<FaqItem[]> {
  try {
    const colRef = collection(db, 'faqs');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as FaqItem));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      localCache.faqs = list;
      return list;
    } else {
      for (const f of INITIAL_FAQS) {
        await setDoc(doc(db, 'faqs', f.id), f);
      }
      return INITIAL_FAQS;
    }
  } catch (error) {
    return localCache.faqs;
  }
}

export async function saveFaq(faq: FaqItem): Promise<FaqItem> {
  const index = localCache.faqs.findIndex(f => f.id === faq.id);
  if (index >= 0) localCache.faqs[index] = faq;
  else localCache.faqs.push(faq);

  try {
    await setDoc(doc(db, 'faqs', faq.id), faq);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `faqs/${faq.id}`);
  }
  return faq;
}

export async function deleteFaq(id: string): Promise<void> {
  localCache.faqs = localCache.faqs.filter(f => f.id !== id);
  try {
    await deleteDoc(doc(db, 'faqs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `faqs/${id}`);
  }
}

// ==================== ACTIVITY LOGS ====================

export async function logAdminActivity(
  adminEmail: string,
  action: string,
  target: string,
  details: string
): Promise<void> {
  const id = `log_${Date.now()}`;
  const logItem: ActivityLogItem = {
    id,
    adminEmail,
    action,
    target,
    details,
    timestamp: new Date().toISOString(),
  };
  localCache.logs.unshift(logItem);

  try {
    await setDoc(doc(db, 'activityLogs', id), logItem);
  } catch (e) {
    // Audit logging failure shouldn't crash app
  }
}

export async function getActivityLogs(): Promise<ActivityLogItem[]> {
  try {
    const colRef = collection(db, 'activityLogs');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ActivityLogItem));
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    localCache.logs = list;
    return list;
  } catch (error) {
    return localCache.logs;
  }
}

// ==================== SUBSCRIPTION PLANS ====================

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  try {
    const colRef = collection(db, 'subscriptionPlans');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as SubscriptionPlan));
      localCache.subscriptionPlans = list;
      return list;
    } else {
      // Seed default plans
      for (const plan of INITIAL_SUBSCRIPTION_PLANS) {
        await setDoc(doc(db, 'subscriptionPlans', plan.id), plan);
      }
      return INITIAL_SUBSCRIPTION_PLANS;
    }
  } catch (error) {
    return localCache.subscriptionPlans;
  }
}

export async function saveSubscriptionPlan(plan: SubscriptionPlan): Promise<SubscriptionPlan> {
  const updated = { ...plan, updatedAt: new Date().toISOString() };
  const index = localCache.subscriptionPlans.findIndex(p => p.id === plan.id);
  if (index >= 0) localCache.subscriptionPlans[index] = updated;
  else localCache.subscriptionPlans.push(updated);

  try {
    await setDoc(doc(db, 'subscriptionPlans', plan.id), updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `subscriptionPlans/${plan.id}`);
  }
  return updated;
}

export async function deleteSubscriptionPlan(id: string): Promise<void> {
  localCache.subscriptionPlans = localCache.subscriptionPlans.filter(p => p.id !== id);
  try {
    await deleteDoc(doc(db, 'subscriptionPlans', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `subscriptionPlans/${id}`);
  }
}

// ==================== SUBSCRIPTIONS ====================

export async function getSubscriptions(): Promise<SubscriptionItem[]> {
  try {
    const colRef = collection(db, 'subscriptions');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as SubscriptionItem));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    localCache.subscriptions = list;
    return list;
  } catch (error) {
    return localCache.subscriptions;
  }
}

export async function createSubscription(
  subData: Omit<SubscriptionItem, 'id' | 'subscriptionReference' | 'createdAt'>
): Promise<SubscriptionItem> {
  const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const subscriptionReference = generateSubscriptionReference();
  const newSub: SubscriptionItem = {
    ...subData,
    id,
    subscriptionReference,
    createdAt: new Date().toISOString(),
  };

  localCache.subscriptions.unshift(newSub);

  try {
    await setDoc(doc(db, 'subscriptions', id), newSub);
  } catch (error) {
    console.error('Failed to create subscription in Firestore:', error);
  }

  return newSub;
}

export async function updateSubscription(
  id: string,
  updates: Partial<SubscriptionItem>
): Promise<SubscriptionItem> {
  const index = localCache.subscriptions.findIndex(s => s.id === id);
  const current = index >= 0 ? localCache.subscriptions[index] : ({} as SubscriptionItem);
  const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
  if (index >= 0) localCache.subscriptions[index] = updated;

  try {
    await updateDoc(doc(db, 'subscriptions', id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `subscriptions/${id}`);
  }
  return updated;
}

// ==================== PAYMENT GATEWAYS ====================

export async function getPaymentGateways(): Promise<PaymentGatewaySettings[]> {
  try {
    const colRef = collection(db, 'paymentGatewaySettings');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentGatewaySettings));
      localCache.gateways = list;
      return list;
    } else {
      for (const gw of INITIAL_PAYMENT_GATEWAYS) {
        await setDoc(doc(db, 'paymentGatewaySettings', gw.id), gw);
      }
      return INITIAL_PAYMENT_GATEWAYS as unknown as PaymentGatewaySettings[];
    }
  } catch (error) {
    return localCache.gateways;
  }
}

export async function updatePaymentGateway(
  id: string,
  updates: Partial<PaymentGatewaySettings>
): Promise<PaymentGatewaySettings> {
  const index = localCache.gateways.findIndex(g => g.id === id);
  const current = index >= 0 ? localCache.gateways[index] : ({} as PaymentGatewaySettings);
  const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
  if (index >= 0) localCache.gateways[index] = updated;

  try {
    await setDoc(doc(db, 'paymentGatewaySettings', id), updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `paymentGatewaySettings/${id}`);
  }
  return updated;
}

// ==================== TRANSACTIONS ====================

export async function getTransactions(): Promise<TransactionItem[]> {
  try {
    const colRef = collection(db, 'transactions');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as TransactionItem));
    list.sort((a, b) => new Date(b.createdTimestamp).getTime() - new Date(a.createdTimestamp).getTime());
    localCache.transactions = list;
    return list;
  } catch (error) {
    return localCache.transactions;
  }
}

export async function createTransaction(
  txnData: Omit<TransactionItem, 'id' | 'createdTimestamp'> & { transactionReference?: string }
): Promise<TransactionItem> {
  const id = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const transactionReference = txnData.transactionReference || generateTransactionReference();
  const txn: TransactionItem = {
    ...txnData,
    id,
    transactionReference,
    createdTimestamp: new Date().toISOString(),
  };

  localCache.transactions.unshift(txn);

  try {
    await setDoc(doc(db, 'transactions', id), txn);
  } catch (error) {
    console.error('Failed to create transaction in Firestore:', error);
  }

  return txn;
}

export async function updateTransaction(
  id: string,
  updates: Partial<TransactionItem>
): Promise<TransactionItem> {
  const index = localCache.transactions.findIndex(t => t.id === id);
  const current = index >= 0 ? localCache.transactions[index] : ({} as TransactionItem);
  const updated = { ...current, ...updates };
  if (index >= 0) localCache.transactions[index] = updated;

  try {
    await updateDoc(doc(db, 'transactions', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `transactions/${id}`);
  }
  return updated;
}

// ==================== INVOICES ====================

export async function getInvoices(): Promise<InvoiceItem[]> {
  try {
    const colRef = collection(db, 'invoices');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as InvoiceItem));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    localCache.invoices = list;
    return list;
  } catch (error) {
    return localCache.invoices;
  }
}

export async function createInvoice(
  invData: Omit<InvoiceItem, 'id' | 'createdAt'>
): Promise<InvoiceItem> {
  const id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const invoice: InvoiceItem = {
    ...invData,
    id,
    createdAt: new Date().toISOString(),
  };

  localCache.invoices.unshift(invoice);

  try {
    await setDoc(doc(db, 'invoices', id), invoice);
  } catch (error) {
    console.error('Failed to create invoice in Firestore:', error);
  }

  return invoice;
}

export async function updateInvoice(
  id: string,
  updates: Partial<InvoiceItem>
): Promise<InvoiceItem> {
  const index = localCache.invoices.findIndex(inv => inv.id === id);
  const current = index >= 0 ? localCache.invoices[index] : ({} as InvoiceItem);
  const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
  if (index >= 0) localCache.invoices[index] = updated;

  try {
    await updateDoc(doc(db, 'invoices', id), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `invoices/${id}`);
  }
  return updated;
}

export async function deleteInvoice(id: string): Promise<void> {
  localCache.invoices = localCache.invoices.filter(i => i.id !== id);
  try {
    await deleteDoc(doc(db, 'invoices', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `invoices/${id}`);
  }
}

export async function getInvoiceSettings(): Promise<InvoiceSettings> {
  try {
    const docRef = doc(db, 'invoiceSettings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as InvoiceSettings;
      localCache.invoiceSettings = { ...localCache.invoiceSettings, ...data };
      return localCache.invoiceSettings;
    } else {
      await setDoc(docRef, INITIAL_INVOICE_SETTINGS);
      return INITIAL_INVOICE_SETTINGS;
    }
  } catch (error) {
    return localCache.invoiceSettings;
  }
}

export async function updateInvoiceSettings(
  settings: Partial<InvoiceSettings>
): Promise<InvoiceSettings> {
  const updated = {
    ...localCache.invoiceSettings,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  localCache.invoiceSettings = updated;

  try {
    await setDoc(doc(db, 'invoiceSettings', 'global'), updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'invoiceSettings/global');
  }
  return updated;
}

// ==================== CLIENT LOGOS ====================

export async function getClientLogos(): Promise<ClientLogoItem[]> {
  try {
    const colRef = collection(db, 'clientLogos');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ClientLogoItem));
      list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      localCache.clientLogos = list;
      return list;
    } else {
      for (const logo of INITIAL_CLIENT_LOGOS) {
        await setDoc(doc(db, 'clientLogos', logo.id), logo);
      }
      return INITIAL_CLIENT_LOGOS;
    }
  } catch (error) {
    return localCache.clientLogos;
  }
}

export async function saveClientLogo(logo: ClientLogoItem): Promise<ClientLogoItem> {
  const index = localCache.clientLogos.findIndex(l => l.id === logo.id);
  if (index >= 0) localCache.clientLogos[index] = logo;
  else localCache.clientLogos.push(logo);

  try {
    await setDoc(doc(db, 'clientLogos', logo.id), logo);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `clientLogos/${logo.id}`);
  }
  return logo;
}

export async function deleteClientLogo(id: string): Promise<void> {
  localCache.clientLogos = localCache.clientLogos.filter(l => l.id !== id);
  try {
    await deleteDoc(doc(db, 'clientLogos', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `clientLogos/${id}`);
  }
}

// ==================== CONVERSATIONS & CHAT ====================

export async function getConversations(): Promise<ConversationItem[]> {
  try {
    const colRef = collection(db, 'conversations');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ConversationItem));
    list.sort(
      (a, b) =>
        new Date(b.lastMessageTimestamp).getTime() - new Date(a.lastMessageTimestamp).getTime()
    );
    localCache.conversations = list;
    return list;
  } catch (error) {
    return localCache.conversations;
  }
}

export async function getConversationMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const colRef = collection(db, 'conversations', conversationId, 'messages');
    const snap = await getDocs(colRef);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage));
    list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    localCache.messages[conversationId] = list;
    return list;
  } catch (error) {
    return localCache.messages[conversationId] || [];
  }
}

export async function sendChatMessage(
  conversationId: string,
  msg: Omit<ChatMessage, 'id' | 'timestamp'>
): Promise<ChatMessage> {
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const fullMsg: ChatMessage = {
    ...msg,
    id: msgId,
    timestamp: new Date().toISOString(),
  };

  if (!localCache.messages[conversationId]) {
    localCache.messages[conversationId] = [];
  }
  localCache.messages[conversationId].push(fullMsg);

  // Update conversation lastMessage
  const convIndex = localCache.conversations.findIndex(c => c.id === conversationId);
  if (convIndex >= 0) {
    localCache.conversations[convIndex].lastMessageText = fullMsg.text;
    localCache.conversations[convIndex].lastMessageTimestamp = fullMsg.timestamp;
    if (fullMsg.senderType === 'customer') {
      localCache.conversations[convIndex].isReadByAdmin = false;
    }
  }

  try {
    await setDoc(doc(db, 'conversations', conversationId, 'messages', msgId), fullMsg);
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessageText: fullMsg.text,
      lastMessageTimestamp: fullMsg.timestamp,
      isReadByAdmin: fullMsg.senderType !== 'customer',
    });
  } catch (error) {
    console.error('Failed to send chat message:', error);
  }

  return fullMsg;
}

export async function createConversation(
  conv: Omit<ConversationItem, 'id' | 'createdAt' | 'lastMessageTimestamp'>
): Promise<ConversationItem> {
  const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date().toISOString();
  const newConv: ConversationItem = {
    ...conv,
    id,
    createdAt: now,
    lastMessageTimestamp: now,
  };

  localCache.conversations.unshift(newConv);

  try {
    await setDoc(doc(db, 'conversations', id), newConv);
  } catch (error) {
    console.error('Failed to create conversation in Firestore:', error);
  }

  return newConv;
}

export async function updateConversation(
  id: string,
  updates: Partial<ConversationItem>
): Promise<ConversationItem> {
  const index = localCache.conversations.findIndex(c => c.id === id);
  const current = index >= 0 ? localCache.conversations[index] : ({} as ConversationItem);
  const updated = { ...current, ...updates };
  if (index >= 0) localCache.conversations[index] = updated;

  try {
    await updateDoc(doc(db, 'conversations', id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `conversations/${id}`);
  }
  return updated;
}

// ==================== ROLES & PERMISSIONS ====================

export async function getRoleDefinitions(): Promise<RoleDefinition[]> {
  try {
    const colRef = collection(db, 'roles');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as RoleDefinition));
      localCache.roles = list;
      return list;
    } else {
      for (const role of INITIAL_ROLES) {
        await setDoc(doc(db, 'roles', role.id), role);
      }
      return INITIAL_ROLES as unknown as RoleDefinition[];
    }
  } catch (error) {
    return localCache.roles;
  }
}

export async function saveRoleDefinition(role: RoleDefinition): Promise<RoleDefinition> {
  const updated = { ...role, updatedAt: new Date().toISOString() };
  const index = localCache.roles.findIndex(r => r.id === role.id);
  if (index >= 0) localCache.roles[index] = updated;
  else localCache.roles.push(updated);

  try {
    await setDoc(doc(db, 'roles', role.id), updated);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `roles/${role.id}`);
  }
  return updated;
}

export async function deleteRoleDefinition(id: string): Promise<void> {
  localCache.roles = localCache.roles.filter(r => r.id !== id);
  try {
    await deleteDoc(doc(db, 'roles', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `roles/${id}`);
  }
}

// ==================== EMAIL NOTIFICATIONS & AUDIT LOGS ====================

export const INITIAL_EMAIL_LOGS: EmailLogItem[] = [
  {
    id: 'eml_1712839201',
    recipientEmail: 'mdshihabhossen.web@gmail.com',
    recipientName: 'Shihab Hossen',
    emailType: 'order_confirmation',
    subject: 'Order Confirmed: #FT-2026-8742 - Futurent Technology Services',
    referenceCode: 'FT-2026-8742',
    status: 'delivered',
    sentTimestamp: '2026-10-10T14:30:00Z',
    provider: 'SendGrid API',
    deliveryResponse: '250 OK: Message accepted for delivery by mx.google.com',
    attachmentName: 'order_summary_FT-2026-8742.pdf',
  },
  {
    id: 'eml_1712839202',
    recipientEmail: 'corporate@futurent.dev',
    recipientName: 'Apex Logistics Ltd',
    emailType: 'invoice_delivery',
    subject: 'Tax Invoice FT-INV-2026-1001 for Web Application Development',
    referenceCode: 'FT-INV-2026-1001',
    status: 'delivered',
    sentTimestamp: '2026-10-10T15:10:00Z',
    provider: 'SendGrid API',
    deliveryResponse: '250 2.0.0 OK 1712839202 d29si10237780plm.12 - gsmtp',
    attachmentName: 'Invoice_FT-INV-2026-1001.pdf',
  },
  {
    id: 'eml_1712839203',
    recipientEmail: 'ceo@techfin-bd.com',
    recipientName: 'Rafiqul Islam',
    emailType: 'subscription_activated',
    subject: 'Subscription Activated: Growth Retainer (Quarterly) - Futurent Technology',
    referenceCode: 'FT-SUB-2026-4029',
    status: 'delivered',
    sentTimestamp: '2026-10-10T18:45:00Z',
    provider: 'SendGrid API',
    deliveryResponse: '250 2.0.0 OK Message delivered to inbox',
    attachmentName: 'Subscription_Agreement_FT-SUB-2026-4029.pdf',
  },
];

export async function getEmailLogs(): Promise<EmailLogItem[]> {
  try {
    const colRef = collection(db, 'emailLogs');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as EmailLogItem));
      list.sort((a, b) => new Date(b.sentTimestamp).getTime() - new Date(a.sentTimestamp).getTime());
      localCache.emailLogs = list;
      return list;
    } else {
      for (const log of INITIAL_EMAIL_LOGS) {
        await setDoc(doc(db, 'emailLogs', log.id), log);
      }
      return INITIAL_EMAIL_LOGS;
    }
  } catch (error) {
    return localCache.emailLogs.length > 0 ? localCache.emailLogs : INITIAL_EMAIL_LOGS;
  }
}

export async function recordEmailLog(log: Omit<EmailLogItem, 'id'>): Promise<EmailLogItem> {
  const id = `eml_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const item: EmailLogItem = { id, ...log };
  localCache.emailLogs.unshift(item);

  try {
    await setDoc(doc(db, 'emailLogs', id), item);
  } catch (error) {
    console.warn('Could not write email log to Firestore:', error);
  }
  return item;
}

