import { z } from "zod";

// Product schema
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  images: z.array(z.string()),
  stock: z.number(),
  rating: z.number().min(0).max(5),
  brand: z.string(),
  specs: z.record(z.string()),
  featured: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Order schema
export const orderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string(),
});

export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(orderItemSchema),
  subtotal: z.number(),
  tax: z.number(),
  shipping: z.number(),
  total: z.number(),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  paymentStatus: z.enum(["pending", "completed", "failed", "refunded"]),
  paymentMethod: z.enum(["card", "upi", "cod"]),
  shippingAddress: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertOrderSchema = orderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;

// Service booking schema
export const serviceBookingSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email().optional(),
  serviceType: z.enum(["electrical", "plumbing", "both"]),
  date: z.string(),
  timeSlot: z.enum(["9-12", "12-15", "15-18", "18-21"]),
  address: z.string(),
  notes: z.string().optional(),
  status: z.enum(["pending", "confirmed", "in-progress", "completed", "cancelled"]),
  technicianId: z.string().optional(),
  estimatedCost: z.number().optional(),
  actualCost: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const insertServiceBookingSchema = serviceBookingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ServiceBooking = z.infer<typeof serviceBookingSchema>;
export type InsertServiceBooking = z.infer<typeof insertServiceBookingSchema>;

// Cart item schema
export const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string(),
});

export type CartItem = z.infer<typeof cartItemSchema>;
