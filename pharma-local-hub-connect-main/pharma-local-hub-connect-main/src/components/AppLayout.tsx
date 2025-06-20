import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Home,
  Package,
  FileText,
  DollarSign,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const AppLayout = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Redirect to login if not authenticated (wait for loading to finish)
  React.useEffect(() => {
    if (!loading && !user && location.pathname !== "/register") {
      navigate("/login");
    }
  }, [user, loading, navigate, location]);

  // Navigation items
  const navItems = [
    {
      path: "/dashboard",
      icon: <Home className="h-5 w-5 mr-2" />,
      label: "Dashboard",
    },
    {
      path: "/products",
      icon: <Package className="h-5 w-5 mr-2" />,
      label: "Products",
    },
    {
      path: "/orders",
      icon: <FileText className="h-5 w-5 mr-2" />,
      label: "Orders",
    },
    {
      path: "/earnings",
      icon: <DollarSign className="h-5 w-5 mr-2" />,
      label: "Earnings",
    },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Mobile navigation
  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between py-4">
            <h2 className="text-lg font-medium">Menu</h2>
          </div>
          <nav className="flex flex-col gap-2 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center py-2 px-3 rounded-md transition-colors",
                  isActive(item.path)
                    ? "bg-med-light-blue text-med-blue font-medium"
                    : "hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="py-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={logout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  const DesktopSidebar = () => (
    <div className="hidden md:flex flex-col w-64 border-r p-4 h-screen">
      <div className="flex items-center mb-8">
        <h1 className="text-xl font-bold text-med-blue">MediSeller</h1>
      </div>
      <div className="flex flex-col space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center py-2 px-3 rounded-md transition-colors",
              isActive(item.path)
                ? "bg-med-light-blue text-med-blue font-medium"
                : "hover:bg-gray-100"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
      <Button
        variant="ghost"
        className="justify-start text-red-500 hover:bg-red-50 hover:text-red-600 mt-auto"
        onClick={logout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  );

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DesktopSidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white border-b shadow-sm py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <MobileNav />
            <h1 className="text-xl font-semibold text-gray-800 md:hidden">
              MediSeller
            </h1>
          </div>

          <div className="flex items-center">
            {user && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-700 hidden sm:block">
                  <span className="font-medium">{user.shopName}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-med-blue text-white flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
