import { useState } from "react";
import { useLocation } from "wouter";
import { CreditCard, Smartphone, Banknote, MapPin, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  processUPIPayment, 
  processCardPayment, 
  processCODPayment, 
  validateCardNumber, 
  validateExpiryDate, 
  detectCardType,
  type PaymentMethod as PaymentMethodType 
} from "@/utils/payments";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("card");
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
  });

  // Payment form state
  const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardHolderName: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ["name", "phone", "address", "city", "pincode"];
    for (const field of required) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        toast({
          title: "Missing Information",
          description: `Please fill in your ${field}`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "cod") {
        // Handle Cash on Delivery
        await handleCODOrder();
      } else {
        // Handle online payment
        await handleOnlinePayment();
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "Something went wrong during payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCODOrder = async () => {
    const orderData = {
      userId: user?.uid || "",
      items,
      subtotal,
      tax,
      shipping: 0,
      total,
      paymentMethod: "cod" as const,
      paymentStatus: "pending" as const,
      status: "pending" as const,
      shippingAddress: shippingInfo,
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Failed to place order");
    }

    const order = await response.json();
    
    toast({
      title: "Order Placed!",
      description: "Your order has been placed successfully. You'll pay on delivery.",
    });

    clearCart();
    setLocation(`/order-confirmation/${order.id}`);
  };

  const handleOnlinePayment = async () => {
    const paymentRequest = {
      amount: total,
      method: paymentMethod,
      customerDetails: {
        name: shippingInfo.name,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.pincode}`,
      },
      orderDetails: {
        orderId: `ORD${Date.now()}`,
        description: `Order for ${items.length} items from Electricals Madurai`,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    };

    let paymentResult;

    try {
      if (paymentMethod === "upi") {
        if (!upiId) {
          throw new Error("Please enter your UPI ID");
        }
        paymentResult = await processUPIPayment(paymentRequest, { upiId });
      } else if (paymentMethod === "card") {
        if (!cardData.cardNumber || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv || !cardData.cardHolderName) {
          throw new Error("Please fill in all card details");
        }
        if (!validateCardNumber(cardData.cardNumber)) {
          throw new Error("Invalid card number");
        }
        if (!validateExpiryDate(cardData.expiryMonth, cardData.expiryYear)) {
          throw new Error("Invalid expiry date");
        }
        paymentResult = await processCardPayment(paymentRequest, cardData);
      }

      if (paymentResult) {
        // Create order after successful payment initiation
        const orderData = {
          userId: user?.uid || "",
          items,
          subtotal,
          tax,
          shipping: 0,
          total,
          paymentMethod: paymentMethod,
          paymentStatus: paymentResult.status === "completed" ? "completed" as const : "pending" as const,
          status: "confirmed" as const,
          shippingAddress: shippingInfo,
          paymentId: paymentResult.id,
        };

        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (orderResponse.ok) {
          const order = await orderResponse.json();
          
          if (paymentMethod === "upi" && paymentResult.paymentUrl) {
            // Open UPI app or show QR code
            window.open(paymentResult.paymentUrl, '_blank');
          }

          toast({
            title: "Payment Initiated!",
            description: paymentResult.message || "Your payment is being processed.",
          });
          
          clearCart();
          setLocation(`/order-confirmation/${order.id}`);
        } else {
          throw new Error("Failed to create order");
        }
      }
    } catch (error: any) {
      throw new Error(error.message || "Payment processing failed");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-4">Add some products to proceed with checkout</p>
            <Button onClick={() => setLocation("/products")}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("checkout.title")}</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {t("checkout.shippingInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={shippingInfo.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Street address, apartment, suite, etc."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={shippingInfo.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t("checkout.paymentMethod")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer">
                      <CreditCard className="w-5 h-5 text-electric-600" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-600">Visa, Mastercard, RuPay</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer">
                      <Smartphone className="w-5 h-5 text-electric-600" />
                      <div>
                        <div className="font-medium">UPI Payment</div>
                        <div className="text-sm text-gray-600">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer">
                      <Banknote className="w-5 h-5 text-electric-600" />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">Pay when you receive</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>{t("order.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST):</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total:</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-electric-600 hover:bg-electric-700 text-white py-3 text-lg font-semibold"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : paymentMethod === "cod" ? (
                    "Place Order (COD)"
                  ) : (
                    `Pay ₹${total.toLocaleString()}`
                  )}
                </Button>

                <p className="text-xs text-gray-600 text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
