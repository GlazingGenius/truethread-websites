import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "sonner";
import { HomePage } from "@/app/pages/home";
import { ProductsPage } from "@/app/pages/products";
import { ProductDetailPage } from "@/app/pages/product-detail";
import { AdminPage } from "@/app/pages/admin";
import { AdminPanel } from "@/app/components/admin-panel";
import { WhatsAppChat } from "@/app/components/whatsapp-chat";
import { PreOrderWidget } from "@/app/components/pre-order-widget";
import { MegaMenu } from "@/app/components/mega-menu";
import { ScrollToTop } from "@/app/components/scroll-to-top";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { TrueThreadLogo } from "@/app/components/TrueThreadLogo";
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu,
  ShieldCheck,
  X
} from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";

function Navigation() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    // Initialize sample data
    initializeSampleData();
  }, []);

  const initializeSampleData = async () => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/init-sample-data`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
    } catch (error) {
      console.error("Initialize sample data error:", error);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61eed344/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsAdmin(true);
        setShowAdminLogin(false);
        toast.success("Login successful");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  if (isAdmin) {
    return <AdminPanel onLogout={() => setIsAdmin(false)} />;
  }

  return (
    <>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left - Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex-shrink-0 -ml-10"
            >
              <Link to="/" className="block">
                <TrueThreadLogo />
              </Link>
            </motion.div>

            {/* Center - Nav Links Desktop */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-medium absolute left-1/2 transform -translate-x-1/2">
              <Link to="/products?featured=true" className="hover:text-purple-600 transition-colors duration-300 whitespace-nowrap relative group">
                New & Featured
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <MegaMenu category="Men" />
              <MegaMenu category="Women" />
              <MegaMenu category="Kids" />
              <Link to="/products" className="hover:text-purple-600 transition-colors duration-300 whitespace-nowrap relative group">
                Shop All
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Right Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              {/* Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 rounded-full px-4 py-2 transition-all duration-300"
              >
                <Search className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-700">Search</span>
              </button>

              {/* Icons */}
              <button className="p-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-full transition-all duration-300 group">
                <Heart className="h-5 w-5 group-hover:text-purple-600 transition-colors" />
              </button>
              <button className="p-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-full transition-all duration-300 group">
                <ShoppingBag className="h-5 w-5 group-hover:text-purple-600 transition-colors" />
              </button>
              
              {/* Admin Button */}
              <button
                onClick={() => setShowAdminLogin(true)}
                className="hidden md:block p-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-full transition-all duration-300 group"
                title="Admin Login"
              >
                <ShieldCheck className="h-5 w-5 group-hover:text-purple-600 transition-colors" />
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 rounded-full transition-all duration-300"
              >
                <Menu className="h-6 w-6" />
              </button>
            </motion.div>
          </div>

          {/* Search Bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pb-4"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10 rounded-full border-gray-200"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t bg-white overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                <Link
                  to="/products"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full text-left py-2 font-medium hover:bg-gray-50 px-2 rounded"
                >
                  New & Featured
                </Link>
                <Link
                  to="/products?category=Men"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full text-left py-2 font-medium hover:bg-gray-50 px-2 rounded"
                >
                  Men
                </Link>
                <Link
                  to="/products?category=Women"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full text-left py-2 font-medium hover:bg-gray-50 px-2 rounded"
                >
                  Women
                </Link>
                <Link
                  to="/products?category=Kids"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full text-left py-2 font-medium hover:bg-gray-50 px-2 rounded"
                >
                  Kids
                </Link>
                <Link
                  to="/products"
                  onClick={() => setShowMobileMenu(false)}
                  className="block w-full text-left py-2 font-medium hover:bg-gray-50 px-2 rounded"
                >
                  Shop All
                </Link>
                <button
                  onClick={() => {
                    setShowAdminLogin(true);
                    setShowMobileMenu(false);
                  }}
                  className="flex items-center gap-2 w-full text-left py-2 font-medium hover:bg-gray-50 px-2 rounded"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Admin
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Admin Login Dialog */}
      <AnimatePresence>
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowAdminLogin(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Shield Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full p-4">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-center mb-2" style={{ fontFamily: 'Bodoni Moda, serif' }}>
                Admin Login
              </h2>
              <p className="text-gray-500 text-center mb-6">
                Enter your credentials to access the admin panel
              </p>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="mt-1"
                    required
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdminLogin(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loginLoading} 
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    {loginLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                <p className="text-xs text-gray-600 text-center">
                  <strong>Default credentials:</strong>
                  <br />
                  Username: <code className="bg-white px-2 py-1 rounded">admin</code>
                  {" "} | Password: <code className="bg-white px-2 py-1 rounded">admin123</code>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1 */}
          <div>
            <h3 className="font-bold text-lg mb-4">GET HELP</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Order Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-bold text-lg mb-4">ABOUT</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-bold text-lg mb-4">SHOP</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/products?category=Men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link to="/products?category=Women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link to="/products?category=Kids" className="hover:text-white transition-colors">Kids</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-bold text-lg mb-4" style={{ fontFamily: "'Alumni Sans', sans-serif" }}>STAY CONNECTED</h3>
            <p className="text-sm text-gray-300 mb-4">
              Subscribe to get special offers and updates
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus:border-white focus:ring-white"
              />
              <Button className="bg-white text-black hover:bg-gray-200 font-medium whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2026 True Thread. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Toaster position="top-right" />
        <Navigation />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        <Footer />
        <WhatsAppChat />
        <PreOrderWidget />
        <ScrollToTop />
      </div>
    </BrowserRouter>
  );
}