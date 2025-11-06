"use client";

import { Bed, Wifi, Car, Coffee, Bath, Users } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { FloatingCard } from "@/components/ui/floating-card";
import { GradientBorder } from "@/components/ui/gradient-border";
import { rooms } from "@/data/rooms";

const RoomsSection = () => {
  // Show only first 4 rooms on homepage
  const displayRooms = rooms.slice(0, 4);

  return (
    <section id="rooms" className="section-padding bg-gradient-subtle">
      <div className="container-luxury">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground mb-6">
            Phòng & Suites
          </h2>
          <p className="text-base text-muted-foreground max-w-3xl mx-auto">
            Khám phá không gian nghỉ ngơi đẳng cấp với thiết kế hiện đại, tiện nghi cao cấp 
            và dịch vụ tận tâm. Mỗi phòng đều được chăm chút tỉ mỉ để mang đến sự thoải mái tối đa.
          </p>
        </motion.div>

        {/* Room Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {displayRooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Link href={`/rooms/${room.id}`} className="block h-full">
                <GradientBorder 
                  containerClassName="relative h-full"
                >
                  <FloatingCard 
                    className="group overflow-hidden h-full bg-background rounded-xl border-0 backdrop-blur-none shadow-none hover:shadow-lg transition-shadow cursor-pointer"
                    delay={index * 0.1}
                  >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={room.image}
                      alt={`Phòng ${room.name} tại Y Hotel - ${room.size} với view đẹp và tiện nghi cao cấp`}
                      className="w-full h-40 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.15 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Quick Info Overlay - Hidden on mobile */}
                    <motion.div 
                      className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-white hidden md:block"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Bed className="w-4 h-4" />
                          <span>{room.size}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{room.guests} khách</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Mobile: Simple info overlay */}
                    <div className="absolute bottom-1 left-1 md:hidden text-white">
                      <div className="flex items-center space-x-2 text-xs">
                        <Users className="w-3 h-3" />
                        <span>{room.guests}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-3 md:p-6">
                    {/* Room Name & Price */}
                    <motion.div 
                      className="mb-2 md:mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.35 + (index * 0.05) }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <h3 className="text-sm md:text-lg font-display font-semibold text-foreground mb-1 md:mb-2 line-clamp-1 md:line-clamp-2 overflow-hidden text-ellipsis">
                        {room.name}
                      </h3>
                      <div className="flex items-baseline space-x-1 md:space-x-2">
                        <span className="text-base md:text-xl font-bold text-primary">
                          {room.price}₫
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground">
                          /đêm
                        </span>
                      </div>
                    </motion.div>

                    {/* Features - Hidden on mobile */}
                    <motion.div 
                      className="mb-2 md:mb-4 hidden md:block"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      <ul className="space-y-1">
                        {room.features.slice(0, 3).map((feature, idx) => (
                          <motion.li 
                            key={idx} 
                            className="text-sm text-muted-foreground flex items-center"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: 0.45 + (index * 0.05) + (idx * 0.05) }}
                            viewport={{ once: true, margin: "-30px" }}
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>

                    {/* Actions */}
                    <motion.div 
                      className="flex space-x-1 md:space-x-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + (index * 0.05) }}
                      viewport={{ once: true, margin: "-50px" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex-1">
                        <ShimmerButton variant="luxury" size="sm" className="w-full text-xs md:text-sm px-2 md:px-4 py-1.5 md:py-2">
                          Đặt Ngay
                        </ShimmerButton>
                      </div>
                    </motion.div>
                  </CardContent>
                </FloatingCard>
              </GradientBorder>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Link href="/rooms">
            <ShimmerButton variant="luxury" size="lg" className="px-8">
              Xem Tất Cả Phòng
            </ShimmerButton>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RoomsSection;