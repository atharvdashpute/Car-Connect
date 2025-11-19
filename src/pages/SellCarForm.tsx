import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SellCarForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "suv",
    price: "",
    description: "",
    fuel: "petrol",
    transmission: "MT",
    seats: 5,
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(files);
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("category", form.category);
    fd.append("price", form.price);
    fd.append("description", form.description);
    fd.append("fuel", form.fuel);
    fd.append("transmission", form.transmission);
    fd.append("seats", String(form.seats));
    images.forEach((img) => fd.append("images", img));

    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data?.id) {
        alert("Car listed (pending approval).");
        navigate(`/car/${data.id}`);
      } else {
        alert("Error listing car.");
      }
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">List your car for sale</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded p-4 shadow">
        <input className="w-full p-2 border rounded" placeholder="Car name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
        <select className="w-full p-2 border rounded" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})}>
          <option value="suv">SUV</option>
          <option value="sedan">Sedan</option>
          <option value="hatchback">Hatchback</option>
          <option value="sports">Sports</option>
          <option value="luxury">Luxury</option>
          <option value="electric">Electric</option>
        </select>
        <input className="w-full p-2 border rounded" placeholder="Price (numeric)" value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})}/>
        <textarea className="w-full p-2 border rounded" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})}/>
        <div className="grid grid-cols-2 gap-2">
          <select className="p-2 border rounded" value={form.fuel} onChange={(e)=>setForm({...form, fuel:e.target.value})}>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="cng">CNG</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <select className="p-2 border rounded" value={form.transmission} onChange={(e)=>setForm({...form, transmission:e.target.value})}>
            <option value="MT">Manual</option>
            <option value="AT">Automatic</option>
            <option value="DCT">DCT</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">Upload images</label>
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
          <div className="mt-2 flex gap-2">
            {previewUrls.map((u, i) => <img key={i} src={u} className="w-24 h-16 object-cover rounded" alt="preview"/>)}
          </div>
        </div>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Uploading..." : "Submit listing"}</button>
      </form>
    </div>
  );
};

export default SellCarForm;
