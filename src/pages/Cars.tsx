import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarCard from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, Grid3x3, List } from "lucide-react";
import { useState } from "react";
import suvImage from "@/assets/suv-1.jpg";
import sedanImage from "@/assets/sedan-1.jpg";
import sportsImage from "@/assets/sports-1.jpg";

const Cars = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([0, 200000]);

  const cars = [
    {
      id: "1",
      title: "BMW X5 M Sport",
      price: "$68,900",
      image: suvImage,
      year: "2023",
      mileage: "12,500 mi",
      fuel: "Hybrid",
      transmission: "Automatic",
    },
    {
      id: "2",
      title: "Tesla Model S Plaid",
      price: "$89,990",
      image: sedanImage,
      year: "2024",
      mileage: "5,200 mi",
      fuel: "Electric",
      transmission: "Automatic",
    },
    {
      id: "3",
      title: "Porsche 911 Carrera",
      price: "$115,000",
      image: sportsImage,
      year: "2023",
      mileage: "8,900 mi",
      fuel: "Petrol",
      transmission: "Manual",
    },
    {
      id: "4",
      title: "Mercedes-Benz GLE",
      price: "$72,500",
      image: suvImage,
      year: "2023",
      mileage: "15,800 mi",
      fuel: "Diesel",
      transmission: "Automatic",
    },
    {
      id: "5",
      title: "Audi e-tron GT",
      price: "$104,900",
      image: sedanImage,
      year: "2024",
      mileage: "3,200 mi",
      fuel: "Electric",
      transmission: "Automatic",
    },
    {
      id: "6",
      title: "BMW M4 Competition",
      price: "$78,800",
      image: sportsImage,
      year: "2023",
      mileage: "9,500 mi",
      fuel: "Petrol",
      transmission: "Automatic",
    },
  ];

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
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
                </label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={200000}
                  step={5000}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fuel Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Body Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="coupe">Coupe</SelectItem>
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

              <Button variant="outline" className="w-full">
                Reset Filters
              </Button>
            </Card>
          </aside>

          {/* Car Listings */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Available Cars</h1>
                <p className="text-muted-foreground">{cars.length} vehicles found</p>
              </div>

              <div className="flex items-center gap-4">
                <Select defaultValue="newest">
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

            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {cars.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cars;
