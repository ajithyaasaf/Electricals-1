import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.products"), href: "/products" },
    { name: t("nav.services"), href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Track Order", href: "/track" },
  ];

  const categories = [
    "Switches & Outlets",
    "Wires & Cables", 
    "Professional Tools",
    "Lighting Solutions",
    "Circuit Breakers",
    "Fans & Motors",
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-electric-500 to-safety-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">⚡</span>
              </div>
              <span className="ml-3 text-2xl font-bold">Electricals</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for premium electrical tools and professional services in Madurai. Quality products, expert installation, guaranteed satisfaction.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-electric-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-sm">f</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-electric-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-sm">ig</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-electric-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-sm">yt</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-electric-600 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-sm">wa</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-300 hover:text-electric-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Product Categories</h4>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category}>
                  <Link href="/products" className="text-gray-300 hover:text-electric-400 transition-colors">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Information</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-electric-400 mt-1">📍</span>
                <p className="text-gray-300">
                  123 Anna Salai, Madurai<br />
                  Tamil Nadu - 625001
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-electric-400">📞</span>
                <p className="text-gray-300">+91 98765 43210</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-electric-400">✉️</span>
                <p className="text-gray-300">info@electricals.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-electric-400">🕒</span>
                <p className="text-gray-300">
                  Mon-Sat: 9AM-8PM<br />
                  Emergency: 24/7
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Electricals. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-electric-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-electric-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/refund" className="text-gray-400 hover:text-electric-400 text-sm transition-colors">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
