import crypto from "crypto";
import { nanoid } from "nanoid";

// Payment method types
export type PaymentMethod = "upi" | "card" | "cod";

export interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  createdAt: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface UPIPaymentRequest {
  amount: number;
  upiId: string;
  customerName: string;
  customerEmail: string;
  description: string;
}

export interface CardPaymentRequest {
  amount: number;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
  customerEmail: string;
  description: string;
}

export interface CODPaymentRequest {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  description: string;
}

// In-memory payment storage for demo purposes
const payments = new Map<string, PaymentDetails>();

// Generate payment reference
const generatePaymentId = (): string => {
  return `pay_${nanoid(12)}`;
};

// UPI Payment Processing
export const processUPIPayment = async (request: UPIPaymentRequest): Promise<PaymentDetails> => {
  const paymentId = generatePaymentId();
  
  // Simulate UPI payment processing
  const payment: PaymentDetails = {
    id: paymentId,
    orderId: `order_${nanoid(8)}`,
    amount: request.amount,
    currency: "INR",
    method: "upi",
    status: "processing",
    createdAt: new Date(),
    metadata: {
      upiId: request.upiId,
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      description: request.description,
    },
  };

  payments.set(paymentId, payment);

  // Simulate processing delay and success (90% success rate)
  setTimeout(() => {
    const updatedPayment = payments.get(paymentId);
    if (updatedPayment) {
      updatedPayment.status = Math.random() > 0.1 ? "completed" : "failed";
      updatedPayment.completedAt = new Date();
      payments.set(paymentId, updatedPayment);
    }
  }, 2000 + Math.random() * 3000); // 2-5 seconds processing time

  return payment;
};

// Card Payment Processing
export const processCardPayment = async (request: CardPaymentRequest): Promise<PaymentDetails> => {
  const paymentId = generatePaymentId();
  
  // Basic card validation
  if (!isValidCardNumber(request.cardNumber)) {
    throw new Error("Invalid card number");
  }
  
  if (!isValidExpiryDate(request.expiryMonth, request.expiryYear)) {
    throw new Error("Invalid expiry date");
  }

  const payment: PaymentDetails = {
    id: paymentId,
    orderId: `order_${nanoid(8)}`,
    amount: request.amount,
    currency: "INR",
    method: "card",
    status: "processing",
    createdAt: new Date(),
    metadata: {
      cardLast4: request.cardNumber.slice(-4),
      cardHolderName: request.cardHolderName,
      customerEmail: request.customerEmail,
      description: request.description,
    },
  };

  payments.set(paymentId, payment);

  // Simulate card processing delay and success (95% success rate)
  setTimeout(() => {
    const updatedPayment = payments.get(paymentId);
    if (updatedPayment) {
      updatedPayment.status = Math.random() > 0.05 ? "completed" : "failed";
      updatedPayment.completedAt = new Date();
      payments.set(paymentId, updatedPayment);
    }
  }, 1000 + Math.random() * 2000); // 1-3 seconds processing time

  return payment;
};

// Cash on Delivery Processing
export const processCODPayment = async (request: CODPaymentRequest): Promise<PaymentDetails> => {
  const paymentId = generatePaymentId();
  
  const payment: PaymentDetails = {
    id: paymentId,
    orderId: `order_${nanoid(8)}`,
    amount: request.amount,
    currency: "INR",
    method: "cod",
    status: "pending", // COD is pending until delivery
    createdAt: new Date(),
    metadata: {
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      customerPhone: request.customerPhone,
      address: request.address,
      description: request.description,
    },
  };

  payments.set(paymentId, payment);
  return payment;
};

// Get payment status
export const getPaymentStatus = async (paymentId: string): Promise<PaymentDetails | null> => {
  return payments.get(paymentId) || null;
};

// Update COD payment status (for delivery confirmation)
export const updateCODPaymentStatus = async (paymentId: string, status: "completed" | "failed"): Promise<PaymentDetails | null> => {
  const payment = payments.get(paymentId);
  if (payment && payment.method === "cod") {
    payment.status = status;
    payment.completedAt = new Date();
    payments.set(paymentId, payment);
    return payment;
  }
  return null;
};

// Utility functions for card validation
const isValidCardNumber = (cardNumber: string): boolean => {
  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, "");
  
  // Check if it's all digits and has appropriate length
  if (!/^\d+$/.test(cleaned) || cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
  // Luhn algorithm check
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

const isValidExpiryDate = (month: string, year: string): boolean => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  if (expMonth < 1 || expMonth > 12) {
    return false;
  }
  
  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false;
  }
  
  return true;
};

// Generate UPI payment link (for QR code or deep linking)
export const generateUPILink = (upiId: string, amount: number, description: string): string => {
  const params = new URLSearchParams({
    pa: upiId, // Payee address
    pn: "Electricals Madurai", // Payee name
    tr: `TXN${nanoid(8)}`, // Transaction reference
    tn: description, // Transaction note
    am: amount.toString(), // Amount
    cu: "INR", // Currency
  });
  
  return `upi://pay?${params.toString()}`;
};

// Payment analytics
export const getPaymentAnalytics = async (from: string, to: string) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  
  const filteredPayments = Array.from(payments.values()).filter(
    payment => payment.createdAt >= fromDate && payment.createdAt <= toDate
  );
  
  const analytics = {
    totalPayments: filteredPayments.length,
    totalAmount: filteredPayments.reduce((sum, payment) => sum + payment.amount, 0),
    successfulPayments: filteredPayments.filter(p => p.status === "completed").length,
    failedPayments: filteredPayments.filter(p => p.status === "failed").length,
    pendingPayments: filteredPayments.filter(p => p.status === "pending" || p.status === "processing").length,
    paymentsByMethod: {
      upi: filteredPayments.filter(p => p.method === "upi").length,
      card: filteredPayments.filter(p => p.method === "card").length,
      cod: filteredPayments.filter(p => p.method === "cod").length,
    },
    averageAmount: filteredPayments.length > 0 ? filteredPayments.reduce((sum, payment) => sum + payment.amount, 0) / filteredPayments.length : 0,
  };
  
  return analytics;
};
