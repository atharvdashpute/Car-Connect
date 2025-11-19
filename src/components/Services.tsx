import { Card, CardContent } from "@/components/ui/card";
import { Shield, Car, Star, Award, History, CreditCard } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Shield,
      number: "01",
      title: "Vehicle Inspection",
      description: "Professional multi-point inspections ensure every vehicle meets our quality standards before listing.",
      color: "text-orange-500",
    },
    {
      icon: Car,
      number: "02",
      title: "Trade-In Services",
      description: "Get competitive offers for your current vehicle to offset the cost of your next car.",
      color: "text-orange-500",
    },
    {
      icon: CreditCard,
      number: "03",
      title: "Secure Transactions",
      description: "Protected payment systems and verification processes ensure safe, worry-free car purchases online.",
      color: "text-orange-500",
    },
    {
      icon: Award,
      number: "04",
      title: "Test Drives",
      description: "Schedule convenient test drives with your selected vehicles before making a purchase decision.",
      color: "text-orange-500",
    },
    {
      icon: History,
      number: "05",
      title: "Vehicle History",
      description: "Comprehensive reports reveal accident history, ownership details, and maintenance records for transparency.",
      color: "text-orange-500",
    },
    {
      icon: Star,
      number: "06",
      title: "Financing Options",
      description: "Competitive rates and flexible payment plans to make your dream car affordable.",
      color: "text-orange-500",
    },
  ];

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide border-l-4 border-primary pl-3">
              Services
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Comprehensive Solutions For Every Car Buyer
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="group relative hover-lift glass-card border-border/50 overflow-hidden"
            >
              <CardContent className="p-8 space-y-4">
                <div className="relative">
                  <div className={`inline-flex p-5 rounded-full bg-muted/50 ${service.color} group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-10 w-10" />
                  </div>
                  <span className={`absolute -top-2 -right-2 text-5xl font-bold ${service.color} opacity-20`}>
                    {service.number}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-xl">{service.title}</h3>
                  <div className="w-12 h-1 bg-primary rounded-full" />
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;