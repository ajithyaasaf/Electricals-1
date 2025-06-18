import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProductSchema, insertOrderSchema, insertServiceBookingSchema } from "@shared/schema";
import { sendBookingConfirmation } from "./services/email";
import { 
  processUPIPayment, 
  processCardPayment, 
  processCODPayment, 
  getPaymentStatus,
  generateUPILink 
} from "./services/payments";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const { search, category, sort, featured } = req.query;
      const products = await storage.getProducts({
        search: search as string,
        category: category as string,
        sort: sort as string,
        featured: featured === "true",
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  // Orders endpoints
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid order data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/user", async (req, res) => {
    try {
      // In a real app, you'd get the user ID from authentication
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  // Service bookings endpoints
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertServiceBookingSchema.parse(req.body);
      const booking = await storage.createServiceBooking(bookingData);
      
      // Send confirmation email/SMS
      try {
        await sendBookingConfirmation(booking);
      } catch (emailError) {
        console.error("Failed to send booking confirmation:", emailError);
      }
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid booking data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/user", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user bookings" });
    }
  });

  // Payment endpoints
  app.post("/api/payments/upi", async (req, res) => {
    try {
      const { amount, upiId, customerName, customerEmail, description } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      if (!upiId || !customerName || !customerEmail) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      const payment = await processUPIPayment({
        amount,
        upiId,
        customerName,
        customerEmail,
        description: description || "Payment for Electricals Madurai",
      });
      
      const paymentUrl = generateUPILink(upiId, amount, description || "Payment", payment.id);
      
      res.json({
        id: payment.id,
        status: payment.status,
        paymentUrl,
        message: "UPI payment initiated. Please complete payment using your UPI app.",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process UPI payment" });
    }
  });

  app.post("/api/payments/card", async (req, res) => {
    try {
      const { 
        amount, 
        cardNumber, 
        expiryMonth, 
        expiryYear, 
        cvv, 
        cardHolderName, 
        customerEmail, 
        description 
      } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      if (!cardNumber || !expiryMonth || !expiryYear || !cvv || !cardHolderName || !customerEmail) {
        return res.status(400).json({ error: "Missing required card details" });
      }
      
      const payment = await processCardPayment({
        amount,
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        cardHolderName,
        customerEmail,
        description: description || "Payment for Electricals Madurai",
      });
      
      res.json({
        id: payment.id,
        status: payment.status,
        message: "Card payment processing. Please wait for confirmation.",
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to process card payment" });
      }
    }
  });

  app.post("/api/payments/cod", async (req, res) => {
    try {
      const { amount, customerName, customerEmail, customerPhone, address, description } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      
      if (!customerName || !customerEmail || !customerPhone || !address) {
        return res.status(400).json({ error: "Missing required customer details" });
      }
      
      const payment = await processCODPayment({
        amount,
        customerName,
        customerEmail,
        customerPhone,
        address,
        description: description || "Cash on Delivery - Electricals Madurai",
      });
      
      res.json({
        id: payment.id,
        status: payment.status,
        message: "Cash on Delivery order confirmed. Payment will be collected upon delivery.",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to process COD payment" });
    }
  });

  app.get("/api/payments/status/:paymentId", async (req, res) => {
    try {
      const { paymentId } = req.params;
      const payment = await getPaymentStatus(paymentId);
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      res.json({
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        method: payment.method,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment status" });
    }
  });

  // Admin endpoints
  app.get("/api/admin/products", async (req, res) => {
    try {
      // In a real app, verify admin authentication here
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin products" });
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid product data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin orders" });
    }
  });

  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin bookings" });
    }
  });

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
