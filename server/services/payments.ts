import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret",
});

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const createRazorpayOrder = async (amount: number) => {
  try {
    const options = {
      amount: amount, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        company: "Electricals Madurai",
      },
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create payment order");
  }
};

export const verifyPayment = (verification: PaymentVerification): boolean => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verification;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret")
      .update(body.toString())
      .digest("hex");

    return expectedSignature === razorpay_signature;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return false;
  }
};

export const capturePayment = async (paymentId: string, amount: number) => {
  try {
    const payment = await razorpay.payments.capture(paymentId, amount);
    return payment;
  } catch (error) {
    console.error("Error capturing payment:", error);
    throw new Error("Failed to capture payment");
  }
};

export const refundPayment = async (paymentId: string, amount?: number) => {
  try {
    const refundOptions: any = { payment_id: paymentId };
    if (amount) {
      refundOptions.amount = amount;
    }

    const refund = await razorpay.payments.refund(paymentId, refundOptions);
    return refund;
  } catch (error) {
    console.error("Error processing refund:", error);
    throw new Error("Failed to process refund");
  }
};

export const getPaymentDetails = async (paymentId: string) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw new Error("Failed to fetch payment details");
  }
};

// UPI Payment specific functions
export const createUPIPayment = async (amount: number, upiId?: string) => {
  try {
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `upi_receipt_${Date.now()}`,
      method: {
        upi: {
          flow: "collect",
          vpa: upiId || "customer@upi",
        },
      },
      notes: {
        company: "Electricals Madurai",
        payment_type: "UPI",
      },
    };

    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error("Error creating UPI payment:", error);
    throw new Error("Failed to create UPI payment");
  }
};

// Webhook verification for automatic status updates
export const verifyWebhookSignature = (webhookBody: string, signature: string): boolean => {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "webhook_secret")
      .update(webhookBody)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
};

// Payment analytics
export const getPaymentAnalytics = async (from: string, to: string) => {
  try {
    const payments = await razorpay.payments.all({
      from: Math.floor(new Date(from).getTime() / 1000),
      to: Math.floor(new Date(to).getTime() / 1000),
    });

    const analytics = {
      totalPayments: payments.items.length,
      totalAmount: payments.items.reduce((sum: number, payment: any) => sum + payment.amount, 0),
      successfulPayments: payments.items.filter((p: any) => p.status === "captured").length,
      failedPayments: payments.items.filter((p: any) => p.status === "failed").length,
      refunds: payments.items.filter((p: any) => p.refund_status === "partial" || p.refund_status === "full").length,
    };

    return analytics;
  } catch (error) {
    console.error("Error fetching payment analytics:", error);
    throw new Error("Failed to fetch payment analytics");
  }
};
