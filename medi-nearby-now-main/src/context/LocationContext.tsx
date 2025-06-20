
import React, { createContext, useState, useEffect, useContext } from "react";
import { LocationState } from "../types";
import { toast } from "../components/ui/sonner";

interface LocationContextType extends LocationState {
  requestLocation: () => Promise<void>;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  isWithinRadius: (lat: number, lon: number, radiusKm: number) => boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locationState, setLocationState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  // Try to get user's location on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem("medUserLocation");
    
    if (storedLocation) {
      try {
        const { latitude, longitude } = JSON.parse(storedLocation);
        setLocationState({
          latitude,
          longitude,
          error: null,
          loading: false,
        });
      } catch (error) {
        localStorage.removeItem("medUserLocation");
      }
    } else {
      // Request location automatically
      requestLocation();
    }
  }, []);

  // Function to request user's location
  const requestLocation = async (): Promise<void> => {
    setLocationState((prev) => ({ ...prev, loading: true }));
    
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }
      
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });
      
      const { latitude, longitude } = position.coords;
      
      // Store location in localStorage for persistence
      localStorage.setItem(
        "medUserLocation",
        JSON.stringify({ latitude, longitude })
      );
      
      setLocationState({
        latitude,
        longitude,
        error: null,
        loading: false,
      });
      
      toast.success("Location accessed", {
        description: "We'll show you nearby medicines"
      });
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Unable to retrieve your location";
      
      setLocationState({
        latitude: null,
        longitude: null,
        error: errorMessage,
        loading: false,
      });
      
      toast.error("Location error", {
        description: "Please enable location services to see nearby medicines"
      });
    }
  };

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  // Check if a location is within the radius
  const isWithinRadius = (lat: number, lon: number, radiusKm: number): boolean => {
    if (!locationState.latitude || !locationState.longitude) return false;
    const distance = calculateDistance(
      locationState.latitude,
      locationState.longitude,
      lat,
      lon
    );
    return distance <= radiusKm;
  };

  return (
    <LocationContext.Provider
      value={{
        ...locationState,
        requestLocation,
        calculateDistance,
        isWithinRadius,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
