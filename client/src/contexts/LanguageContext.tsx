import { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Simple translations object
const translations = {
  en: {
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.contact": "Contact",
    "hero.title": "Premium Electrical Tools & Expert Services",
    "hero.subtitle": "Your trusted partner in Madurai for high-quality electrical equipment and professional installation services. 1000+ products in stock.",
    "hero.shopProducts": "Shop Products",
    "hero.bookService": "Book Service",
    "categories.title": "Shop by Category",
    "categories.subtitle": "Discover our comprehensive range of electrical tools and equipment for professionals and DIY enthusiasts",
    "services.title": "Professional Services",
    "services.subtitle": "Expert electrical and plumbing services by certified technicians. Book online and get instant confirmation.",
    "cart.title": "Shopping Cart",
    "cart.checkout": "Proceed to Checkout",
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.welcome": "Welcome Back",
    "common.loading": "Loading...",
    "common.addToCart": "Add to Cart",
    "common.bookNow": "Book Now",
  },
  ta: {
    "nav.home": "முகப்பு",
    "nav.products": "தயாரிப்புகள்",
    "nav.services": "சேவைகள்",
    "nav.about": "எங்களைப் பற்றி",
    "nav.contact": "தொடர்பு",
    "hero.title": "உயர்தர மின்சாரக் கருவிகள் & நிபுணர் சேவைகள்",
    "hero.subtitle": "மதுரையில் உயர்தர மின்சாரக் கருவிகள் மற்றும் தொழில்முறை நிறுவல் சேவைகளுக்கான உங்கள் நம்பகமான பங்குதாரர். 1000+ தயாரிப்புகள் கையிருப்பில்.",
    "hero.shopProducts": "தயாரிப்புகளை வாங்கவும்",
    "hero.bookService": "சேவையை முன்பதிவு செய்யவும்",
    "categories.title": "வகையால் வாங்கவும்",
    "categories.subtitle": "தொழில்முறை மற்றும் DIY ஆர்வலர்களுக்கான எங்கள் விரிவான மின்சாரக் கருவிகள் மற்றும் உபகரணங்களை கண்டறியுங்கள்",
    "services.title": "தொழில்முறை சேவைகள்",
    "services.subtitle": "சான்றளிக்கப்பட்ட தொழில்நுட்பவியலாளர்களால் நிபுணர் மின்சாரம் மற்றும் குழாய் சேவைகள். ஆன்லைனில் முன்பதிவு செய்து உடனடி உறுதிப்படுத்தல் பெறுங்கள்.",
    "cart.title": "வாங்கல் கூடை",
    "cart.checkout": "பணம் செலுத்த செல்லவும்",
    "auth.signIn": "உள்நுழைய",
    "auth.signUp": "பதிவு செய்ய",
    "auth.welcome": "மீண்டும் வரவேற்கிறோம்",
    "common.loading": "ஏற்றுகிறது...",
    "common.addToCart": "கூடையில் சேர்க்கவும்",
    "common.bookNow": "இப்போது முன்பதிவு செய்யவும்",
  },
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("electricals-language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "ta")) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("electricals-language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
