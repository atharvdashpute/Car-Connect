import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Phone, Mail, MapPin, Fuel, Gauge, Calendar, Settings, Users, Zap } from "lucide-react";
import { useParams } from "react-router-dom";
import suvImage from "@/assets/suv-1.jpg";
import CarCard from "@/components/CarCard";
import sedanImage from "@/assets/sedan-1.jpg";
import sportsImage from "@/assets/sports-1.jpg";

const CarDetail = () => {
  const { id } = useParams();

  const similarCars = [
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
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <img 
                src={suvImage} 
                alt="BMW X5 M Sport"
                className="w-full h-[400px] object-cover"
              />
            </Card>

            {/* Car Details */}
            <Card className="p-6 glass-card">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="mb-3 bg-accent text-accent-foreground">Featured</Badge>
                    <h1 className="text-3xl font-bold mb-2">BMW X5 M Sport</h1>
                    <p className="text-4xl font-bold text-primary">$68,900</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Key Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year</p>
                      <p className="font-semibold">2023</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Gauge className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Mileage</p>
                      <p className="font-semibold">12,500 mi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Fuel className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel</p>
                      <p className="font-semibold">Hybrid</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <Settings className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Transmission</p>
                      <p className="font-semibold">Automatic</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Experience luxury and performance with this stunning BMW X5 M Sport. This premium SUV combines 
                    powerful hybrid technology with elegant design and cutting-edge features. Meticulously maintained 
                    with full service history. Perfect for both city driving and long journeys.
                  </p>
                </div>

                {/* Specifications */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Engine</span>
                      <span className="font-medium">3.0L Inline-6 Turbo</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Power</span>
                      <span className="font-medium">523 hp</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Drivetrain</span>
                      <span className="font-medium">AWD</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Seats</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Color</span>
                      <span className="font-medium">Mineral White</span>
                    </div>
                    <div className="flex justify-between py-3 border-b">
                      <span className="text-muted-foreground">Body Type</span>
                      <span className="font-medium">SUV</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Key Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      "Leather Interior",
                      "Panoramic Sunroof",
                      "Navigation System",
                      "Parking Sensors",
                      "Heated Seats",
                      "Bluetooth",
                      "Backup Camera",
                      "Cruise Control",
                      "Premium Sound System"
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="p-6 glass-card space-y-4">
              <h3 className="font-semibold text-lg">Contact Seller</h3>
              
              <Button className="w-full btn-primary" size="lg">
                <Phone className="mr-2 h-5 w-5" />
                Call Seller
              </Button>
              
              <Button variant="outline" className="w-full" size="lg">
                <Mail className="mr-2 h-5 w-5" />
                Send Message
              </Button>

              <Button variant="secondary" className="w-full" size="lg">
                Book Test Drive
              </Button>

              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>New York, NY</span>
                </div>
              </div>
            </Card>

            {/* EMI Calculator */}
            <Card className="p-6 glass-card">
              <h3 className="font-semibold text-lg mb-4">EMI Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Monthly Payment</label>
                  <p className="text-2xl font-bold text-primary">$1,247/mo</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on 60 months at 5.9% APR</p>
                </div>
                <Button variant="outline" className="w-full">
                  Calculate Custom EMI
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Similar Cars */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Similar Cars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCars.map((car) => (
              <CarCard key={car.id} {...car} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CarDetail;
