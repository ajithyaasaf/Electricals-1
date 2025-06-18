import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { ServiceBookingForm } from "@/components/ServiceBookingForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import { Product } from "@shared/schema";
import { Link } from "wouter";
import { Zap, Shield, Wrench, Headphones, Truck, Clock, Award } from "lucide-react";

export default function Home() {
  const { t } = useLanguage();

  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  const categories = [
    {
      id: "switches",
      name: "Switches & Outlets",
      description: "Premium quality switches and power outlets",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      count: "150+ Products",
      gradient: "from-electric-500 to-electric-600",
    },
    {
      id: "wires",
      name: "Wires & Cables",
      description: "High-grade electrical wiring solutions",
      image: "https://images.unsplash.com/photo-1509087859087-a384654eca4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      count: "200+ Products",
      gradient: "from-safety-500 to-safety-600",
    },
    {
      id: "tools",
      name: "Professional Tools",
      description: "Industry-grade electrical hand tools",
      image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      count: "180+ Products",
      gradient: "from-copper-600 to-copper-700",
    },
    {
      id: "lighting",
      name: "Lighting Solutions",
      description: "Energy-efficient LED and smart lighting",
      image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      count: "120+ Products",
      gradient: "from-yellow-500 to-yellow-600",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Free Delivery",
      description: "Orders above ₹500",
      color: "text-electric-600",
      bg: "bg-electric-100",
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Genuine products only",
      color: "text-safety-600",
      bg: "bg-safety-100",
    },
    {
      icon: Wrench,
      title: "Expert Service",
      description: "Professional installation",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Always here to help",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-electric-600 via-electric-700 to-copper-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Premium <span className="text-safety-400">Electrical Tools</span> & Expert Services
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-safety-500 hover:bg-safety-600 text-white px-8 py-4 text-lg">
                  <Link href="/products">
                    🛍️ {t("hero.shopProducts")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 border-white hover:bg-white hover:text-electric-700 text-white px-8 py-4 text-lg">
                  <Link href="/services">
                    🔧 {t("hero.bookService")}
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <Card className="bg-white shadow-2xl">
                <CardContent className="p-6">
                  <img
                    src="https://images.unsplash.com/photo-1581092662227-c3ed8c3f2022?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                    alt="Professional electrical tools"
                    className="rounded-xl w-full h-auto"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-gray-900 font-semibold">Professional Grade Tools</h3>
                      <p className="text-gray-600 text-sm">Trusted by 10,000+ electricians</p>
                    </div>
                    <div className="flex text-yellow-400">
                      {"★".repeat(5)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${feature.bg} rounded-lg flex items-center justify-center`}>
                  <feature.icon className={`${feature.color} w-6 h-6`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by <span className="text-electric-600">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("categories.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden">
                  <div className={`h-48 bg-gradient-to-br ${category.gradient} relative overflow-hidden`}>
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <span className="inline-flex items-center text-electric-600 font-medium">
                      {category.count} →
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Featured Products */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Featured Products</h3>
                <Button asChild variant="ghost" className="text-electric-600 hover:text-electric-700">
                  <Link href="/products">View All Products →</Link>
                </Button>
              </div>

              {isLoading ? (
                <ProductGridSkeleton count={4} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredProducts?.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional <span className="text-safety-600">Services</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Service Options */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-r from-electric-50 to-safety-50 border-electric-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-electric-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Zap className="text-white w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Electrical Services</h3>
                      <p className="text-gray-600 mb-4">Complete electrical solutions including wiring, installation, repair, and maintenance for homes and offices.</p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center">✅ Home wiring & rewiring</li>
                        <li className="flex items-center">✅ Switch & outlet installation</li>
                        <li className="flex items-center">✅ Electrical troubleshooting</li>
                        <li className="flex items-center">✅ Safety inspections</li>
                      </ul>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-electric-600">Starting ₹499</span>
                        <Badge className="bg-green-100 text-green-800">Available 24/7</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-safety-50 to-copper-50 border-safety-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-safety-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Wrench className="text-white w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Plumbing Services</h3>
                      <p className="text-gray-600 mb-4">Professional plumbing solutions for all your water and drainage needs with guaranteed quality work.</p>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center">✅ Pipe installation & repair</li>
                        <li className="flex items-center">✅ Drain cleaning & unclogging</li>
                        <li className="flex items-center">✅ Bathroom & kitchen fittings</li>
                        <li className="flex items-center">✅ Water heater services</li>
                      </ul>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-safety-600">Starting ₹399</span>
                        <Badge className="bg-blue-100 text-blue-800">Licensed professionals</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <ServiceBookingForm />
            </div>
          </div>

          {/* Service Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Certified Technicians",
                description: "All our service professionals are licensed, insured, and background verified for your safety.",
              },
              {
                icon: Clock,
                title: "Same Day Service",
                description: "Emergency services available with same-day response for urgent electrical and plumbing issues.",
              },
              {
                icon: Award,
                title: "Quality Guarantee",
                description: "30-day warranty on all services with satisfaction guarantee or your money back.",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-electric-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="text-electric-600 w-8 h-8" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
