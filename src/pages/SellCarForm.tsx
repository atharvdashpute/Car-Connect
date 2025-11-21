import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SellCarForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    bodyType: "suv",
    price: "",
    description: "",
    fuelType: "petrol",
    transmission: "manual",
    seats: 5,
    mileage: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        toast.error("Please sign in to list a car");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("cars")
        .insert({
          title: form.title,
          brand: form.brand,
          model: form.model,
          year: form.year,
          body_type: form.bodyType,
          price: Number(form.price),
          description: form.description,
          fuel_type: form.fuelType,
          transmission: form.transmission,
          seats: form.seats,
          mileage: form.mileage ? Number(form.mileage) : null,
          location: form.location,
          seller_id: session.user.id,
          status: "pending"
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Car listed successfully! Pending approval.");
      navigate(`/view/${data.id}`);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to list car. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">List Your Car for Sale</h1>
        <p className="text-muted-foreground mb-8">Fill in the details below to list your car on our platform</p>
        
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Car Title *</Label>
                <Input 
                  id="title"
                  placeholder="e.g., Toyota Fortuner 2023" 
                  value={form.title} 
                  onChange={(e)=>setForm({...form, title:e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input 
                  id="brand"
                  placeholder="e.g., Toyota" 
                  value={form.brand} 
                  onChange={(e)=>setForm({...form, brand:e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="model">Model *</Label>
                <Input 
                  id="model"
                  placeholder="e.g., Fortuner" 
                  value={form.model} 
                  onChange={(e)=>setForm({...form, model:e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="year">Year *</Label>
                <Input 
                  id="year"
                  type="number"
                  placeholder="2023" 
                  value={form.year} 
                  onChange={(e)=>setForm({...form, year:Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bodyType">Body Type *</Label>
                <Select value={form.bodyType} onValueChange={(val)=>setForm({...form, bodyType:val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="price">Price (₹) *</Label>
                <Input 
                  id="price"
                  type="number"
                  placeholder="1500000" 
                  value={form.price} 
                  onChange={(e)=>setForm({...form, price:e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fuelType">Fuel Type *</Label>
                <Select value={form.fuelType} onValueChange={(val)=>setForm({...form, fuelType:val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="cng">CNG</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="transmission">Transmission *</Label>
                <Select value={form.transmission} onValueChange={(val)=>setForm({...form, transmission:val})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automatic">Automatic</SelectItem>
                    <SelectItem value="dct">DCT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="seats">Seats *</Label>
                <Input 
                  id="seats"
                  type="number"
                  value={form.seats} 
                  onChange={(e)=>setForm({...form, seats:Number(e.target.value)})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input 
                  id="mileage"
                  type="number"
                  placeholder="50000" 
                  value={form.mileage} 
                  onChange={(e)=>setForm({...form, mileage:e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  placeholder="e.g., Mumbai, India" 
                  value={form.location} 
                  onChange={(e)=>setForm({...form, location:e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Describe your car's features, condition, and any additional details..." 
                value={form.description} 
                onChange={(e)=>setForm({...form, description:e.target.value})}
                rows={5}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Listing"}
            </Button>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default SellCarForm;
