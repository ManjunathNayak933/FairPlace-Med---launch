
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Sellers from "./pages/Sellers";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminProvider } from "./context/AdminContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            } />
            <Route path="/sellers" element={
              <AdminLayout>
                <Sellers />
              </AdminLayout>
            } />
            <Route path="/orders" element={
              <AdminLayout>
                <Orders />
              </AdminLayout>
            } />
            <Route path="/settings" element={
              <AdminLayout>
                <Settings />
              </AdminLayout>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
