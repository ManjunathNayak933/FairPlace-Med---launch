
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

type LocationContextType = {
  userLocation: { lat: number; lng: number } | null;
  locationPermissionGranted: boolean;
  requestLocationPermission: () => Promise<boolean>;
  loading: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const requestLocationPermission = async (): Promise<boolean> => {
    setLoading(true);
    try {
      if (!navigator.geolocation) {
        toast({
          title: "Error",
          description: "Geolocation is not supported by this browser.",
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      setLocationPermissionGranted(true);
      toast({
        title: "Success",
        description: "Location access granted",
      });
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: "Permission Denied",
        description: "We need location access to proceed. Please enable it in your browser settings.",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  // Check for stored location permission on init
  useEffect(() => {
    const storedPermission = localStorage.getItem('locationPermission') === 'granted';
    setLocationPermissionGranted(storedPermission);
    
    // If permission was previously granted, try to get current location
    if (storedPermission) {
      requestLocationPermission().then(success => {
        if (!success) {
          localStorage.removeItem('locationPermission');
          setLocationPermissionGranted(false);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  // Save permission state to localStorage when it changes
  useEffect(() => {
    if (locationPermissionGranted) {
      localStorage.setItem('locationPermission', 'granted');
    }
  }, [locationPermissionGranted]);

  return (
    <LocationContext.Provider value={{
      userLocation,
      locationPermissionGranted,
      requestLocationPermission,
      loading
    }}>
      {children}
    </LocationContext.Provider>
  );
};
