import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Sparkles, User, Mail, Phone, Ruler, MessageSquare, MapPin } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  images: string[];
}

interface PreBookDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Spring animation config matching chatbot style
const springConfig = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

const inputSpring = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

export function PreBookDialog({ product, open, onOpenChange }: PreBookDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !phone || !location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Save to backend first
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/pre-bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            productId: product?.id,
            productName: product?.name,
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            customerLocation: location,
            notes,
          }),
        }
      );

      // Get response text first
      const responseText = await response.text();
      
      // Check if response is OK
      if (!response.ok) {
        console.error("Pre-order submit error - Response not OK:", responseText);
        toast.error(`Failed to submit pre-booking: ${response.status} ${response.statusText}`);
        setLoading(false);
        return;
      }

      // Try to parse JSON from the text
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Pre-order submit error - Invalid JSON:", responseText);
        toast.error("Server returned invalid response. Please try again.");
        setLoading(false);
        return;
      }

      if (data.success) {
        // Create WhatsApp message
        const whatsappMessage = `🔔 *New Pre-Booking Request*\n\n` +
          `👤 Name: ${name}\n` +
          `📱 Phone: ${phone}\n` +
          `📧 Email: ${email}\n` +
          `📍 Location: ${location}\n` +
          `👕 Product: ${product?.name}\n` +
          `${selectedSize ? `📏 Size: ${selectedSize}\n` : ''}` +
          `${notes ? `💬 Notes: ${notes}\n` : ''}` +
          `🕒 Time: ${new Date().toLocaleString()}`;
        
        // Open WhatsApp directly - no success toast
        const whatsappUrl = `https://wa.me/918147008048?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        
        setName("");
        setEmail("");
        setPhone("");
        setLocation("");
        setNotes("");
        setSelectedSize("");
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to submit pre-booking");
      }
    } catch (error) {
      console.error("Pre-order submit error:", error);
      toast.error("Failed to submit pre-booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-0">
        {/* Hidden accessibility elements */}
        <DialogTitle className="sr-only">Pre-Book: {product.name}</DialogTitle>
        <DialogDescription className="sr-only">
          This item is currently out of stock. Fill in your details to pre-book and we'll notify you when it's available.
        </DialogDescription>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springConfig}
          className="relative"
        >
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 p-8 pb-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Pre-Book Now</h2>
                <p className="text-white/90 text-sm mt-1">{product.name}</p>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springConfig, delay: 0.15 }}
              className="text-white/90 text-sm mt-4"
            >
              This item is currently out of stock. Fill in your details and we'll notify you when it's available.
            </motion.p>
          </div>

          {/* Form Content */}
          <div className="p-6 pt-8 -mt-6 bg-white rounded-t-3xl relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...inputSpring, delay: 0.2 }}
                className="relative"
              >
                <Label htmlFor="name" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="pl-4 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...inputSpring, delay: 0.25 }}
                className="relative"
              >
                <Label htmlFor="email" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-purple-600" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="pl-4 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </motion.div>

              {/* Phone Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...inputSpring, delay: 0.3 }}
                className="relative"
              >
                <Label htmlFor="phone" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-purple-600" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="pl-4 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </motion.div>

              {/* Location Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...inputSpring, delay: 0.325 }}
                className="relative"
              >
                <Label htmlFor="location" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  Location / Address *
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State or Full Address"
                  required
                  className="pl-4 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </motion.div>

              {/* Size Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...inputSpring, delay: 0.35 }}
                className="relative"
              >
                <Label htmlFor="size" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-purple-600" />
                  Size (Optional)
                </Label>
                <Input
                  id="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  placeholder="S, M, L, XL, etc."
                  className="pl-4 h-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </motion.div>

              {/* Notes Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...inputSpring, delay: 0.4 }}
                className="relative"
              >
                <Label htmlFor="notes" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Size preference, color choice, etc."
                  rows={3}
                  className="pl-4 border-gray-200 focus:border-purple-500 focus:ring-purple-500 resize-none"
                />
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex gap-3 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springConfig, delay: 0.45 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 h-12 border-2"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 font-semibold shadow-lg shadow-purple-500/30"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Submit Pre-Booking
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}