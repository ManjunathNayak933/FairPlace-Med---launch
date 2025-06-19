
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../context/AuthContext";
import { toast } from "../components/ui/sonner";

const loginSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(10, "Phone number is too short"),
  confirmPhone: z.string().min(10, "Phone number is too short"),
}).refine(data => data.phone === data.confirmPhone, {
  message: "Phone numbers don't match",
  path: ["confirmPhone"],
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      phone: "",
      confirmPhone: "",
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.name, data.phone);
      navigate("/");
    } catch (error) {
      toast.error("Login failed", {
        description: "Please try again.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="med-container py-8 animate-fade-in">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to MedExpress</h1>
          <p className="text-gray-600 mt-2">Login to order medicines from nearby pharmacies</p>
        </div>
        
        <div className="med-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPhone">Confirm Phone Number</Label>
              <Input
                id="confirmPhone"
                type="tel"
                placeholder="Re-enter your phone number"
                {...register("confirmPhone")}
              />
              {errors.confirmPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPhone.message}</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-medblue-500 hover:bg-medblue-600"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            
            <p className="text-sm text-center text-gray-500 mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
