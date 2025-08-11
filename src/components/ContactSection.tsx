import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Điện Thoại",
      details: ["+84 123 456 789", "+84 987 654 321"],
      description: "Hotline 24/7"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@yhotel.com", "booking@yhotel.com"],
      description: "Phản hồi trong 2 giờ"
    },
    {
      icon: MapPin,
      title: "Địa Chỉ",
      details: ["123 Đường ABC, Quận 1", "Thành Phố Hồ Chí Minh"],
      description: "Trung tâm thành phố"
    },
    {
      icon: Clock,
      title: "Giờ Làm Việc",
      details: ["Lễ tân: 24/7", "Nhà hàng: 6:00 - 23:00"],
      description: "Phục vụ không ngừng nghỉ"
    }
  ];

  return (
    <section id="contact" className="section-padding bg-secondary/30">
      <div className="container-luxury">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Liên Hệ <span className="text-gradient">Với Chúng Tôi</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Đội ngũ chuyên viên của Y Hotel luôn sẵn sàng hỗ trợ và tư vấn để đem đến 
            trải nghiệm hoàn hảo nhất cho quý khách.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover-lift border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-primary rounded-lg text-primary-foreground">
                      <info.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">
                            {detail}
                          </p>
                        ))}
                      </div>
                      <p className="text-xs text-primary font-medium mt-2">
                        {info.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-luxury">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-foreground">
                  Gửi Tin Nhắn
                </CardTitle>
                <p className="text-muted-foreground">
                  Để lại thông tin và chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Họ và Tên *
                    </label>
                    <Input 
                      placeholder="Nhập họ và tên"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Số Điện Thoại *
                    </label>
                    <Input 
                      placeholder="Nhập số điện thoại"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email *
                  </label>
                  <Input 
                    type="email"
                    placeholder="Nhập địa chỉ email"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Chủ Đề
                  </label>
                  <Input 
                    placeholder="Chủ đề tin nhắn"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nội Dung *
                  </label>
                  <Textarea 
                    placeholder="Nhập nội dung tin nhắn..."
                    rows={5}
                    className="bg-background resize-none"
                  />
                </div>

                <Button variant="luxury" size="lg" className="w-full">
                  <Send className="w-5 h-5 mr-2" />
                  Gửi Tin Nhắn
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  * Trường thông tin bắt buộc. Chúng tôi cam kết bảo mật thông tin của bạn.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <Card className="mt-12 overflow-hidden shadow-luxury">
          <div className="aspect-video bg-muted relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <MapPin className="w-12 h-12 text-primary mx-auto" />
                <div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    Vị Trí Y Hotel
                  </h3>
                  <p className="text-muted-foreground">
                    123 Đường ABC, Quận 1, Thành Phố Hồ Chí Minh
                  </p>
                  <Button variant="outline" className="mt-4">
                    Xem Bản Đồ Chi Tiết
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;