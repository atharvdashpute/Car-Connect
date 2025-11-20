import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Phone, X } from "lucide-react";
import { toast } from "sonner";

interface CallBackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CallBackDialog = ({ open, onOpenChange }: CallBackDialogProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [language, setLanguage] = useState("hindi");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Request submitted! We'll call you back soon.");
    onOpenChange(false);
    setPhoneNumber("");
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request call back</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="phone" className="text-lg font-semibold mb-2 block">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="h-12"
              required
            />
          </div>

          <div>
            <Label className="text-lg font-semibold mb-3 block">Language</Label>
            <RadioGroup value={language} onValueChange={setLanguage}>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="hindi" id="hindi" />
                <Label htmlFor="hindi" className="flex-1 cursor-pointer">Hindi</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                <RadioGroupItem value="english" id="english" />
                <Label htmlFor="english" className="flex-1 cursor-pointer">English</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="message" className="text-base mb-2 block">
              Tell us what you need help with
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              rows={4}
            />
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              To have a CARS24 representative call you, please click below
            </p>
            <p className="text-amber-600 font-semibold">
              We are operational between 9 AM - 9 PM
            </p>
            <Button type="submit" size="lg" className="w-full h-12">
              CALL ME
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CallBackDialog;
