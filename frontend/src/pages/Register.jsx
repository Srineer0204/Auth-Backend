import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardContent
} from "@/components/ui/card";
import { Link,useNavigate } from "react-router-dom";
import { Mail, Lock, User,  Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import api from "@/api/axios";

export default function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success,setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);

    if(!name) {
      setSuccess("");
      setError("Name is required");
      setLoading(false);
      return;
    }
    if(!email) {
      setSuccess("");
      setError("Email is required");
      setLoading(false);
      return;
    }
    if(!password) {
      setSuccess("");
      setError("Password is required");
      setLoading(false);
        return;
    }
    if(!confirmPassword) {
      setSuccess("");
      setError("Confirm Password is required");
      setLoading(false);
      return;
    }
    
    if(password.length < 6) {
      setSuccess("");
      setError("Password must be atleast 6 characters");
      setLoading(false);
      return;
    }
    if(!email.includes("@")) {
      setSuccess("");
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }
    if(password !== confirmPassword) {
      setSuccess("");
      setError("Password does not match");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register",{
        name, 
        email,
        password
      });
      setError("");
      setSuccess(response.data.message);

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      },2000);

    } catch(error) {
      setSuccess("");
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

    return (
        <div 
        className="
        flex 
        justify-center 
        items-center 
        min-h-screen 
        bg-linear-to-br
      from-slate-900
      via-slate-800
      to-slate-700 overflow-auto">
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
                    <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                    <CardDescription className="text-slate-500">Create your account to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="font-medium text-sm">Name</label>
                            <div className="relative">
                            <User
                            className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            h-4
                            w-4
                            text-gray-500
                            "
                            />
                            <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="pl-10
                            h-11
                            focus-visible:ring-2
                            focus-visible:ring-blue-500
                            transition-all"
                            />
                          </div>
                        </div>

                        <div>
                            <label className="font-medium text-sm">Email</label>
                            <div className="relative">
                              <Mail
                              className="
                              absolute
                              left-3
                              top-1/2
                              -translate-y-1/2
                              h-4
                              w-4
                              text-gray-500
                              "
                            />
                            <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="pl-10
                            h-11
                            focus-visible:ring-2 
                            focus-visible:ring-blue-500
                            transition-all"
                            />
                          </div>
                        </div>

                        <div>
                            <label className="font-medium text-sm">Password</label>
                            <div className="relative">
                              <Lock
                              className="
                              absolute
                              left-3
                              top-1/2
                              -translate-y-1/2
                              h-4
                              w-4
                              text-gray-500
                              "
                            />
                            <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            cursor-pointer"
                            >{showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-700" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-700" />
                              )}
                            </button>
                            <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="pl-10
                            h-11 
                            pr-10
                            focus-visible:ring-2
                            focus-visible:ring-blue-500
                            transition-all
                            "
                            />
                          </div>
                        </div>

                        <div>
                            <label className="font-medium text-sm">Confirm Password</label>
                            <div className="relative">
                              <Lock
                              className="
                              absolute
                              left-3
                              top-1/2
                              -translate-y-1/2
                              h-4
                              w-4
                              text-gray-500
                              "
                             /> 
                             <button type="button"
                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                             className="
                             absolute
                             right-3
                             top-1/2
                             -translate-y-1/2
                             cursor-pointer">
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-700" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-700" />
                              )}</button>

                             <Input
                             type={showConfirmPassword ? "text" : "password"}
                             value={confirmPassword}
                             onChange={(e) => setConfirmPassword(e.target.value)}
                             placeholder="Confirm your password"
                             className="pl-10 
                             pr-10
                             focus-visible:ring-2
                             h-11
                             focus-visible:ring-blue-500
                             transition-all"
                             />
                            </div>
                        </div>

                        {error && (
                          <p className="text-md text-red-500 transition-colors">{error}</p>
                        )}
                        {success && (
                          <p className="text-md text-green-500">{success}</p>
                        )}
                        <Button 
                        disabled={loading}
                        onClick={handleRegister}
                        className="
                        w-full
                        h-11
                        transition-all
                        hover:scale-[1.02]
                        font-semibold
                        ">{loading ? "Creating Account..." : "Create Account"}</Button>

                        <p className="text-sm text-center">Already have an account? {" "}
                            <Link to="/login" className="
                            font-medium
                            text-blue-600 
                            hover:underline
                            hover:text-blue-700
                            transition-colors
                            ">Sign In</Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}