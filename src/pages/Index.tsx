import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedCars from "@/components/FeaturedCars";
import Services from "@/components/Services";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedCars />
      <div id="services">
        <Services />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
