import CarCard from "./CarCard";
import suvImage from "@/assets/suv-1.jpg";
import sedanImage from "@/assets/sedan-1.jpg";
import sportsImage from "@/assets/sports-1.jpg";
import { formatPrice, convertUSDtoINR } from "@/utils/currency";

const FeaturedCars = () => {
  const cars = [
    {
      id: "1",
      title: "BMW X5 M Sport",
      price: formatPrice(convertUSDtoINR(68900)),
      image: suvImage,
      year: "2023",
      mileage: "12,500 km",
      fuel: "Hybrid",
      transmission: "Automatic",
      featured: true,
    },
    {
      id: "2",
      title: "Tesla Model S Plaid",
      price: formatPrice(convertUSDtoINR(89990)),
      image: sedanImage,
      year: "2024",
      mileage: "5,200 km",
      fuel: "Electric",
      transmission: "Automatic",
      featured: true,
    },
    {
      id: "3",
      title: "Porsche 911 Carrera",
      price: formatPrice(convertUSDtoINR(115000)),
      image: sportsImage,
      year: "2023",
      mileage: "8,900 km",
      fuel: "Petrol",
      transmission: "Manual",
      featured: true,
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Vehicles</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked premium cars with exceptional value and quality
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} {...car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;