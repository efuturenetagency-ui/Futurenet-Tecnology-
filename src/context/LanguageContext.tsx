import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';

interface TranslationKeys {
  home: string;
  aboutUs: string;
  services: string;
  subscriptions: string;
  customService: string;
  contactUs: string;
  portalLogin: string;
  exploreServices: string;
  startProject: string;
  trustedByClients: string;
  corePillars: string;
  productionUptime: string;
  specializedServices: string;
  subscribeNow: string;
  viewPlans: string;
  billedMonthly: string;
  billedQuarterly: string;
  billedAnnually: string;
  orderConfirmationTitle: string;
  invoiceSummary: string;
  payWithSSL: string;
  payWithBkash: string;
  payWithNagad: string;
  bankTransfer: string;
  allRightsReserved: string;
  darkFuturisticTheme: string;
  neonMatrixTheme: string;
  cleanMinimalTheme: string;
}

const translations: Record<LanguageCode, TranslationKeys> = {
  en: {
    home: 'Home',
    aboutUs: 'About Us',
    services: 'Services',
    subscriptions: 'Subscriptions',
    customService: 'Custom Service',
    contactUs: 'Contact Us',
    portalLogin: 'Portal Login',
    exploreServices: 'Explore Our Services',
    startProject: 'Start Your Project',
    trustedByClients: 'TRUSTED BY FORWARD-THINKING ENTERPRISES & GROWTH LEADERS',
    corePillars: 'Core Tech Pillars',
    productionUptime: 'Production Uptime',
    specializedServices: 'Specialized Services',
    subscribeNow: 'Subscribe Now',
    viewPlans: 'View All Retainer Plans',
    billedMonthly: '/month',
    billedQuarterly: '/quarter',
    billedAnnually: '/year',
    orderConfirmationTitle: 'Order Confirmation & Verification',
    invoiceSummary: 'Tax Invoice Summary',
    payWithSSL: 'Pay via SSLCommerz Gateway',
    payWithBkash: 'Pay via bKash Merchant',
    payWithNagad: 'Pay via Nagad Merchant',
    bankTransfer: 'Authorized Bank Transfer',
    allRightsReserved: 'All Rights Reserved. Futurent Technology.',
    darkFuturisticTheme: 'Cyber Dark (2026)',
    neonMatrixTheme: 'Neon Matrix',
    cleanMinimalTheme: 'Clean Minimalist',
  },
  bn: {
    home: 'হোম',
    aboutUs: 'আমাদের সম্পর্কে',
    services: 'সেবাসমূহ',
    subscriptions: 'সাবস্ক্রিপশন',
    customService: 'কাস্টম সার্ভিস',
    contactUs: 'যোগাযোগ',
    portalLogin: 'পোর্টাল লগইন',
    exploreServices: 'সেবাসমূহ অন্বেষণ করুন',
    startProject: 'আপনার প্রজেক্ট শুরু করুন',
    trustedByClients: 'শীর্ষস্থানীয় এন্টারপ্রাইজ এবং ব্যবসায়িক প্রতিষ্ঠান দ্বারা বিশ্বস্ত',
    corePillars: 'কোর প্রযুক্তি স্তম্ভ',
    productionUptime: 'সার্ভিস আপটাইম',
    specializedServices: 'বিশেষায়িত সেবা',
    subscribeNow: 'সাবস্ক্রাইব করুন',
    viewPlans: 'সকল সাবস্ক্রিপশন প্ল্যান দেখুন',
    billedMonthly: '/মাসিক',
    billedQuarterly: '/ত্রৈমাসিক',
    billedAnnually: '/বার্ষিক',
    orderConfirmationTitle: 'অর্ডার নিশ্চিতকরণ ও ভেরিফিকেশন',
    invoiceSummary: 'ট্যাক্স ইনভয়েস বিবরণী',
    payWithSSL: 'এসএসএলকমার্স গেটওয়ে দিয়ে পেমেন্ট',
    payWithBkash: 'বিকাশ মার্চেন্ট দিয়ে পেমেন্ট',
    payWithNagad: 'নগদ মার্চেন্ট দিয়ে পেমেন্ট',
    bankTransfer: 'ব্যাংক ওয়্যার ট্রান্সফার',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত। ফিউচারেন্ট টেকনোলজি।',
    darkFuturisticTheme: 'সাইবার ডার্ক (২০২৬)',
    neonMatrixTheme: 'নিওন ম্যাট্রিক্স',
    cleanMinimalTheme: 'ক্লিন মিনিমালিস্ট',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('ft_language') as LanguageCode) || 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('ft_language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
