// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import { initializeApp as initClientApp, getApps as getClientApps } from "firebase/app";
import {
  getFirestore as getClientFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  limit
} from "firebase/firestore";
import { initializeApp as initAdminApp, getApps as getAdminApps, cert, applicationDefault } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "triple-silicon-0vxch",
  appId: process.env.FIREBASE_APP_ID || "",
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "triple-silicon-0vxch.firebaseapp.com",
  firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || "ai-studio-d63932a9-e00f-4b84-8637-7548e6f36ee0"
};
var configPath = path.resolve(__dirname, "firebase-applet-config.json");
if (fs.existsSync(configPath)) {
  try {
    const rawConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    firebaseConfig = { ...firebaseConfig, ...rawConfig };
  } catch (err) {
    console.warn("Could not parse firebase-applet-config.json:", err);
  }
}
var clientApp = getClientApps().length === 0 ? initClientApp(firebaseConfig) : getClientApps()[0];
var clientDb = getClientFirestore(clientApp, firebaseConfig.firestoreDatabaseId);
var adminApp = null;
var adminDb = null;
var adminInitialized = false;
try {
  const existingApps = getAdminApps();
  if (existingApps.length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const saRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim();
      const serviceAccount = saRaw.startsWith("{") ? JSON.parse(saRaw) : JSON.parse(fs.readFileSync(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_KEY), "utf8"));
      adminApp = initAdminApp({
        credential: cert(serviceAccount),
        projectId: firebaseConfig.projectId
      });
      adminInitialized = true;
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      adminApp = initAdminApp({
        credential: applicationDefault(),
        projectId: firebaseConfig.projectId
      });
      adminInitialized = true;
    } else {
      adminApp = initAdminApp({
        projectId: firebaseConfig.projectId
      });
      adminInitialized = true;
    }
  } else {
    adminApp = existingApps[0];
    adminInitialized = true;
  }
  if (adminApp) {
    adminDb = getAdminFirestore(adminApp);
  }
} catch (adminErr) {
  console.warn("Firebase Admin SDK initialized in restricted mode (verification active with fallback):", adminErr.message);
}
function cleanFirestoreData(obj) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== void 0) {
      if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = cleanFirestoreData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}
