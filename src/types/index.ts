export type UserRole =
  | 'super_admin'
  | 'manager'
  | 'order_manager'
  | 'accountant'
  | 'content_editor'
  | 'customer_support'
  | string;

export type RoleAction =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'publish'
  | 'print'
  | 'export'
  | 'refund'
  | 'configure';

export type AppModuleId =
  | 'dashboard'
  | 'pages'
  | 'sections'
  | 'design'
  | 'services'
  | 'categories'
  | 'packages'
  | 'orders'
  | 'custom_requests'
  | 'customers'
  | 'subscriptions'
  | 'gateways'
  | 'transactions'
  | 'invoices'
  | 'sales_reports'
  | 'messaging'
  | 'client_logos'
  | 'media'
  | 'contact_messages'
  | 'users_roles'
  | 'security'
  | 'backups';

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  isSystemDefault: boolean;
  permissions: Record<string, RoleAction[]>;
  updatedAt?: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  roleId?: string;
  roleName?: string;
  customPermissionOverrides?: Record<string, RoleAction[]>;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface SiteColors {
  primaryBg: string;
  secondaryBg: string;
  cardBg: string;
  primaryAccent: string;
  secondaryAccent: string;
  neonCyan: string;
  primaryText: string;
  secondaryText: string;
  borders: string;
}

export interface SiteTypography {
  headingFont: string;
  bodyFont: string;
  baseSize: string;
  headingWeight: string;
}

export interface SiteLayout {
  containerWidth: string;
  cardRadius: string;
  sectionPadding: string;
}

export interface CurrencySettings {
  defaultCurrency: 'USD' | 'BDT';
  usdToBdtRate: number;
  fixedBdtPrices?: Record<string, number>;
}

export interface PrintSettings {
  companyName: string;
  tagline?: string;
  address: string;
  phone: string;
  email: string;
  taxId?: string;
  logoUrl?: string;
  footerNotice?: string;
  paperSize?: 'A4';
  orientation?: 'portrait' | 'landscape';
}

export interface LogoBrandingSettings {
  logoUrl?: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  logoWidth?: number;
  logoMaxHeight?: number;
  logoAlignment?: 'left' | 'center';
  showBrandText?: boolean;
  showTagline?: boolean;
}

export interface SiteSettings {
  id?: string;
  brandName: string;
  tagline: string;
  logoUrl?: string;
  logoLightUrl?: string;
  logoDarkUrl?: string;
  logoWidth?: number;
  logoMaxHeight?: number;
  logoAlignment?: 'left' | 'center';
  showBrandText?: boolean;
  showTagline?: boolean;
  cyberStyleEnabled?: boolean;
  faviconUrl?: string;
  whatsappNumber: string;
  whatsappDefaultMessage: string;
  supportEmail: string;
  supportPhone: string;
  officeAddress: string;
  workingHours: string;
  socialLinks: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    youtube?: string;
  };
  colors: SiteColors;
  lightColors?: SiteColors;
  darkColors?: SiteColors;
  currencySettings?: CurrencySettings;
  printSettings?: PrintSettings;
  typography: SiteTypography;
  layout: SiteLayout;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  updatedAt?: string;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  icon?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  deliveryDays: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface ServiceItem {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image?: string;
  price?: number;
  startingPriceLabel?: string;
  deliveryEstimate?: string;
  features: string[];
  packages?: ServicePackage[];
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: string;
}

export type OrderStatus =
  | 'new'
  | 'under_review'
  | 'awaiting_client_info'
  | 'quotation_sent'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  orderReference: string;
  serviceId: string;
  serviceName: string;
  packageName?: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  projectTitle?: string;
  requirements: string;
  budgetRange?: string;
  expectedDeliveryDate?: string;
  referenceUrls?: string;
  preferredContactMethod?: 'whatsapp' | 'email' | 'phone';
  privacyConsent: boolean;
  status: OrderStatus;
  assignedManager?: string;
  internalNotes?: string;
  quotationAmount?: number;
  agreedBudget?: number;
  paymentStatus?: 'pending' | 'partially_paid' | 'paid' | 'waived';
  customRequestId?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CustomRequestStatus = 'pending' | 'reviewed' | 'converted_to_order' | 'declined';

