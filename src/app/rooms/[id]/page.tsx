"use client";

import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bed, Users, Wifi, Car, Coffee, Bath, ArrowLeft, Check, Star, MapPin, 
  Calendar as CalendarIcon, Phone, ChevronLeft, ChevronRight, X, 
  Shield, Clock, Ban, Home, Maximize2, Eye, Heart, Share2, 
  ChevronDown, MessageSquare, Sparkles, Award, ThumbsUp
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { FloatingCard } from "@/components/ui/floating-card";
import { GradientBorder } from "@/components/ui/gradient-border";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useScrollThreshold } from "@/hooks/use-scroll";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { rooms, Room } from "@/data/rooms";

interface RoomDetailPageProps {
  params: Promise<{ id: string }>;
}

const RoomDetailPage = ({ params }: RoomDetailPageProps) => {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const isScrolled = useScrollThreshold(100);
  const [checkIn, setCheckIn] = useState<Date | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState("2");
  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const roomId = parseInt(id);
  const room = rooms.find((r) => r.id === roomId);

  useEffect(() => {
    if (!room) {
      notFound();
    }
  }, [room]);

  if (!room) {
    notFound();
  }

  // Get similar rooms (same category, exclude current room)
  const similarRooms = rooms
    .filter((r) => r.id !== room.id && r.category === room.category)
    .slice(0, 3);

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      toast({
        title: "Vui lòng chọn ngày",
        description: "Chọn ngày nhận phòng và trả phòng để tiếp tục",
        variant: "destructive",
      });
      return;
    }

    if (!bookingData.fullName || !bookingData.email || !bookingData.phone) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin liên hệ",
        variant: "destructive",
      });
      return;
    }

    // Format dates for URL
    const checkInStr = format(checkIn, "yyyy-MM-dd");
    const checkOutStr = format(checkOut, "yyyy-MM-dd");

    // Build query params for checkout page
    const params = new URLSearchParams({
      roomId: id,
      checkIn: checkInStr,
      checkOut: checkOutStr,
      guests: guests,
      adults: guests,
      children: "0",
      fullName: bookingData.fullName,
      email: bookingData.email,
      phone: bookingData.phone,
      ...(bookingData.specialRequests && { specialRequests: bookingData.specialRequests }),
    });

    // Redirect to checkout page
    router.push(`/checkout?${params.toString()}`);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      standard: "Standard",
      deluxe: "Deluxe",
      suite: "Suite",
      family: "Family",
    };
    return labels[category] || category;
  };

  // Get gallery images for the room, fallback to single image if no gallery
  const roomGalleryImages = room.galleryImages && room.galleryImages.length > 0 
    ? room.galleryImages 
    : [room.image];

  const openLightbox = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;
    
    if (direction === 'prev') {
      setSelectedImageIndex(selectedImageIndex > 0 ? selectedImageIndex - 1 : roomGalleryImages.length - 1);
    } else {
      setSelectedImageIndex(selectedImageIndex < roomGalleryImages.length - 1 ? selectedImageIndex + 1 : 0);
    }
  };

  // Auto-advance carousel
  useEffect(() => {
    if (!room || !roomGalleryImages || roomGalleryImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % roomGalleryImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [room, roomGalleryImages]);

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Navigation />
      <main className="pt-14 lg:pt-16">
        {/* Hero Section with Image Carousel */}
        <section className="relative h-[50vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
          {/* Image Carousel */}
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={roomGalleryImages[currentImageIndex]}
              alt={`${room.name} - ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
          
          {/* Carousel Navigation Dots */}
          {roomGalleryImages.length > 1 && (
            <div className="absolute bottom-24 md:bottom-32 left-0 right-0 flex justify-center gap-2 z-10">
              {roomGalleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    currentImageIndex === index 
                      ? "bg-white w-8" 
                      : "bg-white/50 hover:bg-white/70"
                  )}
                  aria-label={`Xem hình ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Carousel Arrows */}
          {roomGalleryImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  prev === 0 ? roomGalleryImages.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                aria-label="Hình trước"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  (prev + 1) % roomGalleryImages.length
                )}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                aria-label="Hình sau"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
          
          {/* Back Button */}
          <div className="absolute top-2.5 left-2.5 xs:top-3 xs:left-3 sm:top-4 sm:left-4 z-10">
            <Link href="/rooms">
              <Button variant="secondary" size="sm" className="gap-1.5 sm:gap-2 text-xs sm:text-sm backdrop-blur-sm bg-background/80 h-8 xs:h-9 sm:h-10">
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">Quay lại</span>
              </Button>
            </Link>
          </div>
          
          {/* Sticky Back Button - Shows when scrolling */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: isScrolled ? 1 : 0,
              y: isScrolled ? 0 : -20
            }}
            transition={{ duration: 0.3 }}
            className={`fixed top-16 sm:top-20 left-2.5 xs:left-3 sm:left-4 z-40 ${isScrolled ? 'pointer-events-auto' : 'pointer-events-none'}`}
          >
            <Link href="/rooms">
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-1.5 sm:gap-2 text-xs sm:text-sm backdrop-blur-sm bg-background/90 shadow-lg h-8 xs:h-9 sm:h-10"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">Quay lại</span>
              </Button>
            </Link>
          </motion.div>

          {/* Action Buttons - Top Right */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="backdrop-blur-sm bg-background/80 hover:bg-background/90"
              onClick={() => {
                setIsLiked(!isLiked);
                toast({
                  title: isLiked ? "Đã bỏ thích" : "Đã thêm vào yêu thích",
                  duration: 2000,
                });
              }}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-red-500 text-red-500")} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="backdrop-blur-sm bg-background/80 hover:bg-background/90"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast({
                  title: "Đã sao chép liên kết",
                  duration: 2000,
                });
              }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Room Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
            <div className="container-luxury">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-4 text-sm text-white/80">
                  <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
                  <ChevronRight className="w-4 h-4" />
                  <Link href="/rooms" className="hover:text-white transition-colors">Phòng</Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-white">{room.name}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <Badge className="bg-primary text-white px-3 py-1">{getCategoryLabel(room.category)}</Badge>
                  {room.popular && (
                    <Badge className="bg-yellow-500 text-white flex items-center gap-1 px-3 py-1">
                      <Star className="w-3 h-3 fill-white" />
                      Phổ biến
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.8</span>
                    <span className="text-white/80 text-sm">(128 đánh giá)</span>
                  </div>
                </div>

                <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
                  {room.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-5 h-5" />
                    <span className="text-lg">{room.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="text-lg">{room.guests} khách</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5" />
                    <span className="text-lg">King Bed</span>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-2xl md:text-3xl font-bold whitespace-nowrap">
                      {room.price}₫
                    </span>
                    <span className="text-white/90">/đêm</span>
                  </div>
                  {room.originalPrice && (
                    <span className="text-lg line-through text-white/60">
                      {room.originalPrice}₫
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-24 bg-gradient-subtle">
          <div className="container-luxury">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Room Details with Tabs */}
              <div className="lg:col-span-2 lg:order-1 space-y-8">
                {/* Tabs Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  <GradientBorder containerClassName="relative">
                    <FloatingCard className="bg-background rounded-xl border-0 backdrop-blur-none shadow-none">
                      <CardContent className="p-6">
                        <Tabs defaultValue="overview" className="w-full">
                          <TabsList className="grid w-full grid-cols-4 mb-6">
                            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                            <TabsTrigger value="amenities">Tiện nghi</TabsTrigger>
                            <TabsTrigger value="policies">Chính sách</TabsTrigger>
                            <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                          </TabsList>

                          {/* Overview Tab */}
                          <TabsContent value="overview" className="space-y-6">
                            <div>
                              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-primary" />
                                Mô tả phòng
                              </h2>
                              <p className="text-muted-foreground leading-relaxed text-lg">
                                {room.name} tại Y Hotel được thiết kế với không gian rộng rãi {room.size}, 
                                phù hợp cho {room.guests} khách. Phòng được trang bị đầy đủ tiện nghi hiện đại 
                                và dịch vụ cao cấp, mang đến trải nghiệm nghỉ dưỡng tuyệt vời. 
                                Với {room.features.length} đặc điểm nổi bật, đây là lựa chọn hoàn hảo cho 
                                {room.category === "family" ? " gia đình" : 
                                 room.category === "suite" ? " doanh nhân" : 
                                 " kỳ nghỉ của bạn"}.
                              </p>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" />
                                Đặc điểm nổi bật
                              </h3>
                              <div className="grid md:grid-cols-2 gap-3">
                                {room.features.map((feature, index) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-primary/5 transition-colors"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                  >
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <Check className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-foreground leading-relaxed">{feature}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="text-xl font-semibold mb-4">Thông tin phòng</h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-primary/5 rounded-lg">
                                  <Maximize2 className="w-5 h-5 text-primary mb-2" />
                                  <p className="text-sm text-muted-foreground">Diện tích</p>
                                  <p className="font-semibold">{room.size}</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg">
                                  <Users className="w-5 h-5 text-primary mb-2" />
                                  <p className="text-sm text-muted-foreground">Sức chứa</p>
                                  <p className="font-semibold">{room.guests} khách</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg">
                                  <Bed className="w-5 h-5 text-primary mb-2" />
                                  <p className="text-sm text-muted-foreground">Loại giường</p>
                                  <p className="font-semibold">King Bed</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg">
                                  <Eye className="w-5 h-5 text-primary mb-2" />
                                  <p className="text-sm text-muted-foreground">View</p>
                                  <p className="font-semibold">Thành phố</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg">
                                  <Home className="w-5 h-5 text-primary mb-2" />
                                  <p className="text-sm text-muted-foreground">Tầng</p>
                                  <p className="font-semibold">5-12</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg">
                                  <Bath className="w-5 h-5 text-primary mb-2" />
                                  <p className="text-sm text-muted-foreground">Phòng tắm</p>
                                  <p className="font-semibold">Riêng biệt</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Amenities Tab */}
                          <TabsContent value="amenities" className="space-y-6">
                            <div>
                              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">Tiện nghi phòng</h2>
                              
                              <div className="space-y-6">
                                <div>
                                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Wifi className="w-5 h-5 text-primary" />
                                    Giải trí & Công nghệ
                                  </h3>
                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>WiFi tốc độ cao miễn phí</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>TV màn hình phẳng 55 inch</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Điều hòa không khí</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Hệ thống âm thanh Bluetooth</span>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Coffee className="w-5 h-5 text-primary" />
                                    Ẩm thực
                                  </h3>
                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Minibar cao cấp</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Máy pha cà phê/trà</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Tủ lạnh mini</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Ấm đun nước điện</span>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Bath className="w-5 h-5 text-primary" />
                                    Phòng tắm
                                  </h3>
                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Vòi sen phun mưa</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Đồ dùng vệ sinh cao cấp</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Máy sấy tóc</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Khăn tắm cao cấp</span>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                <div>
                                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Car className="w-5 h-5 text-primary" />
                                    Dịch vụ khác
                                  </h3>
                                  <div className="grid md:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Bãi đỗ xe miễn phí</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Dịch vụ dọn phòng hàng ngày</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Két an toàn</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg">
                                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                                      <span>Bàn làm việc</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Policies Tab */}
                          <TabsContent value="policies" className="space-y-6">
                            <div>
                              <h2 className="text-2xl md:text-3xl font-display font-bold mb-6">Chính sách khách sạn</h2>
                              
                              <div className="space-y-6">
                                <div className="p-6 bg-primary/5 rounded-lg border-l-4 border-primary">
                                  <div className="flex items-start gap-4">
                                    <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                      <h3 className="text-lg font-semibold mb-2">Giờ nhận & trả phòng</h3>
                                      <div className="space-y-2 text-muted-foreground">
                                        <p><strong className="text-foreground">Nhận phòng:</strong> Từ 14:00</p>
                                        <p><strong className="text-foreground">Trả phòng:</strong> Trước 12:00</p>
                                        <p className="text-sm">* Nhận phòng sớm/trả phòng muộn có thể được sắp xếp với phụ phí</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-6 bg-background border rounded-lg">
                                  <div className="flex items-start gap-4">
                                    <Ban className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                      <h3 className="text-lg font-semibold mb-2">Chính sách hủy phòng</h3>
                                      <div className="space-y-2 text-muted-foreground">
                                        <p>• Hủy miễn phí trước 48 giờ check-in</p>
                                        <p>• Hủy trong vòng 48 giờ: Phí 50% tổng tiền</p>
                                        <p>• Không xuất hiện (No-show): Phí 100% tổng tiền</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-6 bg-background border rounded-lg">
                                  <div className="flex items-start gap-4">
                                    <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                      <h3 className="text-lg font-semibold mb-2">Chính sách trẻ em</h3>
                                      <div className="space-y-2 text-muted-foreground">
                                        <p>• Trẻ em dưới 6 tuổi: Miễn phí (không thêm giường)</p>
                                        <p>• Trẻ em 6-12 tuổi: 50% giá phòng (thêm giường phụ)</p>
                                        <p>• Trẻ em trên 12 tuổi: Tính như người lớn</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-6 bg-background border rounded-lg">
                                  <div className="flex items-start gap-4">
                                    <Shield className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                                    <div>
                                      <h3 className="text-lg font-semibold mb-2">Thanh toán & Đặt cọc</h3>
                                      <div className="space-y-2 text-muted-foreground">
                                        <p>• Chấp nhận: Tiền mặt, thẻ tín dụng, chuyển khoản</p>
                                        <p>• Đặt cọc: 30% khi đặt phòng</p>
                                        <p>• Thanh toán còn lại khi check-in</p>
                                        <p>• Hoàn tiền trong 7-14 ngày làm việc (nếu hủy hợp lệ)</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Lưu ý quan trọng
                                  </h3>
                                  <ul className="space-y-1 text-muted-foreground text-sm">
                                    <li>• Vui lòng xuất trình CMND/CCCD khi check-in</li>
                                    <li>• Không hút thuốc trong phòng (phí vệ sinh: 1.000.000₫)</li>
                                    <li>• Không mang thú cưng</li>
                                    <li>• Giữ gìn tài sản khách sạn</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Reviews Tab */}
                          <TabsContent value="reviews" className="space-y-6">
                            <div>
                              <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl md:text-3xl font-display font-bold">Đánh giá từ khách hàng</h2>
                                <div className="text-right">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                    <span className="text-3xl font-bold">4.8</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">128 đánh giá</p>
                                </div>
                              </div>

                              {/* Rating Breakdown */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 bg-primary/5 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-primary">9.2</p>
                                  <p className="text-sm text-muted-foreground">Sạch sẽ</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-primary">9.0</p>
                                  <p className="text-sm text-muted-foreground">Dịch vụ</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-primary">8.8</p>
                                  <p className="text-sm text-muted-foreground">Vị trí</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-lg text-center">
                                  <p className="text-2xl font-bold text-primary">9.1</p>
                                  <p className="text-sm text-muted-foreground">Giá trị</p>
                                </div>
                              </div>

                              {/* Reviews List */}
                              <div className="space-y-6">
                                {[
                                  {
                                    name: "Nguyễn Văn A",
                                    date: "2 ngày trước",
                                    rating: 5,
                                    comment: "Phòng rất đẹp và sạch sẽ. Nhân viên thân thiện, nhiệt tình. View từ phòng tuyệt vời. Tôi sẽ quay lại!"
                                  },
                                  {
                                    name: "Trần Thị B",
                                    date: "1 tuần trước",
                                    rating: 5,
                                    comment: "Khách sạn sang trọng, tiện nghi đầy đủ. Đặc biệt ấn tượng với dịch vụ phòng và bữa sáng buffet."
                                  },
                                  {
                                    name: "Lê Minh C",
                                    date: "2 tuần trước",
                                    rating: 4,
                                    comment: "Phòng đẹp, giá hợp lý. Vị trí thuận tiện. Chỉ có điều wifi hơi chậm vào buổi tối."
                                  }
                                ].map((review, index) => (
                                  <motion.div
                                    key={index}
                                    className="p-6 bg-background border rounded-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h4 className="font-semibold">{review.name}</h4>
                                        <p className="text-sm text-muted-foreground">{review.date}</p>
                                      </div>
                                      <div className="flex gap-1">
                                        {Array.from({ length: review.rating }).map((_, i) => (
                                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                      </div>
                                    </div>
                                    <p className="text-muted-foreground">{review.comment}</p>
                                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                      <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                                        <ThumbsUp className="w-4 h-4" />
                                        Hữu ích ({Math.floor(Math.random() * 20) + 5})
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              <div className="text-center mt-6">
                                <Button variant="outline" size="lg">
                                  Xem thêm đánh giá
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </FloatingCard>
                  </GradientBorder>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <GradientBorder containerClassName="relative">
                    <FloatingCard className="bg-background rounded-xl border-0 backdrop-blur-none shadow-none">
                      <CardContent className="p-6">
                        <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 flex items-center gap-2">
                          <MessageSquare className="w-6 h-6 text-primary" />
                          Câu hỏi thường gặp
                        </h2>
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="item-1">
                            <AccordionTrigger>Phòng có view như thế nào?</AccordionTrigger>
                            <AccordionContent>
                              Phòng có view nhìn ra thành phố tuyệt đẹp. Bạn có thể ngắm nhìn toàn cảnh thành phố 
                              từ cửa sổ hoặc ban công (tùy loại phòng). Đặc biệt đẹp vào buổi tối khi đèn thành phố 
                              bắt đầu lên.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-2">
                            <AccordionTrigger>Có được phép hút thuốc không?</AccordionTrigger>
                            <AccordionContent>
                              Tất cả các phòng đều là phòng không hút thuốc. Vui lòng sử dụng khu vực hút thuốc 
                              được chỉ định ở sảnh hoặc khu vực ngoài trời. Phí vệ sinh nếu hút thuốc trong phòng 
                              là 1.000.000₫.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-3">
                            <AccordionTrigger>Có bữa sáng kèm theo không?</AccordionTrigger>
                            <AccordionContent>
                              Bữa sáng buffet không bao gồm trong giá phòng. Quý khách có thể đặt thêm bữa sáng 
                              với giá 150.000₫/người. Bữa sáng được phục vụ từ 6:30 - 10:00 tại nhà hàng tầng 1.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-4">
                            <AccordionTrigger>Có chỗ đỗ xe không?</AccordionTrigger>
                            <AccordionContent>
                              Có, chúng tôi cung cấp bãi đỗ xe miễn phí cho khách lưu trú. Bãi đỗ xe nằm ở tầng 
                              hầm, an toàn và có camera giám sát 24/7.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-5">
                            <AccordionTrigger>Có thể đặt thêm giường không?</AccordionTrigger>
                            <AccordionContent>
                              Có, chúng tôi có thể bố trí thêm giường phụ với phí 300.000₫/giường/đêm. 
                              Vui lòng liên hệ lễ tân hoặc ghi chú trong phần yêu cầu đặc biệt khi đặt phòng.
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="item-6">
                            <AccordionTrigger>Có dịch vụ giặt ủi không?</AccordionTrigger>
                            <AccordionContent>
                              Có, chúng tôi cung cấp dịch vụ giặt ủi 24h. Bảng giá chi tiết có trong phòng. 
                              Dịch vụ giặt nhanh (trong 4 giờ) có phụ thu thêm 50%.
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </FloatingCard>
                  </GradientBorder>
                </motion.div>

                {/* Gallery Images */}
                {roomGalleryImages.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    viewport={{ once: true }}
                  >
                    <GradientBorder containerClassName="relative">
                      <FloatingCard className="bg-background rounded-xl border-0 backdrop-blur-none shadow-none">
                        <CardContent className="p-6">
                          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 flex items-center gap-2">
                            <Eye className="w-6 h-6 text-primary" />
                            Thư viện ảnh phòng
                          </h2>
                          {/* Grid Gallery */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {roomGalleryImages.map((image, index) => (
                              <motion.div
                                key={index}
                                className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3]"
                                onClick={() => openLightbox(index)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <img
                                  src={image}
                                  alt={`${room.name} - Hình ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                                  <p className="text-white text-sm font-medium">Hình {index + 1}/{roomGalleryImages.length}</p>
                                  <Eye className="w-5 h-5 text-white" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </FloatingCard>
                    </GradientBorder>
                  </motion.div>
                )}

                {/* Booking Form - Mobile Only (shown before Similar Rooms) */}
                <div className="lg:hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <GradientBorder containerClassName="relative">
                      <FloatingCard className="bg-background rounded-xl border-0 backdrop-blur-none shadow-none">
                        <CardContent className="p-4 xs:p-5 sm:p-6">
                          <div className="mb-5 xs:mb-6">
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-primary">
                                {room.price}₫
                              </span>
                              <span className="text-xs xs:text-sm sm:text-base text-muted-foreground">/đêm</span>
                            </div>
                            {room.originalPrice && (
                              <p className="text-xs xs:text-sm text-muted-foreground line-through">
                                {room.originalPrice}₫
                              </p>
                            )}
                          </div>

                          <div className="space-y-3 xs:space-y-4">
                            <div className="grid grid-cols-2 gap-3 xs:gap-4">
                              <div>
                                <Label className="flex items-center gap-1.5 xs:gap-2 mb-2 text-xs xs:text-sm">
                                  <CalendarIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                                  Nhận phòng
                                </Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal text-xs xs:text-sm h-9 xs:h-10",
                                        !checkIn && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-1.5 xs:mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4" />
                                      {checkIn ? (
                                        format(checkIn, "dd/MM/yyyy", { locale: vi })
                                      ) : (
                                        <span>Chọn ngày</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={checkIn}
                                      onSelect={(date) => {
                                        setCheckIn(date);
                                        if (date && checkOut && checkOut <= date) {
                                          setCheckOut(undefined);
                                        }
                                      }}
                                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div>
                                <Label className="flex items-center gap-1.5 xs:gap-2 mb-2 text-xs xs:text-sm">
                                  <CalendarIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                                  Trả phòng
                                </Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full justify-start text-left font-normal text-xs xs:text-sm h-9 xs:h-10",
                                        !checkOut && "text-muted-foreground"
                                      )}
                                      disabled={!checkIn}
                                    >
                                      <CalendarIcon className="mr-1.5 xs:mr-2 h-3.5 w-3.5 xs:h-4 xs:w-4" />
                                      {checkOut ? (
                                        format(checkOut, "dd/MM/yyyy", { locale: vi })
                                      ) : (
                                        <span>Chọn ngày</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={checkOut}
                                      onSelect={(date) => setCheckOut(date)}
                                      disabled={(date) => {
                                        const today = new Date(new Date().setHours(0, 0, 0, 0));
                                        if (checkIn) {
                                          return date <= checkIn || date < today;
                                        }
                                        return date < today;
                                      }}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="guests-mobile" className="flex items-center gap-1.5 xs:gap-2 mb-2 text-xs xs:text-sm">
                                <Users className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                                Số khách
                              </Label>
                              <Select value={guests} onValueChange={setGuests}>
                                <SelectTrigger className="text-xs xs:text-sm h-9 xs:h-10" id="guests-mobile">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: room.guests }, (_, i) => i + 1).map((num) => (
                                    <SelectItem key={num} value={num.toString()}>
                                      {num} khách
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-3 pt-3 xs:pt-4 border-t">
                              <div>
                                <Label htmlFor="fullName-mobile" className="text-xs xs:text-sm mb-2 block">
                                  Họ và tên *
                                </Label>
                                <Input
                                  id="fullName-mobile"
                                  value={bookingData.fullName}
                                  onChange={(e) =>
                                    setBookingData({ ...bookingData, fullName: e.target.value })
                                  }
                                  placeholder="Nhập họ tên"
                                  className="text-xs xs:text-sm h-9 xs:h-10"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email-mobile" className="text-xs xs:text-sm mb-2 block">
                                  Email *
                                </Label>
                                <Input
                                  id="email-mobile"
                                  type="email"
                                  value={bookingData.email}
                                  onChange={(e) =>
                                    setBookingData({ ...bookingData, email: e.target.value })
                                  }
                                  placeholder="email@example.com"
                                  className="text-xs xs:text-sm h-9 xs:h-10"
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone-mobile" className="flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm mb-2">
                                  <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                                  Số điện thoại *
                                </Label>
                                <Input
                                  id="phone-mobile"
                                  value={bookingData.phone}
                                  onChange={(e) =>
                                    setBookingData({ ...bookingData, phone: e.target.value })
                                  }
                                  placeholder="+84 123 456 789"
                                  className="text-xs xs:text-sm h-9 xs:h-10"
                                />
                              </div>
                            </div>

                            <ShimmerButton
                              variant="luxury"
                              size="lg"
                              className="w-full mt-5 xs:mt-6 h-11 xs:h-12 text-sm xs:text-base"
                              onClick={handleBooking}
                            >
                              Đặt Phòng Ngay
                            </ShimmerButton>

                            <div className="text-center pt-3 xs:pt-4 border-t">
                              <p className="text-xs xs:text-sm text-muted-foreground mb-2">
                                Hoặc gọi trực tiếp
                              </p>
                              <Button variant="outline" size="sm" className="w-full gap-2 h-9 xs:h-10 text-xs xs:text-sm">
                                <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                                +84 123 456 789
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </FloatingCard>
                    </GradientBorder>
                  </motion.div>
                </div>

                {/* Similar Rooms */}
                {similarRooms.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-4 xs:mb-5 sm:mb-6">Phòng tương tự</h2>
                    {/* Mobile: Horizontal scroll, Desktop: Grid */}
                    <div className="md:grid md:grid-cols-3 md:gap-4 lg:gap-6">
                      {/* Mobile: Horizontal scroll container with fade indicator */}
                      <div className="relative md:hidden -mx-3 xs:-mx-4">
                        <div className="flex gap-3 xs:gap-4 overflow-x-auto pb-4 px-3 xs:px-4 snap-x snap-mandatory scrollbar-hide">
                          {similarRooms.map((similarRoom) => (
                            <Link 
                              key={similarRoom.id} 
                              href={`/rooms/${similarRoom.id}`}
                              className="flex-shrink-0 w-[calc(50%-0.375rem)] xs:w-[calc(50%-0.5rem)] snap-start"
                            >
                              <GradientBorder containerClassName="relative h-full">
                                <FloatingCard className="group overflow-hidden h-full bg-background rounded-xl border-0 backdrop-blur-none shadow-none hover:shadow-none">
                                  <div className="relative overflow-hidden">
                                    <motion.img
                                      src={similarRoom.image}
                                      alt={similarRoom.name}
                                      className="w-full h-40 xs:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ duration: 0.3 }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                  </div>
                                  <CardContent className="p-3 xs:p-4">
                                    <h3 className="font-display font-semibold text-sm xs:text-base text-foreground mb-1.5 xs:mb-2 line-clamp-1">
                                      {similarRoom.name}
                                    </h3>
                                    <div className="flex items-baseline space-x-1.5 xs:space-x-2">
                                      <span className="text-base xs:text-lg font-bold text-primary">
                                        {similarRoom.price}₫
                                      </span>
                                      <span className="text-[10px] xs:text-xs text-muted-foreground">/đêm</span>
                                    </div>
                                  </CardContent>
                                </FloatingCard>
                              </GradientBorder>
                            </Link>
                          ))}
                        </div>
                        {/* Fade gradient indicator on the right */}
                        <div className="absolute top-0 right-0 bottom-4 w-16 xs:w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
                      </div>
                      {/* Desktop: Grid layout */}
                      <div className="hidden md:contents">
                        {similarRooms.map((similarRoom) => (
                          <Link key={similarRoom.id} href={`/rooms/${similarRoom.id}`}>
                            <GradientBorder containerClassName="relative h-full">
                              <FloatingCard className="group overflow-hidden h-full bg-background rounded-xl border-0 backdrop-blur-none shadow-none hover:shadow-none">
                                <div className="relative overflow-hidden">
                                  <motion.img
                                    src={similarRoom.image}
                                    alt={similarRoom.name}
                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-display font-semibold text-foreground mb-2 line-clamp-1">
                                    {similarRoom.name}
                                  </h3>
                                  <div className="flex items-baseline space-x-2">
                                    <span className="text-lg font-bold text-primary">
                                      {similarRoom.price}₫
                                    </span>
                                    <span className="text-xs text-muted-foreground">/đêm</span>
                                  </div>
                                </CardContent>
                              </FloatingCard>
                            </GradientBorder>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column - Sticky Booking Panel (Desktop Only) */}
              <div className="hidden lg:block lg:col-span-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="sticky top-20"
                >
                  <GradientBorder containerClassName="relative">
                    <FloatingCard className="bg-background rounded-xl border-0 backdrop-blur-none shadow-none">
                      <CardContent className="p-4 xl:p-6">
                        <div className="mb-5 xl:mb-6">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-2xl xl:text-3xl font-bold text-primary">
                              {room.price}₫
                            </span>
                            <span className="text-sm xl:text-base text-muted-foreground">/đêm</span>
                          </div>
                          {room.originalPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              {room.originalPrice}₫
                            </p>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="flex items-center gap-2 mb-2 text-sm">
                                <CalendarIcon className="w-4 h-4" />
                                Nhận phòng
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal text-sm",
                                      !checkIn && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {checkIn ? (
                                      format(checkIn, "dd/MM/yyyy", { locale: vi })
                                    ) : (
                                      <span>Chọn ngày</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={checkIn}
                                    onSelect={(date) => {
                                      setCheckIn(date);
                                      // Reset check-out if it's before check-in
                                      if (date && checkOut && checkOut <= date) {
                                        setCheckOut(undefined);
                                      }
                                    }}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <Label className="flex items-center gap-2 mb-2 text-sm">
                                <CalendarIcon className="w-4 h-4" />
                                Trả phòng
                              </Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal text-sm",
                                      !checkOut && "text-muted-foreground"
                                    )}
                                    disabled={!checkIn}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {checkOut ? (
                                      format(checkOut, "dd/MM/yyyy", { locale: vi })
                                    ) : (
                                      <span>Chọn ngày</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={checkOut}
                                    onSelect={(date) => setCheckOut(date)}
                                    disabled={(date) => {
                                      const today = new Date(new Date().setHours(0, 0, 0, 0));
                                      if (checkIn) {
                                        return date <= checkIn || date < today;
                                      }
                                      return date < today;
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="guests" className="flex items-center gap-2 mb-2 text-sm">
                              <Users className="w-4 h-4" />
                              Số khách
                            </Label>
                            <Select value={guests} onValueChange={setGuests}>
                              <SelectTrigger className="text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: room.guests }, (_, i) => i + 1).map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num} khách
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-3 pt-4 border-t">
                            <div>
                              <Label htmlFor="fullName" className="text-sm mb-2 block">
                                Họ và tên *
                              </Label>
                              <Input
                                id="fullName"
                                value={bookingData.fullName}
                                onChange={(e) =>
                                  setBookingData({ ...bookingData, fullName: e.target.value })
                                }
                                placeholder="Nhập họ tên"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email" className="text-sm mb-2 block">
                                Email *
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                value={bookingData.email}
                                onChange={(e) =>
                                  setBookingData({ ...bookingData, email: e.target.value })
                                }
                                placeholder="email@example.com"
                                className="text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone" className="flex items-center gap-2 text-sm mb-2">
                                <Phone className="w-4 h-4" />
                                Số điện thoại *
                              </Label>
                              <Input
                                id="phone"
                                value={bookingData.phone}
                                onChange={(e) =>
                                  setBookingData({ ...bookingData, phone: e.target.value })
                                }
                                placeholder="+84 123 456 789"
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <ShimmerButton
                            variant="luxury"
                            size="lg"
                            className="w-full mt-6"
                            onClick={handleBooking}
                          >
                            Đặt Phòng Ngay
                          </ShimmerButton>

                          <div className="text-center pt-4 border-t">
                            <p className="text-sm text-muted-foreground mb-2">
                              Hoặc gọi trực tiếp
                            </p>
                            <Button variant="outline" size="sm" className="w-full gap-2">
                              <Phone className="w-4 h-4" />
                              +84 123 456 789
                            </Button>
                          </div>
                        </div>
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

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-3 xs:p-4 sm:p-6"
          onClick={closeLightbox}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={roomGalleryImages[selectedImageIndex]}
              alt={`${room.name} - Hình ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 xs:top-3 xs:right-3 sm:top-4 sm:right-4 text-white hover:bg-white/20 bg-black/50 h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10"
              onClick={closeLightbox}
            >
              <X className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
            </Button>

            {/* Navigation */}
            {roomGalleryImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 xs:left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 xs:right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/50 h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
                </Button>

                {/* Image Counter */}
                <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm">
                  {selectedImageIndex + 1} / {roomGalleryImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailPage;

