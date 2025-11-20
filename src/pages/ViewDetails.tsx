import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatINR = (value: number | string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    Number(String(value).replace(/[^\d.-]/g, "")) || 0
  );

const CALL_NUMBER = "+918847784496";

const ViewDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [car, setCar] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [emi, setEmi] = useState({ principal: 0, years: 5, rate: 9.5, monthly: 0 });
  const [message, setMessage] = useState("");
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  useEffect(() => {
    // Mock car data - in production, fetch from API
    const mockCar = {
      id: id,
      name: "BMW X5 M Sport",
      price: 6890000,
      image: "https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg",
      location: "Mumbai, India",
      specs: { hp: "523 HP", seats: 5, transmission: "Automatic" },
      fuel: "Hybrid",
      description: "Luxurious SUV with powerful performance and premium features. This BMW X5 M Sport offers an exceptional driving experience with cutting-edge technology.",
      sellerName: "Premium Motors",
      sellerLocation: "Mumbai",
    };
    
    setCar(mockCar);
    setEmi((e) => ({ ...e, principal: mockCar.price }));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    const P = Number(emi.principal) || 0;
    const annualRate = Number(emi.rate) / 100;
    const n = Number(emi.years) * 12;
    if (P <= 0 || n === 0) {
      setEmi((prev) => ({ ...prev, monthly: 0 }));
      return;
    }
    const r = annualRate / 12;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi((prev) => ({ ...prev, monthly: Math.round(monthly) }));
  }, [emi.principal, emi.years, emi.rate]);

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">Loading...</div>
      <Footer />
    </div>
  );
  
  if (!car) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">Car not found</div>
      <Footer />
    </div>
  );

  function handleSendMessage() {
    alert("Message sent to seller!");
    setMessage("");
  }

  async function handlePayment() {
    alert("Payment gateway integration coming soon!");
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <img src={car.image} alt={car.name} className="w-full h-64 md:h-96 object-cover" />
            </Card>

            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Badge className="mb-3">Featured</Badge>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{car.name}</h1>
                  <p className="text-2xl md:text-3xl font-bold text-primary">{formatINR(car.price)}</p>
                  <p className="text-muted-foreground mt-2">{car.location}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Horsepower</p>
                    <p className="font-semibold">{car.specs?.hp ?? "—"}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Seats</p>
                    <p className="font-semibold">{car.specs?.seats ?? "—"}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Transmission</p>
                    <p className="font-semibold">{car.specs?.transmission ?? "—"}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Fuel</p>
                    <p className="font-semibold">{car.fuel ?? "—"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{car.description}</p>
                </div>

                {/* EMI Calculator */}
                <Card className="p-6 bg-muted/50">
                  <h4 className="font-semibold text-lg mb-4">EMI Calculator</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Loan Amount (₹)</label>
                      <Input
                        type="number"
                        value={emi.principal}
                        onChange={(e) => setEmi((s) => ({ ...s, principal: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Tenure (years)</label>
                      <Input
                        type="number"
                        value={emi.years}
                        min={1}
                        onChange={(e) => setEmi((s) => ({ ...s, years: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Interest Rate (% p.a.)</label>
                      <Input
                        type="number"
                        value={emi.rate}
                        step="0.1"
                        onChange={(e) => setEmi((s) => ({ ...s, rate: Number(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Estimated Monthly EMI</p>
                    <p className="text-2xl md:text-3xl font-bold text-primary">{formatINR(emi.monthly)}</p>
                  </div>
                </Card>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Seller Information</h3>
              <p className="font-medium">{car.sellerName}</p>
              <p className="text-sm text-muted-foreground">{car.sellerLocation}</p>

              <div className="mt-6 space-y-3">
                <a href={`tel:${CALL_NUMBER}`}>
                  <Button className="w-full" variant="default">
                    Call Seller (+91 88477 84496)
                  </Button>
                </a>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(`/chat/${car.id}`)}
                >
                  Message Seller
                </Button>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate(`/book-drive?carId=${car.id}`)}
                >
                  Book Test Drive
                </Button>
                <Button 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={handlePayment}
                >
                  Pay / Purchase
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Send Message</h3>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message to the seller..."
                rows={4}
                className="mb-3"
              />
              <Button onClick={handleSendMessage} className="w-full">
                Send Message
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Payment History</h3>
              {paymentHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payment history available</p>
              ) : (
                <ul className="space-y-2">
                  {paymentHistory.map((p) => (
                    <li key={p._id} className="flex justify-between text-sm">
                      <span>{p.purpose}</span>
                      <span className="font-semibold">{formatINR(p.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </aside>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ViewDetails;
