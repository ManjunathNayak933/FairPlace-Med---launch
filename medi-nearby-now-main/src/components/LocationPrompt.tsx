
import React from "react";
import { useLocation } from "../context/LocationContext";
import { Button } from "./ui/button";
import { MapPin } from "lucide-react";

const LocationPrompt = () => {
  const { latitude, longitude, loading, error, requestLocation } = useLocation();
  
  if (latitude && longitude) {
    return null; // Don't show if we already have location
  }
  
  return (
    <div className="med-card my-4 animate-slide-in">
      <div className="flex flex-col items-center text-center">
        <MapPin className="h-10 w-10 text-medblue-500 mb-2" />
        <h3 className="text-lg font-semibold mb-2">Enable Location Access</h3>
        <p className="text-gray-600 mb-4">
          To show medicines from nearby pharmacies, we need your location.
        </p>
        <Button
          onClick={requestLocation}
          disabled={loading}
          className="w-full bg-medblue-500 hover:bg-medblue-600"
        >
          {loading ? "Getting location..." : "Share My Location"}
        </Button>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default LocationPrompt;
