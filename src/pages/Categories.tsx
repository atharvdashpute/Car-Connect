import { useState } from "react";
import { Car, Bolt, Star, Zap, Gauge, CarFront } from "lucide-react";

const categoriesList = [
  { id: "suv", label: "SUV", icon: CarFront },
  { id: "sedan", label: "Sedan", icon: Car },
  { id: "hatchback", label: "Hatchback", icon: Gauge },
  { id: "sports", label: "Sports", icon: Zap },
  { id: "luxury", label: "Luxury", icon: Star },
  { id: "electric", label: "Electric", icon: Bolt },
];

// Expanded Car List (more attractive & bigger)
const allCars = [
  {
    id: 1,
    name: "Toyota Fortuner",
    category: "suv",
    price: "₹32,99,000",
    image: "https://images.pexels.com/photos/3580961/pexels-photo-3580961.jpeg",
  },
  {
    id: 2,
    name: "Hyundai Creta",
    category: "suv",
    price: "₹18,89,000",
    image:
      "https://images.pexels.com/photos/11491307/pexels-photo-11491307.jpeg",
  },
  {
    id: 3,
    name: "Mahindra XUV700",
    category: "suv",
    price: "₹24,00,000",
    image:
      "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
  },
  {
    id: 4,
    name: "Honda City",
    category: "sedan",
    price: "₹13,99,000",
    image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    id: 5,
    name: "Skoda Superb",
    category: "sedan",
    price: "₹35,99,000",
    image:
      "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    id: 6,
    name: "BMW M4",
    category: "sports",
    price: "₹1,40,00,000",
    image:
      "https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg",
  },
  {
    id: 7,
    name: "Audi R8",
    category: "sports",
    price: "₹2,60,00,000",
    image:
      "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
  },
  {
    id: 8,
    name: "Tata Punch",
    category: "hatchback",
    price: "₹8,99,000",
    image: "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg",
  },
  {
    id: 9,
    name: "Maruti Swift",
    category: "hatchback",
    price: "₹7,80,000",
    image:
      "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    id: 10,
    name: "Mercedes S-Class",
    category: "luxury",
    price: "₹1,75,00,000",
    image:
      "https://images.pexels.com/photos/17600888/pexels-photo-17600888.jpeg",
  },
  {
    id: 11,
    name: "BMW 7-Series",
    category: "luxury",
    price: "₹1,60,00,000",
    image:
      "https://images.pexels.com/photos/15922688/pexels-photo-15922688.jpeg",
  },
  {
    id: 12,
    name: "Tesla Model 3",
    category: "electric",
    price: "₹45,00,000 (Imported)",
    image: "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg",
  },
  {
    id: 13,
    name: "Tata Nexon EV",
    category: "electric",
    price: "₹17,50,000",
    image:
      "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg",
  },
];

const Categories = () => {
  const [selected, setSelected] = useState("suv");

  const filteredCars = allCars.filter((car) => car.category === selected);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 pt-28">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-8">Explore Cars by Category</h1>

      {/* Category Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
        {categoriesList.map((cat) => {
          const Icon = cat.icon;
          const isActive = selected === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`flex flex-col items-center p-5 rounded-2xl border shadow-sm transition hover:shadow-lg ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-8 h-8 mb-3" />
              <span className="text-sm font-semibold">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Category Title */}
      <h2 className="text-3xl font-semibold mb-6 capitalize flex items-center gap-3">
        {selected} Cars
        <span className="text-base text-gray-500">({filteredCars.length} models)</span>
      </h2>

      {/* Cars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 cursor-pointer border"
          >
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-semibold">{car.name}</h3>
            <p className="text-gray-700 mt-1 font-medium">{car.price}</p>

            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
