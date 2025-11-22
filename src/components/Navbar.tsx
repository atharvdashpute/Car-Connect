import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Menu, User, Heart, LogOut, X, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ThemeToggle from "./ThemeToggle";
import { toast } from "sonner";
import CallBackDialog from "./CallBackDialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };
  const [user, setUser] = useState<any>(null);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[rgba(255,255,255,0.3)] dark:bg-[rgba(15,15,15,0.4)] backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Car className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-200" />
            <span className="text-xl font-bold tracking-tight font-display">
              Car-Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 ml-10">
            <Link
              to="/"
              className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:tracking-wide ${isActive("/") ? "text-primary border-b-2 border-primary pb-1" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/cars"
              className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:tracking-wide ${isActive("/cars") ? "text-primary border-b-2 border-primary pb-1" : ""}`}
            >
              Cars
            </Link>
            <a
              href="/#services"
              onClick={(e) => {
                e.preventDefault();
                if (window.location.pathname === "/") {
                  document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                } else {
                  navigate("/#services");
                  setTimeout(() => {
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                  }, 100);
                }
              }}
              className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:tracking-wide cursor-pointer ${location.hash === "#services" ? "text-primary border-b-2 border-primary pb-1" : ""}`}
            >
              Services
            </a>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:tracking-wide ${isActive("/contact") ? "text-primary border-b-2 border-primary pb-1" : ""}`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Call Us Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => setCallDialogOpen(true)}
              className="rounded-full gap-2"
            >
              <Phone className="h-4 w-4" />
              Call us
            </Button>

            <ThemeToggle />

            {user ? (
              <>
                {/* Profile */}
                <Link to="/profile">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full hover:bg-primary/10 transition"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>

                {/* Logout */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="rounded-full hover:bg-red-600 hover:text-white transition"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>

                {/* Sell Car */}
                <Link to="/sell">
                  <Button
                    size="sm"
                    className="btn-primary rounded-full px-5 py-2 shadow-md hover:shadow-xl transition-transform hover:scale-105"
                  >
                    Sell Car
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="rounded-full"
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-7 w-7 text-primary" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
            <div className="absolute right-0 top-0 w-72 bg-background h-full shadow-xl p-6 animate-slide-left">

              {/* Close Button */}
              <button
                className="absolute top-4 right-4"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="space-y-6 mt-10">

                {/* Links */}
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/"
                  className="block text-lg font-medium hover:text-primary transition"
                >
                  Home
                </Link>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/cars"
                  className="block text-lg font-medium hover:text-primary transition"
                >
                  Cars
                </Link>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    if (window.location.pathname === "/") {
                      document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      navigate("/#services");
                      setTimeout(() => {
                        document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }
                  }}
                  className="block text-lg font-medium hover:text-primary transition cursor-pointer"
                >
                  Services
                </a>
                <Link
                  onClick={() => setIsOpen(false)}
                  to="/contact"
                  className="block text-lg font-medium hover:text-primary transition"
                >
                  Contact
                </Link>

                <hr className="border-white/20" />

                {/* Actions */}
                <ThemeToggle />

                {user ? (
                  <div className="space-y-3 mt-6">

                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" size="sm" className="rounded-full w-full">
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="rounded-full w-full hover:bg-red-600 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>

                    <Link to="/sell" onClick={() => setIsOpen(false)}>
                      <Button
                        size="sm"
                        className="btn-primary rounded-full w-full shadow-md hover:shadow-xl"
                      >
                        Sell Car
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/auth")}
                    className="rounded-full w-full mt-4"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <CallBackDialog open={callDialogOpen} onOpenChange={setCallDialogOpen} />
    </nav>
  );
};

export default Navbar;