export interface CustomRequestItem {
  id: string;
  projectType: string;
  projectTitle: string;
  description: string;
  features: string[];
  referenceUrls?: string;
  budgetRange: string;
  expectedTimeline: string;
  fullName: string;
  businessName?: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  preferredContactMethod?: string;
  status: CustomRequestStatus;
  convertedOrderId?: string;
  assignedManager?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  privacyConsent: boolean;
  isRead: boolean;
  status: 'new' | 'replied' | 'archived';
  internalNotes?: string;
  createdAt: string;
}

export interface PageSectionItem {
  id: string;
  pageId: string;
  sectionType: string;
  title: string;
  subtitle?: string;
  order: number;
  isEnabled: boolean;
  visibility: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  content: Record<string, any>;
  isPublished: boolean;
  updatedAt?: string;
}

export interface PortfolioProjectItem {
  id: string;
  title: string;
  category: string;
  description: string;
  client?: string;
  tags: string[];
  image: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
  isActive: boolean;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  company: string;
  role: string;
  quote: string;
  rating: number;
  avatar?: string;
  isActive: boolean;
  order: number;
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
}

export interface MediaAssetItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  altText: string;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  adminEmail: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

// ==================== NEW ADVANCED MODULES ====================

// --- MODULE 1: SUBSCRIPTIONS ---
export type BillingInterval = 'monthly' | 'quarterly' | 'half_yearly' | 'annual' | 'custom';
export type SubscriptionStatus = 'pending' | 'active' | 'past_due' | 'paused' | 'cancelled' | 'expired';

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice?: number;
  halfYearlyPrice?: number;
  annualPrice?: number;
  currency: string;
  includedServices: string[];
  usageLimits: Record<string, string>;
  features: string[];
  trialPeriodDays?: number;
  setupFee?: number;
  discountPercentage?: number;
  isVisible: boolean;
  isFeatured: boolean;
  autoRenew: boolean;
  cancellationPolicy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionItem {
  id: string;
  subscriptionReference: string;
  planId: string;
  planName: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  billingInterval: BillingInterval;
  currentPrice: number;
  currency: string;
  status: SubscriptionStatus;
  startDate: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  nextBillingDate: string;
  cancelledAt?: string;
  cancellationReason?: string;
  paymentMethod?: string;
  gateway?: string;
  latestInvoiceId?: string;
  autoRenew: boolean;
  manualPaymentInstructions?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionPaymentRecord {
  id: string;
  subscriptionId: string;
  invoiceId?: string;
  transactionId?: string;
  amount: number;
  currency: string;
  status: 'successful' | 'failed' | 'pending';
  paymentDate: string;
  paymentMethod: string;
  gatewayReference?: string;
}

// --- MODULE 2 & 7: PAYMENT GATEWAYS & TRANSACTIONS ---
export type PaymentGatewayId = 'sslcommerz' | 'bkash' | 'nagad' | 'stripe' | 'manual_bank' | 'manual_authorized';

export interface PaymentGatewaySettings {
  id: PaymentGatewayId;
  displayName: string;
  isEnabled: boolean;
  isSandbox: boolean;
  testCredentials: Record<string, string>;
  liveCredentials: Record<string, string>;
  callbackUrl: string;
  webhookUrl: string;
  permittedCurrencies: string[];
  isDefault: boolean;
  manualInstructions?: string;
  bankDetails?: {
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
    branchRouting?: string;
  };
  updatedAt?: string;
}

export type TransactionType = 'payment' | 'partial_payment' | 'refund' | 'credit_adjustment' | 'manual_entry';
export type TransactionStatus = 'pending' | 'successful' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';

export interface TransactionItem {
  id: string;
  transactionReference: string;
  relatedOrderId?: string;
  relatedSubscriptionId?: string;
  relatedInvoiceId?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  paymentGateway: PaymentGatewayId;
  paymentMethod: string;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  gatewayReference?: string;
  gatewayResponse?: Record<string, any>;
  paymentTimestamp?: string;
  createdTimestamp: string;
  authorizedNotes?: string;
  refundReference?: string;
  isManualEntry?: boolean;
  recordedByAdmin?: string;
}

// --- MODULE 3: CLIENT LOGO BOARD ---
export interface ClientLogoItem {
  id: string;
  clientName: string;
  websiteUrl?: string;
  logoUrl: string;
  altText: string;
  isFeatured: boolean;
  isEnabled: boolean;
  displayOrder: number;
  createdAt: string;
}

// --- MODULE 4: MESSAGING & UNIFIED INBOX ---
export type ConversationChannel = 'whatsapp' | 'messenger' | 'website_chat';
export type ConversationStatus = 'open' | 'pending' | 'in_progress' | 'closed';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: 'customer' | 'agent' | 'system';
  senderName: string;
  senderEmail?: string;
  text: string;
  timestamp: string;
  channel: ConversationChannel;
  deliveryStatus?: 'sent' | 'delivered' | 'read' | 'failed';
  externalMessageId?: string;
}

