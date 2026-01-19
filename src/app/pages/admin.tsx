import { useState } from "react";
import { motion } from "motion/react";
import { AdminPanel } from "@/app/components/admin-panel";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { TrueThreadLogo } from "@/app/components/TrueThreadLogo";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <TrueThreadLogo />
        </div>

        {/* Lock Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-black rounded-full p-4">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2">Admin Panel</h1>
        <p className="text-gray-500 text-center mb-8">
          Enter your credentials to access the admin dashboard
        </p>

        {/* Login Form */}
        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
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
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
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

          <Button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 rounded-lg"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Helper Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            <strong>Default credentials:</strong>
            <br />
            Username: <code className="bg-white px-2 py-1 rounded">admin</code>
            <br />
            Password: <code className="bg-white px-2 py-1 rounded">admin123</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
