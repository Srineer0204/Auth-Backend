import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Link,useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail,Lock } from "lucide-react";
import { useState } from "react";
import {Eye, EyeOff } from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/context/AuthContext";

export default function Login() {

  const { setUser } = useAuth();

  const [showPassword,setShowPassword] = useState(false);
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const [error,setError] = useState("");
  const [success,setSuccess] = useState("");
  const [loading,setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
  if (!email) {
    setSuccess("");
    setError("Email is required");
    setLoading(false);
    return;
  }

  if (!password) {
    setSuccess("");
    setError("Password is required");
    setLoading(false);
    return;
  }

  if (!email.includes("@")) {
    setSuccess("");
    setError("Please enter a valid email");
    setLoading(false);
    return;
  }
try {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    setSuccess(response.data.message);
    setEmail("");
setPassword("");
setError("");

    const profile = await api.get("/auth/profile");
    setUser(profile.data.user);

    setTimeout(() => {
        navigate("/dashboard");
    }, 2000);

} catch (error) {
    if (error.response) {
        setError(error.response.data.message);
    } else {
        setError("Something went wrong");
    }
} finally {
    setLoading(false);
}
  }

    return (
    <div className="flex min-h-screen items-center justify-center
    bg-linear-to-br
from-slate-900
via-slate-800
to-slate-700
 overflow-auto">
      <Card className="
      w-full 
      max-w-md
      mx-4
      border-white/10
      bg-white/95
      backdrop-blur-2xl
      shadow-2xl
      ">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Welcome Back 👋</CardTitle>
          <CardDescription className="text-slate-500">Sign in to continue to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-sm">Email</label>
              <div className="relative">
              <Mail 
              className="absolute
              left-3
              top-1/2
              -translate-y-1/2
              h-4
              w-4
              text-gray-700"
              />
              <Input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
              pl-10
              h-11
              focus-visible:ring-2
              focus-visible:ring-blue-500
              transition-all
              " />
            </div>
            </div>

            <div>
              <label className="text-sm">Password</label>
              <div className="relative">
              <Lock 
              className="absolute
              left-3
              top-1/2
              -translate-y-1/2
              h-4
              w-4
              text-gray-700"
              />
              <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              cursor-pointer"
              >{showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-700" />
              ) : (
                <Eye className="h-4 w-4 text-gray-700" />
              )}</button>

              <Input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="pl-10 
              pr-10
              h-11
              focus-visible:ring-2
            focus-visible:ring-blue-500
              transition-all
              "
              />
            </div>

            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>

              <button className="text-md text-blue-600 hover:underline cursor-pointer">Forgot Password?</button>
            </div>
            {error && (
   <p className="text-red-500 text-sm">
     {error}
   </p>
  )}

 {success && (
   <p className="text-green-500 text-sm">
     {success}
   </p>
 )}
            <Button 
            disabled={loading}
            onClick={handleLogin}
            className="
            w-full
            h-11
            font-semibold
            transition-all
            hover:scale-[1.02]">{loading ? "Logging in..." : "Login"}</Button>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-sm text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>

            <Button 
            className="
            w-full 
            shadow-md 
            shadow-gray-500/30
            h-11
            font-semibold
            transition-all
            hover:bg-slate-100
            " 
            variant="outline">Continue with Google</Button>

            <p className="text-center text-sm">Don't have an account?{" "}
              <Link to="/register" className="
              font-medium 
              hover:text-blue-700
              text-blue-600
              hover:underline
              transition-colors
              ">Register</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}