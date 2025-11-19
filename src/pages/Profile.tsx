import React, { useEffect, useState } from "react";

const formatINR = (val:any) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR"}).format(Number(val)||0);

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/me").then(r=>r.json()).then(setUser).catch(()=>{});
    fetch("/api/me/favorites").then(r=>r.json()).then(setFavorites).catch(()=>{});
    fetch("/api/me/listings").then(r=>r.json()).then(setListings).catch(()=>{});
  }, []);

  if(!user) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Your Profile</h2>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Name</div>
            <div className="font-medium">{user.name}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Email</div>
            <div className="font-medium">{user.email}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Phone</div>
            <div className="font-medium">{user.phone ?? "-"}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Favorites</h3>
          {favorites.length === 0 ? <div className="text-gray-500">No favorites yet</div> : favorites.map(f=>(
            <div key={f.id} className="flex items-center gap-3 mb-2">
              <img src={f.image} className="w-20 h-12 object-cover rounded" alt=""/>
              <div>
                <div className="font-medium">{f.name}</div>
                <div className="text-sm text-gray-500">{formatINR(f.price)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Your Listings</h3>
          {listings.length === 0 ? <div className="text-gray-500">No listings</div> : listings.map(l=>(
            <div key={l.id} className="flex items-center gap-3 mb-2">
              <img src={l.image} className="w-20 h-12 object-cover rounded" alt=""/>
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-sm text-gray-500">Status: {l.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
