import { useState } from "react";
import { Calendar, Users, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const BookingSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    adults: "1",
    children: "0",
    roomType: "",
    fullName: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  const roomTypes = [
    { value: "standard", label: "Phòng Standard - 1,500,000đ/đêm", price: "1,500,000" },
    { value: "deluxe", label: "Phòng Deluxe - 2,200,000đ/đêm", price: "2,200,000" },
    { value: "suite", label: "Phòng Suite - 3,500,000đ/đêm", price: "3,500,000" },
    { value: "presidential", label: "Phòng Presidential - 5,000,000đ/đêm", price: "5,000,000" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.checkIn || !formData.checkOut || !formData.roomType || !formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // For now, just show success message
    toast({
      title: "Đặt phòng thành công!",
      description: "Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận đặt phòng.",
    });

    // Reset form
    setFormData({
      checkIn: "",
      checkOut: "",
      adults: "1", 
      children: "0",
      roomType: "",
      fullName: "",
      email: "",
      phone: "",
      specialRequests: ""
    });
  };

  return (
    <section className="py-20 bg-section-gradient">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-6">
            Đặt Phòng Trực Tuyến
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Đặt phòng nhanh chóng và tiện lợi với hệ thống trực tuyến của Y Hotel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-display">Thông Tin Đặt Phòng</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Check-in & Check-out */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="checkIn" className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" />
                        Ngày nhận phòng *
                      </Label>
                      <Input
                        id="checkIn"
                        type="date"
                        value={formData.checkIn}
                        onChange={(e) => handleInputChange("checkIn", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkOut" className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4" />
                        Ngày trả phòng *
                      </Label>
                      <Input
                        id="checkOut"
                        type="date"
                        value={formData.checkOut}
                        onChange={(e) => handleInputChange("checkOut", e.target.value)}
                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adults" className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4" />
                        Người lớn
                      </Label>
                      <Select value={formData.adults} onValueChange={(value) => handleInputChange("adults", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num} người</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="children" className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4" />
                        Trẻ em
                      </Label>
                      <Select value={formData.children} onValueChange={(value) => handleInputChange("children", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0,1,2,3,4].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num} trẻ</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Room Type */}
                  <div>
                    <Label htmlFor="roomType" className="mb-2 block">Loại phòng *</Label>
                    <Select value={formData.roomType} onValueChange={(value) => handleInputChange("roomType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại phòng" />
                      </SelectTrigger>
                      <SelectContent>
                        {roomTypes.map(room => (
                          <SelectItem key={room.value} value={room.value}>{room.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName" className="mb-2 block">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-2 block">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4" />
                      Số điện thoại *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+84 123 456 789"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="specialRequests" className="mb-2 block">Yêu cầu đặc biệt</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                      placeholder="Ví dụ: Giường đôi, tầng cao, view biển..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" variant="luxury" size="lg" className="w-full text-lg py-3">
                    Đặt Phòng Ngay
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary & Contact */}
          <div className="space-y-8">
            {/* Quick Contact */}
            <Card className="border-0 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-display">Liên Hệ Trực Tiếp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Hotline 24/7</p>
                    <p className="text-primary">+84 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Địa chỉ</p>
                    <p className="text-muted-foreground text-sm">123 Đường ABC, Quận 1, TP.HCM</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Gọi Ngay
                </Button>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card className="border-0 bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-display">Chính Sách Khách Sạn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Thời gian nhận/trả phòng:</p>
                  <p className="text-muted-foreground">Nhận phòng: 14:00 | Trả phòng: 12:00</p>
                </div>
                <div>
                  <p className="font-medium">Chính sách hủy:</p>
                  <p className="text-muted-foreground">Miễn phí hủy trước 24h</p>
                </div>
                <div>
                  <p className="font-medium">Thanh toán:</p>
                  <p className="text-muted-foreground">Tiền mặt, thẻ tín dụng, chuyển khoản</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;