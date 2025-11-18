import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Menu, User, Heart } from "lucide-react";
import { useState } from "react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold font-display">Car-Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/cars" className="text-sm font-medium transition-colors hover:text-primary">
              Cars
            </Link>
            <Link to="/categories" className="text-sm font-medium transition-colors hover:text-primary">
              Categories
            </Link>
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button size="sm" className="btn-primary">
              Sell Car
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <Link to="/" className="block text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/cars" className="block text-sm font-medium transition-colors hover:text-primary">
              Cars
            </Link>
            <Link to="/categories" className="block text-sm font-medium transition-colors hover:text-primary">
              Categories
            </Link>
            <Link to="/contact" className="block text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button size="sm" className="btn-primary">
                Sell Car
              </Button>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navbar;