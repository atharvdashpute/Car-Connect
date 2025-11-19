import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Menu, User, Heart, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ThemeToggle from "./ThemeToggle";
import { toast } from "sonner";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };
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
          <a href="/#services" className="text-sm font-medium transition-colors hover:text-primary">
            Services
          </a>
          <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </div>


        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/cars" className="text-sm font-medium transition-colors hover:text-primary">
              Cars
            </Link>
            <a href="/#services" className="text-sm font-medium transition-colors hover:text-primary">
              Services
            </a>
            
            <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
          </div>


          {/* Favorites */}
          <Button variant="ghost" size="icon">
            
          </Button>

          {user ? (
            <>
              {/* My Profile */}
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Button>
              </Link>

              {/* Logout */}
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>

              {/* Sell Car */}
              <Link to="/sell">
                <Button size="sm" className="btn-primary">
                  Sell Car
                </Button>
              </Link>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </>
          )}
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
        <a href="/#services" className="block text-sm font-medium transition-colors hover:text-primary">
          Services
        </a>
        <Link to="/categories" className="block text-sm font-medium transition-colors hover:text-primary">
          Categories
        </Link>
        <Link to="/contact" className="block text-sm font-medium transition-colors hover:text-primary">
          Contact
        </Link>
        <div className="flex flex-col space-y-2 pt-4 border-t">
          <div className="flex justify-center pb-2">
            <ThemeToggle />
          </div>
          {user ? (
            <>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button size="sm" className="btn-primary">
                Sell Car
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>}
    </div>
  </nav>;
};
export default Navbar;
