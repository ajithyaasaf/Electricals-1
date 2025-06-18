import { useState } from "react";
import { useRoute } from "wouter";
import { Star, Plus, Minus, ShoppingCart, Zap, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";
import { PageSkeleton } from "@/components/LoadingSkeleton";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${params?.id}`],
    enabled: !!params?.id,
  });

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] || "",
    };

    addItem(cartItem);
    toast({
      title: "Added to Cart!",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const discountPercentage = product.featured ? 20 : 0;
  const originalPrice = discountPercentage > 0 ? Math.round(product.price / (1 - discountPercentage / 100)) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg p-4 shadow-sm">
              <img
                src={product.images[selectedImage] || product.images[0] || "https://images.unsplash.com/photo-1581092062292-b9aef1b8c14f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg p-2 border-2 transition-colors ${
                      selectedImage === index ? "border-electric-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.featured && (
                  <Badge className="bg-green-500">BESTSELLER</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge className="bg-safety-500">{discountPercentage}% OFF</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{product.rating} ({Math.floor(Math.random() * 100) + 50} reviews)</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">Brand: {product.brand}</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                {originalPrice && (
                  <span className="text-xl text-gray-500 line-through">₹{originalPrice.toLocaleString()}</span>
                )}
                {discountPercentage > 0 && (
                  <span className="text-green-600 font-semibold">Save ₹{(originalPrice! - product.price).toLocaleString()}</span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-electric-600 hover:bg-electric-700 text-white py-3 text-lg font-semibold"
              size="lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart - ₹{(product.price * quantity).toLocaleString()}
            </Button>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-electric-50 rounded-lg">
                <Truck className="w-5 h-5 text-electric-600" />
                <span className="text-sm font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-safety-50 rounded-lg">
                <Shield className="w-5 h-5 text-safety-600" />
                <span className="text-sm font-medium">Quality Assured</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">Fast Service</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                  <div className="text-center py-8">
                    <p className="text-gray-600">Reviews functionality coming soon!</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
