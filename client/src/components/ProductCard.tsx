import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@shared/schema";
import { useCart } from "@/hooks/useCart";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "",
    };
    
    addItem(cartItem);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAdding(false);
  };

  const discountPercentage = product.featured ? 20 : 0;
  const originalPrice = discountPercentage > 0 ? Math.round(product.price / (1 - discountPercentage / 100)) : null;

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-4">
          <div className="aspect-square bg-gray-50 rounded-lg mb-4 p-4 relative overflow-hidden">
            <img
              src={product.images[0] || "https://images.unsplash.com/photo-1581092062292-b9aef1b8c14f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 right-2 bg-safety-500 text-white">
                {discountPercentage}% OFF
              </Badge>
            )}
            {product.featured && (
              <Badge className="absolute top-2 left-2 bg-green-500 text-white">
                BESTSELLER
              </Badge>
            )}
          </div>
          
          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
              )}
            </div>
            <div className="flex items-center text-yellow-400 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 text-gray-600">{product.rating}</span>
            </div>
          </div>
          
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="w-full bg-electric-600 hover:bg-electric-700 text-white transition-colors"
          >
            {isAdding ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Adding...
              </>
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                {t("common.addToCart")}
              </>
            )}
          </Button>
          
          {product.stock < 10 && product.stock > 0 && (
            <p className="text-orange-600 text-xs mt-2 text-center">
              Only {product.stock} left in stock!
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
