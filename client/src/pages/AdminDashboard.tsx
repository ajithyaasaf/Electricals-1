import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Plus, Package, ShoppingCart, Calendar, Users, TrendingUp, AlertTriangle, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Product, Order, ServiceBooking } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { userDoc } = useAuth();
  const { toast } = useToast();
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    enabled: userDoc?.role === "admin",
  });

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["/api/admin/orders"],
    enabled: userDoc?.role === "admin",
  });

  const { data: bookings } = useQuery<ServiceBooking[]>({
    queryKey: ["/api/admin/bookings"],
    enabled: userDoc?.role === "admin",
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
    enabled: userDoc?.role === "admin",
  });

  if (userDoc?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">You don't have permission to access the admin dashboard</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const salesData = [
    { month: "Jan", sales: 65000 },
    { month: "Feb", sales: 78000 },
    { month: "Mar", sales: 92000 },
    { month: "Apr", sales: 85000 },
    { month: "May", sales: 105000 },
    { month: "Jun", sales: 118000 },
  ];

  const categoryData = [
    { name: "Switches", value: 35, color: "#2563eb" },
    { name: "Tools", value: 25, color: "#ea580c" },
    { name: "Wires", value: 20, color: "#16a34a" },
    { name: "Lighting", value: 20, color: "#ca8a04" },
  ];

  const recentOrders = orders?.slice(0, 5) || [];
  const recentBookings = bookings?.slice(0, 5) || [];
  const lowStockProducts = products?.filter(p => p.stock < 10) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your electrical tools business</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900">{products?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-electric-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-electric-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{orders?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-safety-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-safety-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Service Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{bookings?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹2.4L</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Sales"]} />
                  <Bar dataKey="sales" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bookings">Service Bookings</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          {/* Products Management */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Product Management</CardTitle>
                <Button onClick={() => setIsAddingProduct(true)} className="bg-electric-600 hover:bg-electric-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products?.slice(0, 10).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.category}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                              Stock: {product.stock}
                            </Badge>
                            <span className="text-sm font-medium">₹{product.price}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Order #{order.id.slice(-8)}</h4>
                        <p className="text-sm text-gray-600">{order.shippingAddress.name}</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(order.createdAt), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">₹{order.total.toLocaleString()}</div>
                        <Badge className={order.status === "delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                          {order.status}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Bookings */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Service Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{booking.name}</h4>
                        <p className="text-sm text-gray-600">{booking.serviceType} service</p>
                        <p className="text-sm text-gray-600">{booking.date} at {booking.timeSlot}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={booking.status === "completed" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                          {booking.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">{booking.phone}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts */}
          <TabsContent value="alerts">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Low Stock Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-600">Only {product.stock} left</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Restock
                        </Button>
                      </div>
                    ))}
                    {lowStockProducts.length === 0 && (
                      <p className="text-gray-600">All products are adequately stocked</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
