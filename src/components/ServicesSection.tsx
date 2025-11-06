"use client";

import { Wifi, Car, Coffee, Dumbbell, Utensils, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { Marquee } from "@/registry/magicui/marquee";

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

  const ServiceCard = ({
    icon: Icon,
    title,
    description,
  }: {
    icon: React.ElementType;
    title: string;
    description: string;
  }) => {
    return (
      <figure
        className={cn(
          "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
          // light styles
          "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
          // dark styles
          "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-primary-foreground" />
          </div>
          <figcaption className="text-sm font-medium dark:text-white mb-2">
            {title}
          </figcaption>
          <blockquote className="text-xs text-muted-foreground">{description}</blockquote>
        </div>
      </figure>
    );
  };

  return (
    <section id="services" className="py-20 bg-gradient-subtle">
      <div className="container-luxury">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-black mb-6">
            Dịch Vụ Tiện Ích
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Trải nghiệm dịch vụ 5 sao với đầy đủ tiện nghi hiện đại
          </p>
        </div>
      </div>

      <div className="relative w-full flex flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:20s]">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </Marquee>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
      </div>
    </section>
  );
};

export default ServicesSection;