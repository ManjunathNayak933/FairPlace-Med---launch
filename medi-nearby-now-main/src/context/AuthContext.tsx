import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthState, User } from "../types";
import { toast } from "../components/ui/sonner";
import { fetchBuyerProfile } from "../services/buyerApi";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  token?: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
  });

  // Add token support (JWT from backend if available)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("buyerToken"));

  // Check for existing user session on mount and when token changes
  useEffect(() => {
    const storedToken = token;
    if (storedToken) {
      if (!authState.loading || !authState.isAuthenticated) {
        setAuthState((prev) => ({ ...prev, loading: true }));
      }
      fetchBuyerProfile(storedToken)
        .then((user) => {
          if (
            !authState.user ||
            authState.user.id !== user.id ||
            !authState.isAuthenticated
          ) {
            setAuthState({
              user,
              isAuthenticated: true,
              loading: false,
              error: null,
            });
          }
        })
        .catch(() => {
          if (
            authState.user !== null ||
            authState.isAuthenticated !== false ||
            authState.loading !== false
          ) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
            });
          }
          if (token !== null) {
            setToken(null);
          }
          localStorage.removeItem("buyerToken");
        });
    } else {
      if (authState.loading !== false) {
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
      if (token !== null) {
        setToken(null);
      }
    }
  }, [token, authState.user, authState.isAuthenticated, authState.loading]);

  const login = async (email: string, password: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch("/api/auth/buyer/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      localStorage.setItem("buyerToken", data.token);
      setToken(data.token);
      // Fetch full buyer profile after login
      const user = await fetchBuyerProfile(data.token);
      setAuthState({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      toast.success("Login successful", { description: `Welcome ${user.name}!` });
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: "Failed to login. Please try again.",
      });
      setToken(null);
      localStorage.removeItem("buyerToken"); // Ensure token is cleared on error
      toast.error("Login failed", { description: "Please try again" });
    }
  };

  const logout = () => {
    localStorage.removeItem("buyerToken");
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
    setToken(null);
    toast.info("You've been logged out");
  };

  // In updateUser, update via backend if needed, but for now just update context
  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;
    const updatedUser = { ...authState.user, ...userData };
    setAuthState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        updateUser,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export type { AuthContextType };
export { AuthContext, useAuth };
