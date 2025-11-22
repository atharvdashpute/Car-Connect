import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-car.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const [brand, setBrand] = useState("");
  const [budget, setBudget] = useState("");
  const [fuelType, setFuelType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand && brand !== "all") params.append("brand", brand);
    if (fuelType && fuelType !== "all") params.append("fuelType", fuelType);
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
      </div>
      
      <div className="container relative mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your
              <span className="gradient-text"> Dream Car</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Discover the perfect vehicle from our premium collection of new and certified pre-owned cars
            </p>
          </div>

          {/* Search Bar */}
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                  <SelectItem value="audi">Audi</SelectItem>
                  <SelectItem value="tesla">Tesla</SelectItem>
                  <SelectItem value="porsche">Porsche</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="hyundai">Hyundai</SelectItem>
                  <SelectItem value="maruti">Maruti Suzuki</SelectItem>
                  <SelectItem value="mahindra">Mahindra</SelectItem>
                  <SelectItem value="tata">Tata</SelectItem>
                  <SelectItem value="kia">Kia</SelectItem>
                </SelectContent>
              </Select>

              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20k">Under ₹20 Lakhs</SelectItem>
                  <SelectItem value="50k">₹20-50 Lakhs</SelectItem>
                  <SelectItem value="100k">₹50 Lakhs - ₹1 Crore</SelectItem>
                  <SelectItem value="100k+">Above ₹1 Crore</SelectItem>
                </SelectContent>
              </Select>

              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger>
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fuel Types</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="cng">CNG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full btn-primary" size="lg" onClick={handleSearch}>
              <Search className="mr-2 h-5 w-5" />
              Search Cars
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
