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

// Dummy car data (replace with backend later)
const allCars = [
  {
    id: 1,
    name: "Toyota Fortuner",
    category: "suv",
    price: "₹32,99,000",
    image:
      "https://images.pexels.com/photos/3580961/pexels-photo-3580961.jpeg",
  },
  {
    id: 2,
    name: "Honda City",
    category: "sedan",
    price: "₹13,99,000",
    image:
      "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    id: 3,
    name: "Tata Punch",
    category: "hatchback",
    price: "₹8,99,000",
    image:
      "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg",
  },
  {
    id: 4,
    name: "BMW M4",
    category: "sports",
    price: "₹1,40,00,000",
    image:
      "https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg",
  },
  {
    id: 5,
    name: "Mercedes S-Class",
    category: "luxury",
    price: "₹1,75,00,000",
    image:
      "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
  },
  {
    id: 6,
    name: "Tesla Model 3",
    category: "electric",
    price: "₹45,00,000 (Imported)",
    image:
      "https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg",
  },
];

const Categories = () => {
  const [selected, setSelected] = useState("suv");

  const filteredCars = allCars.filter((car) => car.category === selected);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Browse by Categories</h1>

      {/* Category Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
        {categoriesList.map((cat) => {
          const Icon = cat.icon;
          const isActive = selected === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`flex flex-col items-center p-4 rounded-xl border transition ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Cars Grid */}
      <h2 className="text-2xl font-semibold mb-4 capitalize">
        {selected} Cars
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
          >
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-semibold">{car.name}</h3>
            <p className="text-gray-600">{car.price}</p>

            <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
