import { ServiceBookingForm } from "@/components/ServiceBookingForm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Zap, Wrench, Shield, Clock, Award, CheckCircle } from "lucide-react";

export default function Services() {
  const { t } = useLanguage();

  const services = [
    {
      id: "electrical",
      title: "Electrical Services",
      description: "Complete electrical solutions including wiring, installation, repair, and maintenance for homes and offices.",
      icon: Zap,
      color: "electric",
      price: "Starting ₹499",
      badge: "Available 24/7",
      features: [
        "Home wiring & rewiring",
        "Switch & outlet installation", 
        "Electrical troubleshooting",
        "Safety inspections",
        "Panel upgrades",
        "Emergency repairs",
      ],
    },
    {
      id: "plumbing",
      title: "Plumbing Services",
      description: "Professional plumbing solutions for all your water and drainage needs with guaranteed quality work.",
      icon: Wrench,
      color: "safety",
      price: "Starting ₹399",
      badge: "Licensed professionals",
      features: [
        "Pipe installation & repair",
        "Drain cleaning & unclogging",
        "Bathroom & kitchen fittings",
        "Water heater services",
        "Leak detection & repair",
        "Fixture installation",
      ],
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Certified Technicians",
      description: "All our service professionals are licensed, insured, and background verified for your safety.",
      color: "text-electric-600",
      bg: "bg-electric-100",
    },
    {
      icon: Clock,
      title: "Same Day Service",
      description: "Emergency services available with same-day response for urgent electrical and plumbing issues.",
      color: "text-safety-600",
      bg: "bg-safety-100",
    },
    {
      icon: Award,
      title: "Quality Guarantee",
      description: "30-day warranty on all services with satisfaction guarantee or your money back.",
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-electric-600 to-safety-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Professional <span className="text-safety-200">Services</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {services.map((service) => (
              <Card key={service.id} className={`bg-gradient-to-r from-${service.color}-50 to-${service.color === 'electric' ? 'safety' : 'copper'}-50 border-${service.color}-100`}>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 bg-${service.color}-600 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <service.icon className="text-white w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                      <p className="text-gray-600 mb-6">{service.description}</p>
                      
                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center justify-between">
                        <span className={`text-2xl font-bold text-${service.color}-600`}>{service.price}</span>
                        <Badge className={`${service.color === 'electric' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {service.badge}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Booking Form */}
          <div className="max-w-4xl mx-auto">
            <ServiceBookingForm />
          </div>
        </div>
      </section>

      {/* Service Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Services?</h2>
            <p className="text-xl text-gray-600">Professional, reliable, and guaranteed quality work</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 ${benefit.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <benefit.icon className={`${benefit.color} w-10 h-10`} />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Emergency Services Available 24/7</h2>
          <p className="text-xl text-gray-300 mb-8">
            For urgent electrical or plumbing emergencies, call our hotline
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="tel:+919876543210" className="text-2xl font-bold text-safety-400 hover:text-safety-300 transition-colors">
              📞 +91 98765 43210
            </a>
            <span className="text-gray-400">or</span>
            <a href="https://wa.me/919876543210" className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
