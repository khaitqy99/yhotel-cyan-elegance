"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Bed, Users, Search, Grid3x3, List, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FloatingCard } from "@/components/ui/floating-card";
import { GradientBorder } from "@/components/ui/gradient-border";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { rooms } from "@/data/rooms";
import { heroImage } from "@/assets/images";

type ViewMode = "grid" | "list";
type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc" | "popular";

const RoomsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [maxGuests, setMaxGuests] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("popular");

  // Filter and sort rooms
  const filteredRooms = useMemo(() => {
    let filtered = [...rooms];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((room) => room.category === selectedCategory);
    }

    // Guests filter
    if (maxGuests !== "all") {
      const guests = parseInt(maxGuests);
      filtered = filtered.filter((room) => room.guests >= guests);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return parseInt(a.price.replace(/,/g, "")) - parseInt(b.price.replace(/,/g, ""));
        case "price-desc":
          return parseInt(b.price.replace(/,/g, "")) - parseInt(a.price.replace(/,/g, ""));
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "popular":
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return 0;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, maxGuests, sortBy]);

  const categories = [
    { value: "all", label: "Tất cả" },
    { value: "standard", label: "Standard" },
    { value: "deluxe", label: "Deluxe" },
    { value: "suite", label: "Suite" },
    { value: "family", label: "Family" },
  ];

  const getCategoryLabel = (category: string) => {
    return categories.find((c) => c.value === category)?.label || category;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setMaxGuests("all");
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || maxGuests !== "all";

  return (
    <div className="min-h-screen bg-luxury-gradient">
      <Navigation />
      <main className="pt-14 lg:pt-16">
        {/* Hero Section */}
        <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <div className="absolute inset-0">
            <motion.img
              src={heroImage}
              alt="Y Hotel Rooms"
              className="w-full h-full object-cover"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />
          </div>
          
          <div className="relative h-full flex items-end">
            <div className="container-luxury w-full pb-8 md:pb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
                  Phòng & Suites
                </h1>
                <p className="text-base md:text-lg text-white/90 max-w-2xl">
                  Khám phá không gian nghỉ ngơi đẳng cấp với thiết kế hiện đại, tiện nghi cao cấp
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filters & Search Section */}
        <section className="sticky top-14 lg:top-16 z-30 bg-background/95 backdrop-blur-sm border-b shadow-sm">
          <div className="container-luxury py-4 md:py-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm phòng, tiện nghi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                />
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[180px] h-10">
                    <SelectValue placeholder="Loại phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Guests Filter */}
                <Select value={maxGuests} onValueChange={setMaxGuests}>
                  <SelectTrigger className="w-full sm:w-[160px] h-10">
                    <SelectValue placeholder="Số khách" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="2">2 khách</SelectItem>
                    <SelectItem value="3">3 khách</SelectItem>
                    <SelectItem value="4">4 khách</SelectItem>
                    <SelectItem value="5">5+ khách</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full sm:w-[180px] h-10">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Phổ biến</SelectItem>
                    <SelectItem value="price-asc">Giá: Thấp → Cao</SelectItem>
                    <SelectItem value="price-desc">Giá: Cao → Thấp</SelectItem>
                    <SelectItem value="name-asc">Tên: A → Z</SelectItem>
                    <SelectItem value="name-desc">Tên: Z → A</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Toggle */}
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-10 w-10"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-10 w-10"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-10 gap-2"
                  >
                    <X className="w-4 h-4" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Tìm thấy <strong className="text-foreground">{filteredRooms.length}</strong> phòng
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Rooms Grid/List */}
        <section className="py-8 md:py-12 bg-gradient-subtle">
          <div className="container-luxury">
            {filteredRooms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Không tìm thấy phòng</h3>
                  <p className="text-muted-foreground mb-6">
                    Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              </motion.div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredRooms.map((room, index) => (
                    <motion.div
                      key={room.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <Link href={`/rooms/${room.id}`}>
                        <GradientBorder containerClassName="relative h-full">
                          <FloatingCard
                            className="group overflow-hidden h-full bg-background rounded-xl border-0 backdrop-blur-none shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer"
                            delay={index * 0.03}
                          >
                            {/* Image */}
                            <div className="relative overflow-hidden aspect-[4/3]">
                              <motion.img
                                src={room.image}
                                alt={`Phòng ${room.name} tại Y Hotel`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                whileHover={{ scale: 1.05 }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              
                              {/* Badges */}
                              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-1 sm:gap-2">
                                {room.popular && (
                                  <Badge className="bg-primary text-white shadow-lg text-xs px-1.5 py-0.5 sm:text-sm sm:px-2 sm:py-1">
                                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 fill-white" />
                                    <span className="hidden sm:inline">Phổ Biến</span>
                                    <span className="sm:hidden">Hot</span>
                                  </Badge>
                                )}
                                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs px-1.5 py-0.5 sm:text-sm sm:px-2 sm:py-1">
                                  {getCategoryLabel(room.category)}
                                </Badge>
                              </div>

                              {/* Quick Info */}
                              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 text-white">
                                <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium">
                                  <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                                    <Bed className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="hidden sm:inline">{room.size}</span>
                                  </div>
                                  <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>{room.guests}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <CardContent className="p-2 sm:p-4 md:p-6">
                              {/* Room Name & Price */}
                              <div className="mb-2 sm:mb-4">
                                <h3 className="text-sm sm:text-lg md:text-xl font-display font-semibold text-foreground mb-1 sm:mb-2 line-clamp-2">
                                  {room.name}
                                </h3>
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                  <div className="flex items-baseline gap-1 sm:gap-2">
                                    <span className="text-lg sm:text-2xl md:text-3xl font-bold text-primary">
                                      {room.price}₫
                                    </span>
                                    <span className="text-xs sm:text-sm text-muted-foreground">/đêm</span>
                                  </div>
                                  {room.originalPrice && (
                                    <span className="text-xs sm:text-sm text-muted-foreground line-through">
                                      {room.originalPrice}₫
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Features - Hidden on mobile */}
                              <div className="mb-2 sm:mb-4 hidden sm:block">
                                <ul className="space-y-1.5">
                                  {room.features.slice(0, 3).map((feature, idx) => (
                                    <li
                                      key={idx}
                                      className="text-sm text-muted-foreground flex items-start"
                                    >
                                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-1.5 flex-shrink-0" />
                                      <span className="line-clamp-1">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Action Button */}
                              <ShimmerButton
                                variant="luxury"
                                size="sm"
                                className="w-full text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.location.href = `/rooms/${room.id}`;
                                }}
                              >
                                Xem Chi Tiết
                              </ShimmerButton>
                            </CardContent>
                          </FloatingCard>
                        </GradientBorder>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filteredRooms.map((room, index) => (
                    <motion.div
                      key={room.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Link href={`/rooms/${room.id}`}>
                        <GradientBorder containerClassName="relative">
                          <FloatingCard
                            className="group overflow-hidden bg-background rounded-xl border-0 backdrop-blur-none shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer"
                            delay={index * 0.05}
                          >
                            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                              {/* Image */}
                              <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0 overflow-hidden rounded-lg">
                                <motion.img
                                  src={room.image}
                                  alt={`Phòng ${room.name} tại Y Hotel`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  whileHover={{ scale: 1.05 }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                {/* Badges */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                  {room.popular && (
                                    <Badge className="bg-primary text-white shadow-lg">
                                      <Star className="w-3 h-3 mr-1 fill-white" />
                                      Phổ Biến
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Content */}
                              <CardContent className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="secondary">
                                          {getCategoryLabel(room.category)}
                                        </Badge>
                                      </div>
                                      <h3 className="text-xl md:text-2xl font-display font-semibold text-foreground mb-2">
                                        {room.name}
                                      </h3>
                                    </div>
                                    <div className="text-right">
                                      <div className="flex items-baseline gap-2">
                                        <span className="text-2xl md:text-3xl font-bold text-primary">
                                          {room.price}₫
                                        </span>
                                        <span className="text-sm text-muted-foreground">/đêm</span>
                                      </div>
                                      {room.originalPrice && (
                                        <span className="text-sm text-muted-foreground line-through block">
                                          {room.originalPrice}₫
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Quick Info */}
                                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                      <Bed className="w-4 h-4" />
                                      <span>{room.size}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Users className="w-4 h-4" />
                                      <span>{room.guests} khách</span>
                                    </div>
                                  </div>

                                  {/* Features */}
                                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                                    {room.features.map((feature, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-muted-foreground flex items-center"
                                      >
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Action Button */}
                                <div className="flex gap-3">
                                  <ShimmerButton
                                    variant="luxury"
                                    size="default"
                                    className="flex-1"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.location.href = `/rooms/${room.id}`;
                                    }}
                                  >
                                    Xem Chi Tiết
                                  </ShimmerButton>
                                </div>
                              </CardContent>
                            </div>
                          </FloatingCard>
                        </GradientBorder>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RoomsPage;

