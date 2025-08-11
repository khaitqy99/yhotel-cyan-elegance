import { Wifi, Car, Coffee, Dumbbell, Utensils, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ServicesSection = () => {
  const services = [
    {
      icon: Wifi,
      title: "WiFi Miễn Phí",
      description: "Kết nối internet tốc độ cao trong toàn bộ khách sạn"
    },
    {
      icon: Car,
      title: "Bãi Đỗ Xe",
      description: "Bãi đỗ xe rộng rãi, an toàn cho khách hàng"
    },
    {
      icon: Coffee,
      title: "Phòng Ăn Sáng",
      description: "Buffet sáng phong phú với món ăn Á-Âu"
    },
    {
      icon: Dumbbell,
      title: "Phòng Gym",
      description: "Trang thiết bị hiện đại, mở cửa 24/7"
    },
    {
      icon: Utensils,
      title: "Nhà Hàng",
      description: "Ẩm thực cao cấp với đầu bếp chuyên nghiệp"
    },
    {
      icon: Waves,
      title: "Hồ Bơi",
      description: "Hồ bơi trong nhà với view tuyệt đẹp"
    }
  ];

  return (
    <section id="services" className="py-20 bg-section-gradient">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gradient mb-6">
            Dịch Vụ Tiện Ích
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Trải nghiệm dịch vụ 5 sao với đầy đủ tiện nghi hiện đại
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="service-card group cursor-pointer border-0 bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all duration-500"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="luxury" size="lg" className="text-lg px-8 py-3">
            Xem Tất Cả Dịch Vụ
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;