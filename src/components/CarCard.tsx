import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Fuel, Gauge, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { cars } from "@/data/cars";

interface CarCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  year: string;
  mileage: string;
  fuel: string;
  transmission: string;
  featured?: boolean;
}

const CarCard = ({ id, title, price, image, year, mileage, fuel, transmission, featured }: CarCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  return (
    <Card className="group hover-lift overflow-hidden border-border/50">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {featured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}
        <button 
          onClick={() => toggleFavorite(id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/90 hover:bg-background transition-colors"
        >
          <Heart className={cn("h-4 w-4", favorite && "fill-primary text-primary")} />
        </button>
      </div>
      
      <CardContent className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-2xl font-bold text-primary">{price}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span>{mileage}</span>
          </div>
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            <span>{fuel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{transmission}</span>
          </div>
        </div>

        <Link to={`/view-detail/${id}`}>
          <Button className="w-full btn-primary">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CarCard;
