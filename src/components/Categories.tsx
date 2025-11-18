import { Card, CardContent } from "@/components/ui/card";
import { Car, Truck, Zap, Crown, Wind } from "lucide-react";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = [
    { icon: Car, name: "Sedan", count: 245, color: "text-blue-500" },
    { icon: Truck, name: "SUV", count: 189, color: "text-green-500" },
    { icon: Wind, name: "Hatchback", count: 156, color: "text-purple-500" },
    { icon: Crown, name: "Luxury", count: 98, color: "text-yellow-500" },
    { icon: Zap, name: "Electric", count: 134, color: "text-cyan-500" },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-lg text-muted-foreground">
            Find the perfect car type for your lifestyle
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link key={category.name} to={`/cars?category=${category.name.toLowerCase()}`}>
              <Card className="group hover-lift cursor-pointer glass-card border-border/50">
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`inline-flex p-4 rounded-full bg-primary/10 ${category.color} group-hover:scale-110 transition-transform`}>
                    <category.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} cars</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
