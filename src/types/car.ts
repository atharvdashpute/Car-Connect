export interface Car {
  id: string;
  name: string;
  brand: string;
  price: number;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  image: string;
  description: string;
  features: string[];
  specs: {
    engine: string;
    horsepower: number;
    topSpeed: number;
    acceleration: string;
    doors: number;
    seats: number;
    color: string;
  };
}
