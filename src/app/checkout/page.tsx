"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Users, CreditCard, Lock, Check, ArrowLeft, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useScrollThreshold } from "@/hooks/use-scroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { GradientBorder } from "@/components/ui/gradient-border";
import { FloatingCard } from "@/components/ui/floating-card";
import { rooms } from "@/data/rooms";

const CheckoutPageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const isScrolled = useScrollThreshold(100);
  
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  
  // Get booking data from URL params
  const roomId = searchParams.get("roomId");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const guests = searchParams.get("guests") || "2";
  const adults = searchParams.get("adults") || "1";
  const children = searchParams.get("children") || "0";
  const fullName = searchParams.get("fullName") || "";
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const specialRequests = searchParams.get("specialRequests") || "";
  const roomType = searchParams.get("roomType") || "";

  // Find room data
  const room = roomId ? rooms.find((r) => r.id === parseInt(roomId)) : null;
  
  // If no room data, try to get from roomType
  const roomTypes: Record<string, { name: string; price: number }> = {
    standard: { name: "Phòng Standard", price: 1500000 },
    deluxe: { name: "Phòng Deluxe", price: 2200000 },
    suite: { name: "Phòng Suite", price: 3500000 },
    presidential: { name: "Phòng Presidential", price: 5000000 },
  };

  const selectedRoomType = roomType ? roomTypes[roomType] : null;
  const roomPrice = room ? parseInt(room.price.replace(/,/g, "")) : (selectedRoomType?.price || 0);
  const roomName = room?.name || selectedRoomType?.name || "Phòng";

  // Calculate dates
  const checkInDate = checkIn ? new Date(checkIn) : null;
  const checkOutDate = checkOut ? new Date(checkOut) : null;
  const nights = checkInDate && checkOutDate 
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  // Calculate totals
  const subtotal = roomPrice * nights;
  const tax = Math.round(subtotal * 0.1); // 10% tax
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const total = subtotal + tax + serviceFee;

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    bankName: "",
    accountNumber: "",
  });

  useEffect(() => {
    // Validate required params
    if (!checkIn || !checkOut || (!roomId && !roomType)) {
      toast({
        title: "Thông tin đặt phòng không đầy đủ",
        description: "Vui lòng quay lại và đặt phòng lại",
        variant: "destructive",
      });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [checkIn, checkOut, roomId, roomType, router, toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment method
    if (paymentMethod === "credit-card") {
      if (!paymentData.cardNumber || !paymentData.cardName || !paymentData.expiryDate || !paymentData.cvv) {
        toast({
          title: "Thông tin thanh toán chưa đầy đủ",
          description: "Vui lòng điền đầy đủ thông tin thẻ",
          variant: "destructive",
        });
        return;
      }
    } else if (paymentMethod === "bank-transfer") {
      if (!paymentData.bankName || !paymentData.accountNumber) {
        toast({
          title: "Thông tin chuyển khoản chưa đầy đủ",
          description: "Vui lòng điền đầy đủ thông tin ngân hàng",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);

    // Generate booking ID
    const newBookingId = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setBookingId(newBookingId);
      
      // Save booking to localStorage for lookup
      const bookingData = {
        bookingId: newBookingId,
        roomId: roomId || "",
        roomName: roomName,
        roomType: roomType,
        checkIn: checkIn || "",
        checkOut: checkOut || "",
        guests: guests,
        adults: adults,
        children: children,
        fullName: fullName,
        email: email,
        phone: phone,
        specialRequests: specialRequests || "",
        total: total,
        subtotal: subtotal,
        tax: tax,
        serviceFee: serviceFee,
        nights: nights,
        createdAt: new Date().toISOString(),
      };

      // Get existing bookings from localStorage
      const existingBookings = localStorage.getItem("bookings");
      let bookings: Array<{
        bookingId: string;
        roomId: string;
        roomName: string;
        roomType: string;
        checkIn: string;
        checkOut: string;
        guests: string;
        adults: string;
        children: string;
        fullName: string;
        email: string;
        phone: string;
        specialRequests: string;
        total: number;
        subtotal: number;
        tax: number;
        serviceFee: number;
        nights: number;
        createdAt: string;
      }> = [];
      
      if (existingBookings) {
        try {
          bookings = JSON.parse(existingBookings);
        } catch (e) {
          console.error("Error parsing bookings:", e);
        }
      }

      // Add new booking
      bookings.push(bookingData);
      
      // Save back to localStorage
      localStorage.setItem("bookings", JSON.stringify(bookings));

      toast({
        title: "Thanh toán thành công!",
        description: "Đặt phòng của bạn đã được xác nhận. Chúng tôi đã gửi email xác nhận.",
      });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-luxury-gradient">
        <Navigation />
        <main className="pt-14 lg:pt-16">
          <section className="py-20 min-h-[80vh] flex items-center">
            <div className="container-luxury w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check className="w-12 h-12 text-green-500" />
                  </div>
                  <h1 className="text-4xl font-display font-bold mb-4">Thanh Toán Thành Công!</h1>
                  <p className="text-lg text-muted-foreground mb-8">
                    Cảm ơn bạn đã đặt phòng tại Y Hotel. Chúng tôi đã gửi email xác nhận đến {email}
                  </p>
                </div>

                <GradientBorder containerClassName="relative">
                  <FloatingCard className="bg-background rounded-xl border-0 backdrop-blur-none shadow-none">
                    <CardContent className="p-8">
                      <div className="space-y-4 text-left mb-8">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mã đặt phòng:</span>
                          <span className="font-bold">#{bookingId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phòng:</span>
                          <span className="font-medium">{roomName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày nhận phòng:</span>
                          <span className="font-medium">{checkIn ? formatDate(checkIn) : ""}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ngày trả phòng:</span>
                          <span className="font-medium">{checkOut ? formatDate(checkOut) : ""}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Số đêm:</span>
                          <span className="font-medium">{nights} đêm</span>
                        </div>
                        <div className="flex justify-between pt-4 border-t">
                          <span className="text-lg font-bold">Tổng thanh toán:</span>
                          <span className="text-lg font-bold text-primary">{formatCurrency(total)}₫</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => router.push("/")}
                        >
                          Về Trang Chủ
                        </Button>
                        <Button
                          variant="default"
                          className="flex-1"
                          onClick={() => {
                            const params = new URLSearchParams({
                              bookingId: bookingId,
                              roomId: roomId || "",
                              checkIn: checkIn || "",
                              checkOut: checkOut || "",
                              guests: guests,
                              adults: adults,
                              children: children,
                              roomType: roomType,
                              fullName: fullName,
                              email: email,
                              phone: phone,
                              ...(specialRequests && { specialRequests: specialRequests }),
                            });
                            router.push(`/booking/${bookingId}?${params.toString()}`);
                          }}
                        >
                          Xem Chi Tiết Đặt Phòng
                        </Button>
                      </div>
                    </CardContent>
                  </FloatingCard>
                </GradientBorder>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!checkIn || !checkOut || (!roomId && !roomType)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Navigation />
      <main className="pt-14 lg:pt-16">
        {/* Sticky Back Button - Shows when scrolling */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: isScrolled ? 1 : 0,
            y: isScrolled ? 0 : -20
          }}
          transition={{ duration: 0.3 }}
          className={`fixed top-20 left-4 z-40 ${isScrolled ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <Link href={roomId ? `/rooms/${roomId}` : "/"}>
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-2 backdrop-blur-sm bg-background/90 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </Link>
        </motion.div>
        
        <section className="py-12 bg-gradient-subtle">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Payment Form */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link href={roomId ? `/rooms/${roomId}` : "/"}>
                    <Button variant="ghost" size="sm" className="mb-6 gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Quay lại
                    </Button>
                  </Link>

                  <GradientBorder containerClassName="relative">
                    <FloatingCard className="bg-background rounded-xl border-0 backdrop-blur-none shadow-none">
                      <CardHeader>
                        <CardTitle className="text-2xl font-display flex items-center gap-2">
                          <Lock className="w-6 h-6 text-primary" />
                          Thông Tin Thanh Toán
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                          {/* Payment Method Selection */}
                          <div>
                            <Label className="text-base font-semibold mb-4 block">Phương thức thanh toán</Label>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                              <div className="space-y-3">
                                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
                                  <RadioGroupItem value="credit-card" id="credit-card" />
                                  <Label htmlFor="credit-card" className="flex-1 cursor-pointer flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Thẻ tín dụng/Ghi nợ
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
                                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                                  <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Chuyển khoản ngân hàng
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer">
                                  <RadioGroupItem value="cash" id="cash" />
                                  <Label htmlFor="cash" className="flex-1 cursor-pointer flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Thanh toán tại khách sạn
                                  </Label>
                                </div>
                              </div>
                            </RadioGroup>
                          </div>

                          {/* Credit Card Form */}
                          {paymentMethod === "credit-card" && (
                            <div className="space-y-4 pt-4 border-t">
                              <div>
                                <Label htmlFor="cardNumber">Số thẻ *</Label>
                                <Input
                                  id="cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  value={paymentData.cardNumber}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
                                    const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                                    setPaymentData({ ...paymentData, cardNumber: formatted });
                                  }}
                                  maxLength={19}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="cardName">Tên chủ thẻ *</Label>
                                <Input
                                  id="cardName"
                                  placeholder="NGUYEN VAN A"
                                  value={paymentData.cardName}
                                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })}
                                  required
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
                                  <Input
                                    id="expiryDate"
                                    placeholder="MM/YY"
                                    value={paymentData.expiryDate}
                                    onChange={(e) => {
                                      let value = e.target.value.replace(/\D/g, "");
                                      if (value.length >= 2) {
                                        value = value.substring(0, 2) + "/" + value.substring(2, 4);
                                      }
                                      setPaymentData({ ...paymentData, expiryDate: value });
                                    }}
                                    maxLength={5}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cvv">CVV *</Label>
                                  <Input
                                    id="cvv"
                                    placeholder="123"
                                    type="password"
                                    value={paymentData.cvv}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, "");
                                      setPaymentData({ ...paymentData, cvv: value.substring(0, 3) });
                                    }}
                                    maxLength={3}
                                    required
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Bank Transfer Form */}
                          {paymentMethod === "bank-transfer" && (
                            <div className="space-y-4 pt-4 border-t">
                              <div>
                                <Label htmlFor="bankName">Ngân hàng *</Label>
                                <Select
                                  value={paymentData.bankName}
                                  onValueChange={(value) => setPaymentData({ ...paymentData, bankName: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn ngân hàng" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="vietcombank">Vietcombank</SelectItem>
                                    <SelectItem value="bidv">BIDV</SelectItem>
                                    <SelectItem value="vietinbank">VietinBank</SelectItem>
                                    <SelectItem value="techcombank">Techcombank</SelectItem>
                                    <SelectItem value="acb">ACB</SelectItem>
                                    <SelectItem value="mbbank">MB Bank</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="accountNumber">Số tài khoản *</Label>
                                <Input
                                  id="accountNumber"
                                  placeholder="Nhập số tài khoản"
                                  value={paymentData.accountNumber}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setPaymentData({ ...paymentData, accountNumber: value });
                                  }}
                                  required
                                />
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg text-sm">
                                <p className="font-semibold mb-2">Thông tin chuyển khoản:</p>
                                <p>Số tài khoản: <span className="font-mono">1234567890</span></p>
                                <p>Chủ tài khoản: <span className="font-mono">Y HOTEL</span></p>
                                <p>Nội dung: <span className="font-mono">Dat phong {roomName}</span></p>
                              </div>
                            </div>
                          )}

                          {/* Cash Payment Info */}
                          {paymentMethod === "cash" && (
                            <div className="p-4 bg-muted/50 rounded-lg text-sm space-y-2">
                              <p className="font-semibold">Thanh toán tại khách sạn</p>
                              <p>Bạn sẽ thanh toán khi nhận phòng. Vui lòng đến đúng giờ nhận phòng (14:00).</p>
                            </div>
                          )}

                          <div className="pt-4 border-t">
                            <ShimmerButton
                              type="submit"
                              variant="luxury"
                              size="lg"
                              className="w-full"
                              disabled={isProcessing}
                            >
                              {isProcessing ? "Đang xử lý..." : `Thanh Toán ${formatCurrency(total)}₫`}
                            </ShimmerButton>
                            <p className="text-xs text-muted-foreground text-center mt-4">
                              <Lock className="w-3 h-3 inline mr-1" />
                              Thông tin thanh toán được mã hóa và bảo mật
                            </p>
                          </div>
                        </form>
                      </CardContent>
                    </FloatingCard>
                  </GradientBorder>
                </motion.div>
              </div>

              {/* Right Column - Booking Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="sticky top-24"
                >
                  <GradientBorder containerClassName="relative">
                    <FloatingCard className="bg-background rounded-xl border-0 backdrop-blur-none shadow-none">
                      <CardHeader>
                        <CardTitle className="text-xl font-display">Tóm Tắt Đặt Phòng</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Room Info */}
                        <div>
                          <h3 className="font-semibold mb-2">{roomName}</h3>
                          {room && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Users className="w-4 h-4" />
                              <span>{guests} khách</span>
                            </div>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="space-y-3 pt-4 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <div className="flex-1">
                              <p className="text-muted-foreground">Nhận phòng</p>
                              <p className="font-medium">{checkIn ? formatDate(checkIn) : ""}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <div className="flex-1">
                              <p className="text-muted-foreground">Trả phòng</p>
                              <p className="font-medium">{checkOut ? formatDate(checkOut) : ""}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <div className="flex-1">
                              <p className="text-muted-foreground">Số đêm</p>
                              <p className="font-medium">{nights} đêm</p>
                            </div>
                          </div>
                        </div>

                        {/* Guest Info */}
                        <div className="pt-4 border-t space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-primary" />
                            <div className="flex-1">
                              <p className="text-muted-foreground">Khách</p>
                              <p className="font-medium">
                                {adults} người lớn{parseInt(children) > 0 ? `, ${children} trẻ em` : ""}
                              </p>
                            </div>
                          </div>
                          {fullName && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <p className="text-muted-foreground">Tên</p>
                                <p className="font-medium">{fullName}</p>
                              </div>
                            </div>
                          )}
                          {email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <p className="text-muted-foreground">Email</p>
                                <p className="font-medium text-xs break-all">{email}</p>
                              </div>
                            </div>
                          )}
                          {phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-primary" />
                              <div className="flex-1">
                                <p className="text-muted-foreground">Điện thoại</p>
                                <p className="font-medium">{phone}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Price Breakdown */}
                        <div className="pt-4 border-t space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {formatCurrency(roomPrice)}₫ × {nights} đêm
                            </span>
                            <span className="font-medium">{formatCurrency(subtotal)}₫</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Thuế (10%)</span>
                            <span className="font-medium">{formatCurrency(tax)}₫</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Phí dịch vụ (5%)</span>
                            <span className="font-medium">{formatCurrency(serviceFee)}₫</span>
                          </div>
                          <div className="flex justify-between pt-4 border-t text-lg font-bold">
                            <span>Tổng cộng</span>
                            <span className="text-primary">{formatCurrency(total)}₫</span>
                          </div>
                        </div>

                        {specialRequests && (
                          <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-2">Yêu cầu đặc biệt:</p>
                            <p className="text-sm">{specialRequests}</p>
                          </div>
                        )}
                      </CardContent>
                    </FloatingCard>
                  </GradientBorder>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    }>
      <CheckoutPageContent />
    </Suspense>
  );
};

export default CheckoutPage;

