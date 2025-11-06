"use client";

import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useScrollThreshold } from "@/hooks/use-scroll";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isScrolled = useScrollThreshold(20);

  const navItems = [
    { name: "Trang Chủ", href: "/" },
    { name: "Tất Cả Phòng & Suites", href: "/rooms" },
    { name: "Chi Tiết Đặt Phòng", href: "/booking" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-slate-900/95 backdrop-blur-lg shadow-card" : "bg-slate-900/80"
    }`}>
      <div className="container-luxury">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Y Hotel Logo"
              width={180}
              height={60}
              className="h-12 w-auto md:h-16 lg:h-20 drop-shadow-2xl"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          {navItems.length > 0 && (
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-primary transition-colors duration-300 font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-300">
              <Phone className="w-4 h-4" />
              <span>+84 123 456 789</span>
            </div>
            <Button variant="luxury" size="sm">
              Đặt Phòng
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-700">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-white hover:text-primary transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className={navItems.length > 0 ? "pt-4 border-t border-slate-700" : ""}>
                <div className="flex items-center space-x-2 text-sm text-slate-300 mb-4">
                  <Phone className="w-4 h-4" />
                  <span>+84 123 456 789</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-300 mb-4">
                  <Mail className="w-4 h-4" />
                  <span>info@yhotel.com</span>
                </div>
                <Button variant="luxury" className="w-full">
                  Đặt Phòng Ngay
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;