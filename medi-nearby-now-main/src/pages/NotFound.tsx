
import React from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="med-container py-12 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-medblue-600">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! Page not found</p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-medblue-500 hover:bg-medblue-600"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
