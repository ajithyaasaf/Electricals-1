import { Product, Order, ServiceBooking, InsertProduct, InsertOrder, InsertServiceBooking } from "@shared/schema";

export interface ProductFilters {
  search?: string;
  category?: string;
  sort?: string;
  featured?: boolean;
}

export interface IStorage {
  // Products
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  getAllProducts(): Promise<Product[]>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getUserOrders(userId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined>;

  // Service Bookings
  createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking>;
  getServiceBooking(id: string): Promise<ServiceBooking | undefined>;
  getUserBookings(userId: string): Promise<ServiceBooking[]>;
  getAllBookings(): Promise<ServiceBooking[]>;
  updateBookingStatus(id: string, status: ServiceBooking["status"]): Promise<ServiceBooking | undefined>;

  // Analytics
  getAnalytics(): Promise<any>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private bookings: Map<string, ServiceBooking> = new Map();
  private currentId = 1;

  constructor() {
    this.seedData();
  }

  private generateId(): string {
    return `${Date.now()}-${this.currentId++}`;
  }

  private seedData() {
    // Seed sample products
    const sampleProducts: Product[] = [
      {
        id: this.generateId(),
        name: "Digital Multimeter Pro",
        description: "Professional-grade digital multimeter with auto-ranging, data logging, and PC connectivity. Essential tool for electrical testing and troubleshooting.",
        price: 2499,
        category: "tools",
        images: ["https://images.unsplash.com/photo-1581092062292-b9aef1b8c14f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 25,
        rating: 4.8,
        brand: "Fluke",
        specs: {
          accuracy: "±0.025%",
          display: "6000 count LCD",
          voltage: "1000V AC/DC",
          current: "10A AC/DC",
          resistance: "60MΩ",
          frequency: "60kHz",
        },
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.generateId(),
        name: "Wire Stripping Pliers",
        description: "Heavy-duty wire strippers with comfort grip handles. Precision jaws for clean cuts and perfect strips every time.",
        price: 899,
        category: "tools",
        images: ["https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 50,
        rating: 4.6,
        brand: "Klein Tools",
        specs: {
          wireRange: "10-22 AWG",
          length: "8 inches",
          material: "High carbon steel",
          grip: "Cushioned handles",
        },
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.generateId(),
        name: "Premium Switch Set",
        description: "Modular switch set with premium finish and safety features. Complete with matching wall plates.",
        price: 1299,
        category: "switches",
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 30,
        rating: 4.9,
        brand: "Legrand",
        specs: {
          voltage: "240V AC",
          current: "16A",
          material: "Fire-retardant PC",
          finish: "Matt white",
          warranty: "10 years",
        },
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.generateId(),
        name: "MCB Circuit Breaker",
        description: "32A miniature circuit breaker with C-curve characteristics. Reliable protection for electrical circuits.",
        price: 450,
        category: "breakers",
        images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 100,
        rating: 4.7,
        brand: "Schneider Electric",
        specs: {
          rating: "32A",
          poles: "Single pole",
          curve: "C-curve",
          breakingCapacity: "6kA",
          standard: "IS 8828",
        },
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.generateId(),
        name: "LED Panel Light 18W",
        description: "Energy-efficient LED panel light with uniform illumination. Perfect for offices and homes.",
        price: 750,
        category: "lighting",
        images: ["https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 75,
        rating: 4.5,
        brand: "Philips",
        specs: {
          power: "18W",
          lumens: "1800lm",
          colorTemp: "4000K",
          size: "300x300mm",
          lifespan: "25000 hours",
        },
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: this.generateId(),
        name: "Electrical Wire 2.5mm²",
        description: "High-quality copper electrical wire for house wiring. ISI marked and BIS certified.",
        price: 180,
        category: "wires",
        images: ["https://images.unsplash.com/photo-1509087859087-a384654eca4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"],
        stock: 200,
        rating: 4.4,
        brand: "Havells",
        specs: {
          crossSection: "2.5mm²",
          material: "Copper",
          insulation: "PVC",
          voltage: "1100V",
          length: "90 meters",
        },
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  // Product methods
  async getProducts(filters: ProductFilters = {}): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.brand.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }

    if (filters.featured) {
      products = products.filter(p => p.featured);
    }

    // Sort products
    switch (filters.sort) {
      case "price-low":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        products.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
        products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        products.sort((a, b) => a.name.localeCompare(b.name));
    }

    return products;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.featured);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const product: Product = {
      id: this.generateId(),
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updates, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  // Order methods
  async createOrder(orderData: InsertOrder): Promise<Order> {
    const order: Order = {
      id: this.generateId(),
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateOrderStatus(id: string, status: Order["status"]): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status, updatedAt: new Date() };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Service booking methods
  async createServiceBooking(bookingData: InsertServiceBooking): Promise<ServiceBooking> {
    const booking: ServiceBooking = {
      id: this.generateId(),
      ...bookingData,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async getServiceBooking(id: string): Promise<ServiceBooking | undefined> {
    return this.bookings.get(id);
  }

  async getUserBookings(userId: string): Promise<ServiceBooking[]> {
    return Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllBookings(): Promise<ServiceBooking[]> {
    return Array.from(this.bookings.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateBookingStatus(id: string, status: ServiceBooking["status"]): Promise<ServiceBooking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updatedBooking = { ...booking, status, updatedAt: new Date() };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    const orders = Array.from(this.orders.values());
    const products = Array.from(this.products.values());
    const bookings = Array.from(this.bookings.values());

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const completedOrders = orders.filter(o => o.status === "delivered").length;
    const pendingBookings = bookings.filter(b => b.status === "pending").length;
    const lowStockProducts = products.filter(p => p.stock < 10).length;

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalBookings: bookings.length,
      totalRevenue,
      completedOrders,
      pendingBookings,
      lowStockProducts,
      monthlyRevenue: totalRevenue, // Simplified for demo
    };
  }
}

export const storage = new MemStorage();
