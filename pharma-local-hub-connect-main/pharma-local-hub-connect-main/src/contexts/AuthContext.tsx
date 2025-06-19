import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/config";

// Define types for our user and context
export type UserType = {
  _id?: string; // MongoDB _id for backend users
  id: string;
  name: string;
  email: string;
  shopName: string;
  gstNumber: string;
  shopLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  paymentQrUrl?: string;
  role: "seller";
};

type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    userData: Omit<UserType, "id"> & { password: string }
  ) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<UserType>) => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for stored token and user on initial load
  useEffect(() => {
    const token = localStorage.getItem("medicineToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem("medicineUser", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("medicineUser");
          localStorage.removeItem("medicineToken");
        }
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("medicineUser");
        localStorage.removeItem("medicineToken");
      })
      .finally(() => setLoading(false));
  }, []);

  // Login with backend
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setUser(data.user);
      localStorage.setItem("medicineUser", JSON.stringify(data.user));
      localStorage.setItem("medicineToken", data.token);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
      });
      // Use backend-provided redirect if available, else default
      if (data.redirect) {
        navigate(data.redirect);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      toast({
        title: "Login failed",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Register with backend (updated for seller with QR upload)
  // const register = async (
  //   userData: Omit<UserType, "id"> & { password: string; paymentQrFile?: File }
  // ) => {
  //   try {
  //     console.log("object")
  //     setLoading(true);
  //     const formData = new FormData();
  //     for (const key in userData) {
  //       if (
  //         userData[key] !== undefined &&
  //         userData[key] !== null &&
  //         key !== "paymentQrFile"
  //       ) {
  //         if (key === "shopLocation" && typeof userData.shopLocation === "object") {
  //           formData.append("shopLocation", JSON.stringify(userData.shopLocation));
  //         } else {
  //           formData.append(key, userData[key]);
  //         }
  //       }
  //     }
  //     if (userData.paymentQrFile) {
  //       formData.append("paymentQrCode", userData.paymentQrFile);
  //     }
  //     const res = await fetch(`${API_BASE_URL}/api/sellers/register`, {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const data = await res.json();
  //     console.log("Registration response:", data);
  //     if (!res.ok) throw new Error(data.error || "Registration failed");
  //     // Optionally, auto-login after registration
  //     // await login(userData.email, userData.password);
  //     toast({
  //       title: "Registration successful",
  //       description: "Your seller account has been created.",
  //     });
  //     navigate("/login");
  //   } catch (error) {
  //     const errMsg = error instanceof Error ? error.message : String(error);
  //     toast({
  //       title: "Registration failed",
  //       description: errMsg,
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


const register = async (
  userData: Omit<UserType, "id"> & { password: string; paymentQrFile?: File }
) => {
  try {
    setLoading(true);

    const formData = new FormData();

    for (const key in userData) {
      if (userData[key] !== undefined && userData[key] !== null && key !== "paymentQrFile") {
        if (key === "shopLocation" && typeof userData.shopLocation === "object") {
          // Stringify shopLocation because multer expects string fields
          formData.append("shopLocation", JSON.stringify(userData.shopLocation));
        } else {
          formData.append(key, userData[key]);
        }
      }
    }

    if (userData.paymentQrFile) {
      formData.append("paymentQrCode", userData.paymentQrFile);
    }

    const res = await fetch(`${API_BASE_URL}/api/sellers/register`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Registration failed");

    toast({
      title: "Registration successful",
      description: "Your seller account has been created.",
    });

    navigate("/login");
  } catch (error) {
    toast({
      title: "Registration failed",
      description: error instanceof Error ? error.message : String(error),
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};



  const logout = () => {
    setUser(null);
    localStorage.removeItem("medicineUser");
    localStorage.removeItem("medicineToken");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  const updateUser = (data: Partial<UserType>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("medicineUser", JSON.stringify(updatedUser));

      // Also update in the users array
      const allUsers = JSON.parse(
        localStorage.getItem("medicineUsers") || "[]"
      );
      const updatedUsers = allUsers.map((u: Record<string, unknown>) =>
        u.id === user.id ? { ...u, ...data } : u
      );
      localStorage.setItem("medicineUsers", JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
