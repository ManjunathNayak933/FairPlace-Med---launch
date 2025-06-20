import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LocationProvider } from "./contexts/LocationContext";
import { ProductProvider } from "./contexts/ProductContext";
import { OrderProvider } from "./contexts/OrderContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Earnings from "./pages/Earnings";
import NotFound from "./pages/NotFound";
import AppLayout from "./components/AppLayout";
import AddProduct from "./pages/AddProduct";
import Profile from "./pages/Profile";
import BulkMedicineUpload from "@/components/BulkMedicineUpload";
import EditProduct from "./pages/EditProduct";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <LocationProvider>
          <AuthProvider>
            <ProductProvider>
              <OrderProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route path="/" element={<AppLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={
                      <>
                        <BulkMedicineUpload onSuccess={() => window.location.reload()} />
                        <Products />
                      </>
                    } />
                    <Route path="products/add" element={<AddProduct />} />
                    <Route path="/EditProduct/:id" element={<EditProduct />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="earnings" element={<Earnings />} />
                    <Route path="/profile" element={<Profile />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </OrderProvider>
            </ProductProvider>
          </AuthProvider>
        </LocationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
