import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const formatINR = (val:any) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(Number(val)||0);

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setUser({
        name: profile?.full_name || session.user.email,
        email: session.user.email,
        phone: profile?.phone
      });

      // Get favorites with car details
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

      // Get user listings
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
          <h2 className="text-xl font-semibold">Your Profile</h2>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">{user.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Phone</div>
              <div className="font-medium">{user.phone ?? "-"}</div>
            </div>
          </div>
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
