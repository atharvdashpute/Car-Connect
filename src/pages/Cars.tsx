import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, Grid3x3, List } from "lucide-react";
import { useState, useMemo } from "react";
import suvImage from "@/assets/suv-1.jpg";
import sedanImage from "@/assets/sedan-1.jpg";
import sportsImage from "@/assets/sports-1.jpg";
import { formatPrice, convertUSDtoINR } from "@/utils/currency";

interface Car {
  id: string;
  title: string;
  price: number;
  image: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
}

const Cars = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [sortBy, setSortBy] = useState("newest");

  const carsData: Car[] = [
    { id: "1", title: "BMW X5 M Sport", price: convertUSDtoINR(68900), image: suvImage, year: "2023", mileage: "12,500 km", fuel: "Hybrid", transmission: "Automatic" },
    { id: "2", title: "Tesla Model S Plaid", price: convertUSDtoINR(89990), image: sedanImage, year: "2024", mileage: "5,200 km", fuel: "Electric", transmission: "Automatic" },
    { id: "3", title: "Porsche 911 Carrera", price: convertUSDtoINR(115000), image: sportsImage, year: "2023", mileage: "8,900 km", fuel: "Petrol", transmission: "Manual" },
    { id: "4", title: "Mercedes-Benz GLE", price: convertUSDtoINR(72500), image: suvImage, year: "2023", mileage: "15,800 km", fuel: "Diesel", transmission: "Automatic" },
    { id: "5", title: "Audi e-tron GT", price: convertUSDtoINR(104900), image: sedanImage, year: "2024", mileage: "3,200 km", fuel: "Electric", transmission: "Automatic" },
    { id: "6", title: "BMW M4 Competition", price: convertUSDtoINR(78800), image: sportsImage, year: "2023", mileage: "9,500 km", fuel: "Petrol", transmission: "Automatic" },
    { id: "7", title: "Toyota Fortuner Legender", price: convertUSDtoINR(45000), image: suvImage, year: "2024", mileage: "2,100 km", fuel: "Diesel", transmission: "Automatic" },
    { id: "8", title: "Honda City Hybrid", price: convertUSDtoINR(22000), image: sedanImage, year: "2024", mileage: "1,500 km", fuel: "Hybrid", transmission: "Automatic" },
    { id: "9", title: "Hyundai Creta", price: convertUSDtoINR(18000), image: suvImage, year: "2023", mileage: "8,200 km", fuel: "Petrol", transmission: "Manual" },
    { id: "10", title: "Maruti Suzuki Swift", price: convertUSDtoINR(8000), image: sedanImage, year: "2023", mileage: "12,000 km", fuel: "Petrol", transmission: "Manual" },
    { id: "11", title: "Mahindra Thar", price: convertUSDtoINR(15000), image: suvImage, year: "2024", mileage: "3,500 km", fuel: "Diesel", transmission: "Manual" },
    { id: "12", title: "Tata Nexon EV", price: convertUSDtoINR(20000), image: sedanImage, year: "2024", mileage: "5,000 km", fuel: "Electric", transmission: "Automatic" },
  ];

  const sortedCars = useMemo(() => {
    let sorted = [...carsData];
    
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "mileage":
        sorted.sort((a, b) => {
          const mileageA = parseInt(a.mileage.replace(/[^0-9]/g, ""));
          const mileageB = parseInt(b.mileage.replace(/[^0-9]/g, ""));
          return mileageA - mileageB;
        });
        break;
      default: // newest
        sorted.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    }
    
    return sorted;
  }, [sortBy]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 space-y-6">
            <Card className="p-6 space-y-6 glass-card">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search cars..." className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Brands" />
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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Price Range</label>
                <Slider
                  defaultValue={[0, 10000000]}
                  max={10000000}
                  step={100000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="cng">CNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Body Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Transmission</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full">Reset Filters</Button>
            </Card>
          </aside>

          {/* Car Listings */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{sortedCars.length}</span> cars found
              </p>

              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="mileage">Lowest Mileage</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
              {sortedCars.map((car) => (
                <CarCard
                  key={car.id}
                  {...car}
                  price={formatPrice(car.price)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cars;