export interface ConversationItem {
  id: string;
  channel: ConversationChannel;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  whatsappNumber?: string;
  subject?: string;
  status: ConversationStatus;
  isReadByAdmin: boolean;
  assignedStaffEmail?: string;
  linkedOrderId?: string;
  linkedCustomerId?: string;
  internalNotes?: string;
  lastMessageText: string;
  lastMessageTimestamp: string;
  createdAt: string;
}

export interface MessagingIntegrationsConfig {
  whatsappCloudApi: {
    enabled: boolean;
    phoneNumberId?: string;
    wabaId?: string;
    apiToken?: string;
    webhookVerifyToken?: string;
  };
  messenger: {
    enabled: boolean;
    pageId?: string;
    pageAccessToken?: string;
    appSecret?: string;
    webhookVerifyToken?: string;
  };
  liveChat: {
    enabled: boolean;
    greetingMessage: string;
    offlineMessage: string;
    promptText: string;
  };
}

// --- MODULE 6 & 10: INVOICES ---
export type InvoiceStatus = 'draft' | 'issued' | 'paid' | 'partially_paid' | 'unpaid' | 'cancelled' | 'refunded';

export interface InvoiceLineItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  total: number;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  title: string;
  orderId?: string;
  subscriptionId?: string;
  transactionId?: string;
  customerName: string;
  customerCompany?: string;
  customerAddress?: string;
  customerEmail: string;
  customerPhone?: string;
  customerReference?: string;
  items: InvoiceLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceRemaining: number;
  currency: string;
  status: InvoiceStatus;
  paymentMethod?: string;
  transactionReference?: string;
  qrCodeDataUrl?: string;
  notes?: string;
  terms?: string;
  templateId?: 'futuristic_dark' | 'clean_minimal' | 'corporate_a4';
  createdAt: string;
  updatedAt?: string;
}

export interface InvoiceSettings {
  id: string;
  companyName: string;
  companyLogoUrl: string;
  companyAddress: string;
  businessPhone: string;
  businessEmail: string;
  websiteUrl: string;
  facebookUrl: string;
  invoiceTitle: string;
  invoiceNumberPrefix: string;
  nextNumber: number;
  footerText: string;
  thankYouMessage: string;
  qrCodeUrl?: string;
  defaultCurrency: string;
  taxPercentage: number;
  taxRegistrationNumber?: string;
  defaultPaymentInstructions: string;
  printMarginMm: number;
  preferredOrientation: 'portrait' | 'landscape';
  template: 'futuristic_dark' | 'clean_minimal' | 'corporate_a4';
  updatedAt?: string;
}

// --- MODULE: EMAIL NOTIFICATIONS & LOGS ---
export type EmailType = 'order_confirmation' | 'invoice_delivery' | 'subscription_activated' | 'custom_quote' | 'payment_reminder';
export type EmailDeliveryStatus = 'delivered' | 'sent' | 'pending' | 'failed';

export interface EmailLogItem {
  id: string;
  recipientEmail: string;
  recipientName: string;
  emailType: EmailType;
  subject: string;
  referenceCode: string; // Order ref, invoice num, or sub ref
  status: EmailDeliveryStatus;
  sentTimestamp: string;
  provider: 'Direct SMTP' | 'SendGrid API' | 'Internal Mail Dispatch';
  deliveryResponse?: string;
  attachmentName?: string;
}

// --- MODULE: THEMES & LOCALIZATION ---
export type ThemeId = 'cyber_dark' | 'neon_matrix' | 'clean_minimal';
export type LanguageCode = 'en' | 'bn';

