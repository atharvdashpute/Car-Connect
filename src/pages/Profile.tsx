import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Camera } from "lucide-react";

const formatINR = (val:any) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(Number(val)||0);

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: ""
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(profile);
      setUser({
        id: session.user.id,
        name: profile?.full_name || session.user.email,
        email: session.user.email,
        phone: profile?.phone,
        location: profile?.location,
        avatar_url: profile?.avatar_url
      });

      setFormData({
        full_name: profile?.full_name || "",
        phone: profile?.phone || "",
        location: profile?.location || ""
      });

      const { data: favData } = await supabase
        .from("favorites")
        .select(`
          car_id,
          cars (
            id,
            title,
            price,
            brand,
            model
          )
        `)
        .eq("user_id", session.user.id);

      const favCars = favData?.map(f => ({
        id: f.car_id,
        name: (f.cars as any)?.title,
        price: (f.cars as any)?.price,
        image: `https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg`
      })) || [];
      
      setFavorites(favCars);

      const { data: listingsData } = await supabase
        .from("cars")
        .select("id, title, price, status, brand, model")
        .eq("seller_id", session.user.id);

      const userListings = listingsData?.map(l => ({
        id: l.id,
        name: l.title,
        status: l.status,
        image: `https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg`
      })) || [];

      setListings(userListings);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('car-images')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setUser({ ...user, avatar_url: publicUrl });
      toast.success("Profile photo updated!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          location: formData.location
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser({
        ...user,
        name: formData.full_name,
        phone: formData.phone,
        location: formData.location
      });
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if(loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">Loading...</div>
      <Footer />
    </div>
  );

  if(!user) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">
        Please <a href="/auth" className="text-primary underline">sign in</a> to view your profile.
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full cursor-pointer hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {!editing ? (
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            )}
          </div>

          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{user.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">{user.phone || "-"}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium">{user.location || "-"}</div>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Favorites</h3>
            {favorites.length === 0 ? <div className="text-muted-foreground">No favorites yet</div> : favorites.map(f=>(
              <div key={f.id} className="flex items-center gap-3 mb-2">
                <img src={f.image} className="w-20 h-12 object-cover rounded" alt=""/>
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-sm text-muted-foreground">{formatINR(f.price)}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Your Listings</h3>
            {listings.length === 0 ? <div className="text-muted-foreground">No listings</div> : listings.map(l=>(
              <div key={l.id} className="flex items-center gap-3 mb-2">
                <img src={l.image} className="w-20 h-12 object-cover rounded" alt=""/>
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-muted-foreground">Status: {l.status}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
