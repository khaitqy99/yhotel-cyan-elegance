import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RoomsSection from "@/components/RoomsSection";
import ServicesSection from "@/components/ServicesSection";
import GallerySection from "@/components/GallerySection";
import BlogSection from "@/components/BlogSection";
import BookingSection from "@/components/BookingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <RoomsSection />
        <ServicesSection />
        <GallerySection />
        <BlogSection />
        <BookingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
