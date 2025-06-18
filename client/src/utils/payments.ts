// Payment utilities for UPI, Card, and COD payments

export type PaymentMethod = "upi" | "card" | "cod";

export interface PaymentRequest {
  amount: number;
  method: PaymentMethod;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  orderDetails: {
    orderId: string;
    description: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
  };
}

export interface UPIPaymentData {
  upiId: string;
}

export interface CardPaymentData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolderName: string;
}

export interface PaymentResponse {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  paymentUrl?: string; // For UPI deep links
  qrCode?: string; // For UPI QR codes
  message?: string;
}

// Process UPI payment
export const processUPIPayment = async (
  request: PaymentRequest,
  upiData: UPIPaymentData
): Promise<PaymentResponse> => {
  const response = await fetch('/api/payments/upi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: request.amount,
      upiId: upiData.upiId,
      customerName: request.customerDetails.name,
      customerEmail: request.customerDetails.email,
      description: request.orderDetails.description,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to process UPI payment');
  }

  return response.json();
};

// Process card payment
export const processCardPayment = async (
  request: PaymentRequest,
  cardData: CardPaymentData
): Promise<PaymentResponse> => {
  const response = await fetch('/api/payments/card', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: request.amount,
      cardNumber: cardData.cardNumber,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv,
      cardHolderName: cardData.cardHolderName,
      customerEmail: request.customerDetails.email,
      description: request.orderDetails.description,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to process card payment');
  }

  return response.json();
};

// Process COD payment
export const processCODPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
  const response = await fetch('/api/payments/cod', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: request.amount,
      customerName: request.customerDetails.name,
      customerEmail: request.customerDetails.email,
      customerPhone: request.customerDetails.phone,
      address: request.customerDetails.address,
      description: request.orderDetails.description,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to process COD payment');
  }

  return response.json();
};

// Check payment status
export const checkPaymentStatus = async (paymentId: string): Promise<PaymentResponse> => {
  const response = await fetch(`/api/payments/status/${paymentId}`);
  
  if (!response.ok) {
    throw new Error('Failed to check payment status');
  }

  return response.json();
};

// Generate UPI payment link
export const generateUPIPaymentLink = (
  upiId: string,
  amount: number,
  description: string,
  transactionRef: string
): string => {
  const params = new URLSearchParams({
    pa: upiId, // Payee address
    pn: "Electricals Madurai", // Payee name
    tr: transactionRef, // Transaction reference
    tn: description, // Transaction note
    am: amount.toString(), // Amount
    cu: "INR", // Currency
  });
  
  return `upi://pay?${params.toString()}`;
};

// Validate card number using Luhn algorithm
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/[\s-]/g, "");
  
  if (!/^\d+$/.test(cleaned) || cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }
  
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

// Validate expiry date
export const validateExpiryDate = (month: string, year: string): boolean => {
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

// Detect card type from number
export const detectCardType = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/[\s-]/g, "");
  
  if (/^4/.test(cleaned)) return "Visa";
  if (/^5[1-5]/.test(cleaned)) return "Mastercard";
  if (/^3[47]/.test(cleaned)) return "American Express";
  if (/^6/.test(cleaned)) return "Discover";
  if (/^35(2[89]|[3-8][0-9])/.test(cleaned)) return "JCB";
  
  return "Unknown";
};