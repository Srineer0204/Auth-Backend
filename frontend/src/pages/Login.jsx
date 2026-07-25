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
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-slate-500">Sign in to continue to your account</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Email</label>
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
              <label className="text-sm font-medium">Password</label>
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