async function saveToFirestore(colName, docId, data) {
  const payload = cleanFirestoreData({
    ...data,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (adminDb && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      await adminDb.collection(colName).doc(docId).set(payload, { merge: true });
      return;
    } catch (adminWriteErr) {
      console.warn(`Admin write failed for ${colName}/${docId}, attempting clientDb:`, adminWriteErr.message);
    }
  }
  try {
    await setDoc(doc(clientDb, colName, docId), payload, { merge: true });
  } catch (clientWriteErr) {
    console.error(`CRITICAL: Database write failed for ${colName}/${docId}:`, clientWriteErr);
    throw new Error(`Database persistence failure for ${colName}/${docId}: ${clientWriteErr.message}`);
  }
}
async function getFromFirestore(colName, docId) {
  if (adminDb && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const snap = await adminDb.collection(colName).doc(docId).get();
      if (snap.exists) return snap.data() || null;
    } catch (e) {
    }
  }
  try {
    const snap = await getDoc(doc(clientDb, colName, docId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error(`Error reading ${colName}/${docId}:`, err);
    return null;
  }
}
async function updateInFirestore(colName, docId, updates) {
  const payload = cleanFirestoreData({
    ...updates,
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  if (adminDb && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      await adminDb.collection(colName).doc(docId).update(payload);
      return;
    } catch (e) {
    }
  }
  try {
    await updateDoc(doc(clientDb, colName, docId), payload);
  } catch (err) {
    console.error(`Error updating ${colName}/${docId}:`, err);
    throw new Error(`Database update failure for ${colName}/${docId}: ${err.message}`);
  }
}
async function findTransactionByReference(txnRef, txnId) {
  if (txnId) {
    const direct = await getFromFirestore("transactions", txnId);
    if (direct) return { id: txnId, ...direct };
  }
  if (adminDb && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const snap = await adminDb.collection("transactions").where("transactionReference", "==", txnRef).limit(1).get();
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (e) {
    }
  }
  try {
    const q = query(
      collection(clientDb, "transactions"),
      where("transactionReference", "==", txnRef),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docSnap = snap.docs[0];
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (e) {
    console.warn("Could not query transaction by reference:", e);
  }
  return null;
}
var rateLimitStore = /* @__PURE__ */ new Map();
function rateLimit(maxRequests = 40, windowMs = 6e4) {
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const now = Date.now();
    const entry = rateLimitStore.get(ip);
    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests. Please wait a moment before trying again.",
        retryAfterMs: entry.resetAt - now
      });
    }
    entry.count += 1;
    return next();
  };
}
var duplicateCache = /* @__PURE__ */ new Map();
function isDuplicateSubmission(key, windowMs = 15e3) {
  const now = Date.now();
  const lastTime = duplicateCache.get(key);
  if (lastTime && now - lastTime < windowMs) {
    return true;
  }
  duplicateCache.set(key, now);
  if (duplicateCache.size > 2e3) {
    for (const [k, v] of duplicateCache.entries()) {
      if (now - v > 6e4) duplicateCache.delete(k);
    }
  }
  return false;
}
var BOOTSTRAP_ADMIN_EMAIL = "mdshihabhossen.web@gmail.com";
async function verifyAdminAuth(req) {
  const authHeader = req.headers.authorization;
  const adminSecretHeader = req.headers["x-admin-secret"];
  if (process.env.ADMIN_API_SECRET && adminSecretHeader === process.env.ADMIN_API_SECRET) {
    return {
      uid: "server-authorized-admin",
      email: BOOTSTRAP_ADMIN_EMAIL,
      role: "super_admin"
    };
  }
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split("Bearer ")[1].trim();
    if (token) {
      try {
        if (adminInitialized && adminApp) {
          const decoded = await getAdminAuth(adminApp).verifyIdToken(token);
          const isSuperAdmin = decoded.email === BOOTSTRAP_ADMIN_EMAIL;
          let role = isSuperAdmin ? "super_admin" : "manager";
          try {
            const adminDoc = await getFromFirestore("admins", decoded.uid);
            if (adminDoc?.role) {
              role = adminDoc.role;
            }
          } catch (e) {
          }
          if (isSuperAdmin || role === "super_admin" || role === "admin" || role === "manager") {
            return {
              uid: decoded.uid,
              email: decoded.email || "",
              role
            };
          }
        }
      } catch (err) {
        console.warn("Firebase token verification error:", err.message);
      }
    }
  }
  return null;
}
async function requireAdminAuthMiddleware(req, res, next) {
  const verified = await verifyAdminAuth(req);
  if (!verified) {
    return res.status(401).json({
      error: "Unauthorized: Valid authenticated administrative session or token required."
    });
  }
  req.adminUser = verified;
  next();
}
var OFFICIAL_SUBSCRIPTION_PLANS = {
  "sub-starter": {
    name: "Growth Digital Retainer",
    monthlyPrice: 499,
    quarterlyPrice: 1350,
    halfYearlyPrice: 2550,
    annualPrice: 4800,
    currency: "USD"
  },
  "sub-partner": {
    name: "Enterprise Tech Partner",
    monthlyPrice: 1299,
    quarterlyPrice: 3500,
    halfYearlyPrice: 6600,
    annualPrice: 12500,
    currency: "USD"
  },
  "sub-scale": {
    name: "Bespoke Modernization Suite",
    monthlyPrice: 2899,
    quarterlyPrice: 7800,
    halfYearlyPrice: 14700,
    annualPrice: 28e3,
    currency: "USD"
  }
};
function getAuthoritativePlanPrice(planId, interval) {
  const plan = OFFICIAL_SUBSCRIPTION_PLANS[planId];
  if (!plan) {
    return { price: 499, currency: "USD", planName: "Custom Subscription" };
  }
  let price = plan.monthlyPrice;
  if (interval === "annual") price = plan.annualPrice;
  else if (interval === "half_yearly") price = plan.halfYearlyPrice;
  else if (interval === "quarterly") price = plan.quarterlyPrice;
  return { price, currency: plan.currency, planName: plan.name };
}
function generateOrderReference() {
  const randomNum = Math.floor(1e3 + Math.random() * 9e3);
  return `FT-2026-${randomNum}`;
}
function generateSubscriptionReference() {
  const randomNum = Math.floor(1e3 + Math.random() * 9e3);
  return `FT-SUB-2026-${randomNum}`;
}
function generateTransactionReference() {
  const randomNum = Math.floor(1e4 + Math.random() * 9e4);
  return `TXN-2026-${randomNum}`;
}
function generateInvoiceNumber() {
  const randomNum = Math.floor(1e3 + Math.random() * 9e3);
  return `INV-2026-${randomNum}`;
}
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
var HOST = "0.0.0.0";
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    system: "Futurent Technology Production Server",
    database: {
      projectId: firebaseConfig.projectId,
      databaseId: firebaseConfig.firestoreDatabaseId,
      connected: true
    },
    environment: process.env.NODE_ENV || "production",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/orders", rateLimit(25, 6e4), async (req, res) => {
  const {
    serviceId,
    serviceName,
    packageName,
    fullName,
    businessName,
    email,
    phone,
    whatsappNumber,
    projectTitle,
    requirements,
    budgetRange,
    expectedDeliveryDate,
    referenceUrls,
    preferredContactMethod,
    privacyConsent
  } = req.body;
  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return res.status(400).json({ error: "Valid full name (minimum 2 characters) is required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "Valid email address is required." });
  }
  if (!phone || typeof phone !== "string" || phone.trim().length < 5) {
    return res.status(400).json({ error: "Valid contact phone number is required." });
  }
  if (!requirements || typeof requirements !== "string" || requirements.trim().length < 15) {
    return res.status(400).json({ error: "Detailed project requirements must be at least 15 characters." });
  }
  if (!privacyConsent) {
    return res.status(400).json({ error: "Client privacy consent must be acknowledged." });
  }
  const dupKey = `order_${email.trim().toLowerCase()}_${requirements.trim().slice(0, 30)}`;
  if (isDuplicateSubmission(dupKey, 1e4)) {
    return res.status(409).json({ error: "A duplicate order submission was recently received. Please wait a moment." });
  }
  const orderReference = generateOrderReference();
  const id = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderRecord = {
    id,
    orderReference,
    serviceId: String(serviceId || "custom-solution").slice(0, 100),
    serviceName: String(serviceName || "Custom Service").slice(0, 150),
    packageName: packageName ? String(packageName).slice(0, 100) : void 0,
    fullName: fullName.trim().slice(0, 100),
    businessName: businessName ? String(businessName).trim().slice(0, 150) : void 0,
    email: email.trim().toLowerCase().slice(0, 255),
    phone: phone.trim().slice(0, 50),
    whatsappNumber: whatsappNumber ? String(whatsappNumber).trim().slice(0, 50) : void 0,
    projectTitle: projectTitle ? String(projectTitle).trim().slice(0, 200) : `${serviceName} Project`,
    requirements: requirements.trim().slice(0, 5e3),
    budgetRange: budgetRange ? String(budgetRange).slice(0, 100) : "$1,000 - $3,000",
    expectedDeliveryDate: expectedDeliveryDate ? String(expectedDeliveryDate).slice(0, 50) : void 0,
    referenceUrls: referenceUrls ? String(referenceUrls).slice(0, 1e3) : void 0,
    preferredContactMethod: preferredContactMethod || "whatsapp",
    privacyConsent: true,
    status: "new",
    // Server-enforced initial status
    paymentStatus: "pending",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    await saveToFirestore("orders", id, orderRecord);
    return res.status(201).json({
      success: true,
      message: "Order verified and securely saved to production database.",
      order: orderRecord
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to persist order to database. Please retry.",
      details: error.message
    });
  }
});
app.post("/api/custom-requests", rateLimit(25, 6e4), async (req, res) => {
  const {
    projectType,
    projectTitle,
    description,
    features,
    referenceUrls,
    budgetRange,
    expectedTimeline,
    fullName,
    businessName,
    email,
    phone,
    whatsappNumber,
    preferredContactMethod
  } = req.body;
  if (!projectTitle || typeof projectTitle !== "string" || projectTitle.trim().length < 3) {
    return res.status(400).json({ error: "Valid project title is required (minimum 3 characters)." });
  }
  if (!description || typeof description !== "string" || description.trim().length < 20) {
    return res.status(400).json({ error: "Detailed project description must be at least 20 characters." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!fullName || !email || !phone || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "Full name, valid email, and contact phone are mandatory." });
  }
  const dupKey = `req_${email.trim().toLowerCase()}_${projectTitle.trim()}`;
  if (isDuplicateSubmission(dupKey, 1e4)) {
    return res.status(409).json({ error: "Duplicate request detected within short timeframe." });
  }
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const customRequestRecord = {
    id,
    projectType: String(projectType || "Website").slice(0, 100),
    projectTitle: projectTitle.trim().slice(0, 200),
    description: description.trim().slice(0, 5e3),
    features: Array.isArray(features) ? features.slice(0, 20) : [],
    referenceUrls: referenceUrls ? String(referenceUrls).slice(0, 1e3) : void 0,
    budgetRange: String(budgetRange || "$3,000 - $5,000").slice(0, 100),
    expectedTimeline: String(expectedTimeline || "2-4 Weeks").slice(0, 100),
    fullName: fullName.trim().slice(0, 100),
    businessName: businessName ? String(businessName).trim().slice(0, 150) : void 0,
    email: email.trim().toLowerCase().slice(0, 255),
    phone: phone.trim().slice(0, 50),
    whatsappNumber: whatsappNumber ? String(whatsappNumber).trim().slice(0, 50) : void 0,
    preferredContactMethod: preferredContactMethod || "whatsapp",
    status: "pending",
    // Server-enforced
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    await saveToFirestore("customRequests", id, customRequestRecord);
    return res.status(201).json({
      success: true,
      message: "Custom request registered and persisted to database.",
      request: customRequestRecord
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to persist custom request to database.",
      details: error.message
    });
  }
});
app.post("/api/contact", rateLimit(20, 6e4), async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Valid name is required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    return res.status(400).json({ error: "Valid email address is required." });
  }
  if (!subject || subject.trim().length < 2) {
    return res.status(400).json({ error: "Subject is required." });
  }
  if (!message || message.trim().length < 10) {
    return res.status(400).json({ error: "Message must be at least 10 characters." });
  }
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const contactRecord = {
    id,
    name: name.trim().slice(0, 100),
    email: email.trim().toLowerCase().slice(0, 255),
    phone: phone ? String(phone).trim().slice(0, 50) : void 0,
    subject: subject.trim().slice(0, 200),
    message: message.trim().slice(0, 3e3),
    privacyConsent: true,
    isRead: false,
    status: "new",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    await saveToFirestore("contactMessages", id, contactRecord);
    return res.status(201).json({
      success: true,
      message: "Contact inquiry recorded in database.",
      id
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to persist contact message.",
      details: error.message
    });
  }
});
app.post("/api/subscriptions", rateLimit(25, 6e4), async (req, res) => {
  const {
    planId,
    billingInterval,
    customerName,
    customerEmail,
    customerPhone,
    gateway
  } = req.body;
  if (!planId) {
    return res.status(400).json({ error: "Plan identification is required." });
  }
  if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
    return res.status(400).json({ error: "Customer full name is required." });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!customerEmail || !emailRegex.test(customerEmail.trim())) {
    return res.status(400).json({ error: "Valid customer email is required." });
  }
  const interval = ["monthly", "quarterly", "half_yearly", "annual"].includes(billingInterval) ? billingInterval : "monthly";
  const { price, currency, planName } = getAuthoritativePlanPrice(String(planId), interval);
  const subscriptionReference = generateSubscriptionReference();
  const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = /* @__PURE__ */ new Date();
  const startDate = now.toISOString();
  const endDate = new Date(now);
  if (interval === "annual") endDate.setFullYear(endDate.getFullYear() + 1);
  else if (interval === "half_yearly") endDate.setMonth(endDate.getMonth() + 6);
  else if (interval === "quarterly") endDate.setMonth(endDate.getMonth() + 3);
  else endDate.setMonth(endDate.getMonth() + 1);
  const subscriptionRecord = {
    id,
    subscriptionReference,
    planId: String(planId).slice(0, 100),
    planName,
    customerName: customerName.trim().slice(0, 100),
    customerEmail: customerEmail.trim().toLowerCase().slice(0, 255),
    customerPhone: customerPhone ? String(customerPhone).trim().slice(0, 50) : "",
    billingInterval: interval,
    currentPrice: price,
    // Enforced
    currency,
    // Enforced
    status: "pending",
    // Server-enforced: remains pending until verified payment
    startDate,
    currentPeriodStart: startDate,
    currentPeriodEnd: endDate.toISOString(),
    nextBillingDate: endDate.toISOString(),
    autoRenew: true,
    gateway: gateway || "sslcommerz",
    createdAt: now.toISOString()
  };
  try {
    await saveToFirestore("subscriptions", id, subscriptionRecord);
    return res.status(201).json({
      success: true,
      message: "Subscription created and saved as pending payment.",
      subscription: subscriptionRecord
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to persist subscription to database.",
      details: error.message
    });
  }
});
app.post("/api/payments/checkout", rateLimit(30, 6e4), async (req, res) => {
  const {
    gatewayId,
    amount,
    currency,
    purpose,
    referenceId,
    customerName,
    customerEmail,
    customerPhone
  } = req.body;
  const validGateways = ["sslcommerz", "bkash", "nagad", "stripe", "manual_bank"];
  if (!gatewayId || !validGateways.includes(gatewayId)) {
    return res.status(400).json({ error: `Valid gateway identifier (${validGateways.join(", ")}) required.` });
  }
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: "Valid positive payment amount is required." });
  }
  const transactionReference = generateTransactionReference();
  const id = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const pendingTxnRecord = {
    id,
    transactionReference,
    customerName: customerName ? String(customerName).trim().slice(0, 100) : "Customer",
    customerEmail: customerEmail ? String(customerEmail).trim().toLowerCase().slice(0, 255) : "",
    paymentGateway: gatewayId,
    paymentMethod: gatewayId.toUpperCase(),
    transactionType: "payment",
    amount: numAmount,
    currency: String(currency || "BDT").toUpperCase().slice(0, 10),
    status: "pending",
    // Strictly pending!
    purpose: purpose || "order",
    referenceId: referenceId || void 0,
    createdTimestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  try {
    await saveToFirestore("transactions", id, pendingTxnRecord);
  } catch (err) {
    return res.status(500).json({
      error: "Failed to record pending transaction.",
      details: err.message
    });
  }
  const checkoutData = {
    transactionId: id,
    transactionReference,
    amount: numAmount,
    currency: pendingTxnRecord.currency,
    gateway: gatewayId,
    status: "pending",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (gatewayId === "sslcommerz") {
    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const isSandbox = process.env.SSLCOMMERZ_IS_SANDBOX !== "false";
    if (storeId) {
      checkoutData.gatewayStatus = "ready";
      checkoutData.baseUrl = isSandbox ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php" : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";
      checkoutData.storeId = storeId;
    } else {
      checkoutData.gatewayStatus = "credentials_required";
      checkoutData.message = "SSLCommerz credentials not configured in production .env. Transaction registered as pending.";
    }
  } else if (gatewayId === "bkash") {
    const bkashKey = process.env.BKASH_APP_KEY;
    if (bkashKey) {
      checkoutData.gatewayStatus = "ready";
      checkoutData.baseUrl = "https://tokenized.pay.bka.sh/v1.2.0-beta";
    } else {
      checkoutData.gatewayStatus = "credentials_required";
      checkoutData.message = "bKash Merchant credentials not configured in production .env. Transaction registered as pending.";
    }
  } else if (gatewayId === "stripe") {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey) {
      checkoutData.gatewayStatus = "ready";
      checkoutData.publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
    } else {
      checkoutData.gatewayStatus = "credentials_required";
      checkoutData.message = "Stripe API keys not configured in production .env. Transaction registered as pending.";
    }
  } else if (gatewayId === "manual_bank") {
    checkoutData.gatewayStatus = "manual_instructions";
    checkoutData.bankDetails = {
      bankName: "Official Corporate Bank Account",
      accountName: "Futurent Technology Ltd.",
      accountNumber: "Contact management for verified account wire details",
      instructions: "Deposit funds and provide deposit reference code for verification."
    };
  }
  return res.status(200).json({
    success: true,
    transactionId: id,
    transactionReference,
    checkout: checkoutData
  });
});
app.post("/api/payments/verify", rateLimit(30, 6e4), async (req, res) => {
  const {
    transactionId,
    transactionReference,
    gatewayId,
    gatewayReference,
    paidAmount,
    currency,
    relatedOrderId,
    relatedSubscriptionId,
    customerName,
    customerEmail
  } = req.body;
  if (!transactionReference && !transactionId) {
    return res.status(400).json({ error: "Transaction reference or transactionId is mandatory for verification." });
  }
  const existingTxn = await findTransactionByReference(transactionReference, transactionId);
  if (!existingTxn) {
    return res.status(404).json({
      error: `Transaction reference '${transactionReference}' not found in database records.`
    });
  }
  if (existingTxn.status === "successful") {
    return res.status(200).json({
      success: true,
      message: "Transaction already authenticated and finalized.",
      transaction: existingTxn
    });
  }
  let verificationSuccess = false;
  let verificationNotes = "";
  if (gatewayId === "manual_bank") {
    verificationSuccess = false;
    verificationNotes = "Manual bank wire references are registered as pending audit clearance by finance.";
  } else if (gatewayId === "sslcommerz") {
    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePass = process.env.SSLCOMMERZ_STORE_PASS;
    if (storeId && storePass && gatewayReference) {
      try {
        const isSandbox = process.env.SSLCOMMERZ_IS_SANDBOX !== "false";
        const valUrl = isSandbox ? `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(gatewayReference)}&store_id=${storeId}&store_passwd=${storePass}&format=json` : `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(gatewayReference)}&store_id=${storeId}&store_passwd=${storePass}&format=json`;
        const valRes = await fetch(valUrl);
        const valData = await valRes.json();
        if (valData.status === "VALID" || valData.status === "VALIDATED") {
          verificationSuccess = true;
          verificationNotes = `SSLCommerz validated. Bank Tran ID: ${valData.bank_tran_id || "N/A"}`;
        } else {
          verificationNotes = `SSLCommerz validation failed: ${valData.status}`;
        }
      } catch (err) {
        verificationNotes = `SSLCommerz validation error: ${err.message}`;
      }
    } else {
      verificationNotes = "SSLCommerz gateway credentials not configured in production environment.";
    }
  } else if (gatewayId === "stripe") {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && gatewayReference) {
      try {
        const stripeRes = await fetch(`https://api.stripe.com/v1/payment_intents/${encodeURIComponent(gatewayReference)}`, {
          headers: { Authorization: `Bearer ${stripeKey}` }
        });
        const intent = await stripeRes.json();
        if (intent.status === "succeeded") {
          verificationSuccess = true;
          verificationNotes = "Stripe PaymentIntent verified succeeded.";
        } else {
          verificationNotes = `Stripe status: ${intent.status}`;
        }
      } catch (err) {
        verificationNotes = `Stripe verification error: ${err.message}`;
      }
    } else {
      verificationNotes = "Stripe API keys not configured in production environment.";
    }
  } else {
    verificationNotes = "Gateway credentials not configured in production environment.";
  }
  if (!verificationSuccess) {
    return res.status(400).json({
      success: false,
      status: "pending",
      error: `Payment verification not confirmed: ${verificationNotes}`,
      transaction: existingTxn
    });
  }
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const updatedTxn = {
    ...existingTxn,
    status: "successful",
    gatewayReference: gatewayReference || existingTxn.gatewayReference,
    authorizedNotes: verificationNotes,
    paymentTimestamp: now,
    verifiedAt: now
  };
  try {
    await updateInFirestore("transactions", existingTxn.id, updatedTxn);
    if (relatedOrderId || existingTxn.relatedOrderId) {
      const orderId = relatedOrderId || existingTxn.relatedOrderId;
      await updateInFirestore("orders", orderId, {
        paymentStatus: "paid",
        status: "confirmed"
      });
    }
    if (relatedSubscriptionId || existingTxn.relatedSubscriptionId) {
      const subId = relatedSubscriptionId || existingTxn.relatedSubscriptionId;
      await updateInFirestore("subscriptions", subId, {
        status: "active"
      });
    }
    const invoiceId = `inv_${Date.now()}`;
    const invoiceRecord = {
      id: invoiceId,
      invoiceNumber: generateInvoiceNumber(),
      issueDate: now,
      title: `Invoice for ${existingTxn.purpose || "Service"}`,
      transactionId: existingTxn.id,
      transactionReference,
      customerName: customerName || existingTxn.customerName || "Valued Client",
      customerEmail: customerEmail || existingTxn.customerEmail || "",
      items: [
        {
          id: "item_1",
          name: `${existingTxn.purpose || "Service"} Settlement`,
          quantity: 1,
          unitPrice: existingTxn.amount,
          total: existingTxn.amount
        }
      ],
      subtotal: existingTxn.amount,
      discountTotal: 0,
      taxTotal: 0,
      grandTotal: existingTxn.amount,
      amountPaid: existingTxn.amount,
      balanceRemaining: 0,
      currency: existingTxn.currency || "USD",
      status: "paid",
      paymentMethod: gatewayId,
      createdAt: now
    };
    await saveToFirestore("invoices", invoiceId, invoiceRecord);
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully and authenticated in records.",
      transaction: updatedTxn,
      invoice: invoiceRecord
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to update transaction status in database.",
      details: err.message
    });
  }
});
app.post("/api/payments/manual-record", requireAdminAuthMiddleware, async (req, res) => {
  const {
    amount,
    currency,
    paymentMethod,
    relatedOrderId,
    relatedSubscriptionId,
    customerName,
    customerEmail,
    authorizedNotes
  } = req.body;
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ error: "Valid positive payment amount required." });
  }
  if (!customerName || typeof customerName !== "string" || customerName.trim().length < 2) {
    return res.status(400).json({ error: "Valid customer name is required." });
  }
  const adminUser = req.adminUser;
  const transactionReference = `TXN-MANUAL-2026-${Math.floor(1e4 + Math.random() * 9e4)}`;
  const id = `txn_${Date.now()}_man`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const manualTransaction = {
    id,
    transactionReference,
    relatedOrderId: relatedOrderId || void 0,
    relatedSubscriptionId: relatedSubscriptionId || void 0,
    customerName: customerName.trim(),
    customerEmail: customerEmail ? String(customerEmail).trim().toLowerCase() : "",
    paymentGateway: "manual_authorized",
    paymentMethod: paymentMethod || "Bank Wire / Cheque Clearance",
    transactionType: "manual_entry",
    amount: numAmount,
    currency: String(currency || "BDT").toUpperCase(),
    status: "successful",
    paymentTimestamp: now,
    createdTimestamp: now,
    authorizedNotes: authorizedNotes || "Authorized manual transaction recorded by administration.",
    isManualEntry: true,
    recordedByAdmin: adminUser.email
  };
  try {
    await saveToFirestore("transactions", id, manualTransaction);
    if (relatedOrderId) {
      await updateInFirestore("orders", relatedOrderId, {
        paymentStatus: "paid",
        status: "confirmed"
      });
    }
    if (relatedSubscriptionId) {
      await updateInFirestore("subscriptions", relatedSubscriptionId, {
        status: "active"
      });
    }
    const invoiceId = `inv_${Date.now()}_man`;
    const invoiceRecord = {
      id: invoiceId,
      invoiceNumber: generateInvoiceNumber(),
      issueDate: now,
      title: "Manual Receipt & Invoice",
      transactionId: id,
      transactionReference,
      customerName: customerName.trim(),
      customerEmail: customerEmail ? String(customerEmail).trim() : "",
      items: [
        {
          id: "item_1",
          name: paymentMethod || "Manual Payment Entry",
          quantity: 1,
          unitPrice: numAmount,
          total: numAmount
        }
      ],
      subtotal: numAmount,
      discountTotal: 0,
      taxTotal: 0,
      grandTotal: numAmount,
      amountPaid: numAmount,
      balanceRemaining: 0,
      currency: manualTransaction.currency,
      status: "paid",
      paymentMethod: manualTransaction.paymentMethod,
      createdAt: now
    };
    await saveToFirestore("invoices", invoiceId, invoiceRecord);
    const logId = `log_${Date.now()}`;
    await saveToFirestore("activityLogs", logId, {
      id: logId,
      adminEmail: adminUser.email,
      action: "RECORD_MANUAL_PAYMENT",
      target: `transactions/${transactionReference}`,
      details: `Recorded $${numAmount} ${manualTransaction.currency} for ${customerName.trim()}`,
      timestamp: now
    });
    return res.status(201).json({
      success: true,
      message: "Authorized manual transaction persisted with audit trail.",
      transaction: manualTransaction,
      invoice: invoiceRecord
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to persist manual payment record.",
      details: err.message
    });
  }
});
app.post("/api/payments/refund", requireAdminAuthMiddleware, async (req, res) => {
  const { transactionReference, refundAmount, reason } = req.body;
  if (!transactionReference) {
    return res.status(400).json({ error: "Transaction reference is required." });
  }
  const numRefund = Number(refundAmount);
  if (isNaN(numRefund) || numRefund <= 0) {
    return res.status(400).json({ error: "Valid refund amount is required." });
  }
  const existingTxn = await findTransactionByReference(transactionReference);
  if (!existingTxn) {
    return res.status(404).json({ error: `Transaction ${transactionReference} not found.` });
  }
  if (numRefund > existingTxn.amount) {
    return res.status(400).json({
      error: `Refund amount (${numRefund}) exceeds original transaction amount (${existingTxn.amount}).`
    });
  }
  const adminUser = req.adminUser;
  const refundReference = `REFUND-2026-${Math.floor(1e3 + Math.random() * 9e3)}`;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  try {
    await updateInFirestore("transactions", existingTxn.id, {
      status: "refunded",
      refundReference,
      refundAmount: numRefund,
      refundReason: reason || "Customer requested adjustment",
      refundAuthorizedBy: adminUser.email,
      refundedAt: now
    });
    const logId = `log_${Date.now()}_ref`;
    await saveToFirestore("activityLogs", logId, {
      id: logId,
      adminEmail: adminUser.email,
      action: "PROCESS_REFUND",
      target: `transactions/${transactionReference}`,
      details: `Authorized refund of $${numRefund} (${reason || "Standard refund"})`,
      timestamp: now
    });
    return res.status(200).json({
      success: true,
      message: "Refund successfully recorded and finalized.",
      refundReference,
      transactionReference,
      refundAmount: numRefund,
      authorizedBy: adminUser.email,
      timestamp: now
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to update transaction with refund status.",
      details: err.message
    });
  }
});
app.post("/api/payments/:gateway/webhook", async (req, res) => {
  const { gateway } = req.params;
  const payload = req.body;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  console.log(`[Webhook] Incoming callback from gateway: ${gateway}`);
  const txnRef = payload?.tran_id || payload?.transactionReference || payload?.data?.object?.metadata?.transactionReference;
  if (txnRef) {
    try {
      const existing = await findTransactionByReference(txnRef);
      if (existing) {
        if (existing.status === "successful") {
          return res.status(200).json({ received: true, idempotent: true, message: "Already processed" });
        }
        const isSuccess = payload?.status === "VALID" || payload?.type === "payment_intent.succeeded" || payload?.transactionStatus === "Completed";
        if (isSuccess) {
          await updateInFirestore("transactions", existing.id, {
            status: "successful",
            verifiedAt: now,
            webhookReceived: true
          });
          if (existing.relatedOrderId) {
            await updateInFirestore("orders", existing.relatedOrderId, { paymentStatus: "paid", status: "confirmed" });
          }
          if (existing.relatedSubscriptionId) {
            await updateInFirestore("subscriptions", existing.relatedSubscriptionId, { status: "active" });
          }
        }
      }
    } catch (e) {
      console.error("Error processing webhook transaction:", e);
    }
  }
  return res.status(200).json({
    received: true,
    gateway,
    timestamp: now
  });
});
app.all("/api/*", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found",
    path: req.path,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
var distPath = path.resolve(__dirname, "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send("Application build in progress or dist/index.html not found. Please run npm run build.");
  }
});
app.listen(PORT, HOST, () => {
  console.log(`Futurent Technology server listening on http://${HOST}:${PORT}`);
  console.log(`Production database: ${firebaseConfig.firestoreDatabaseId}`);
});
var server_default = app;
export {
  server_default as default,
  findTransactionByReference,
  getFromFirestore,
  saveToFirestore,
  updateInFirestore
};
