
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Package } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Badge } from "./ui/badge";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="bg-white sticky top-0 z-10 shadow-sm">
      <div className="med-container">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="font-bold text-xl text-medblue-600">
            MedExpress
          </Link>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/orders" className="flex items-center text-gray-600 hover:text-medblue-600">
                  <Package className="h-5 w-5" />
                </Link>
                <Link to="/account" className="flex items-center text-gray-600 hover:text-medblue-600">
                  <User className="h-5 w-5" />
                </Link>
                <Link to="/cart" className="relative flex items-center text-gray-600 hover:text-medblue-600">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-medgreen-500 hover:bg-medgreen-500">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-medblue-600 hover:text-medblue-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
