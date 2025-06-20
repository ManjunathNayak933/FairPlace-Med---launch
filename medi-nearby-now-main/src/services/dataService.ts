import { Product, Order, User, Address } from "../types";
import axios from "axios";

// Mock data for products
export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Paracetamol 500mg",
    description: "Fever and pain relief tablets",
    price: 5.99,
    image: "/placeholder.svg",
    isGeneric: false,
    sellerId: "s1",
    category: "Pain Relief",
  },
  {
    id: "p2",
    name: "Amoxicillin 250mg",
    description: "Antibiotic capsules",
    price: 12.50,
    image: "/placeholder.svg",
    isGeneric: true, // Generic medicine requiring prescription
    sellerId: "s1",
    category: "Antibiotics",
  },
  {
    id: "p3",
    name: "Vitamin D3 1000IU",
    description: "Vitamin D supplements",
    price: 8.99,
    image: "/placeholder.svg",
    isGeneric: false,
    sellerId: "s2",
    category: "Vitamins",
  },
  {
    id: "p4",
    name: "Cetrizine 10mg",
    description: "Allergy relief tablets",
    price: 7.25,
    image: "/placeholder.svg",
    isGeneric: false,
    sellerId: "s1",
    category: "Allergy",
  },
  {
    id: "p5",
    name: "Aspirin 75mg",
    description: "Blood thinning tablets",
    price: 4.50,
    image: "/placeholder.svg",
    isGeneric: false,
    sellerId: "s3", 
    category: "Heart Health",
  },
  {
    id: "p6",
    name: "Metformin 500mg",
    description: "Diabetes medication",
    price: 6.75,
    image: "/placeholder.svg",
    isGeneric: true, // Generic medicine requiring prescription
    sellerId: "s2",
    category: "Diabetes",
  },
];

// Mock data for seller locations
const mockSellerLocations = [
  { id: "s1", latitude: 28.6139, longitude: 77.2090 }, // Delhi
  { id: "s2", latitude: 28.6129, longitude: 77.2295 }, // 2km away
  { id: "s3", latitude: 28.5355, longitude: 77.2910 }, // 10km away
];

// Get products with distance calculation
export const getProductsNearby = (
  latitude: number | null,
  longitude: number | null,
  radiusKm: number = 3
): Product[] => {
  if (!latitude || !longitude) {
    return [];
  }

  const nearbyProducts = mockProducts.filter((product) => {
    const sellerLocation = mockSellerLocations.find(
      (loc) => loc.id === product.sellerId
    );
    
    if (!sellerLocation) return false;
    
    // Calculate distance using Haversine formula
    const distance = calculateDistance(
      latitude,
      longitude,
      sellerLocation.latitude,
      sellerLocation.longitude
    );
    
    // Add distance to product
    product.sellerDistance = distance;
    
    // Filter by radius
    return distance <= radiusKm;
  });
  
  // Sort by distance
  return nearbyProducts.sort((a, b) => 
    (a.sellerDistance || Infinity) - (b.sellerDistance || Infinity)
  );
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
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

// Get a specific product by ID
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find((product) => product.id === id);
};

// Mock orders storage
const ORDERS_STORAGE_KEY = "medOrders";

// Save an order
export const saveOrder = (order: Order): Order => {
  // Get existing orders
  const existingOrdersStr = localStorage.getItem(ORDERS_STORAGE_KEY);
  const existingOrders: Order[] = existingOrdersStr 
    ? JSON.parse(existingOrdersStr) 
    : [];
  
  // Add new order
  const updatedOrders = [...existingOrders, order];
  
  // Save back to local storage
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  
  return order;
};

// Get user orders
export const getUserOrders = (userId: string): Order[] => {
  const ordersStr = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!ordersStr) return [];
  
  const orders: Order[] = JSON.parse(ordersStr);
  return orders.filter((order) => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Save address for a user
export const saveAddress = (user: User, address: Address): User => {
  const updatedAddresses = address.id 
    ? user.addresses.map(addr => addr.id === address.id ? address : addr) 
    : [...user.addresses, {...address, id: `address-${Date.now()}`}];
  
  if (address.isDefault) {
    // Make sure only one address is default
    updatedAddresses.forEach(addr => {
      if (addr.id !== address.id) {
        addr.isDefault = false;
      }
    });
  }
  
  // Return user with updated addresses
  return {
    ...user,
    addresses: updatedAddresses,
  };
};

// Real prescription image upload function
export const uploadImage = async (file: File, token?: string): Promise<string> => {
  const formData = new FormData();
  formData.append("prescription", file);
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const apiUrl = import.meta.env.VITE_API_URL || "https://kamyakahub.in";
  const response = await axios.post(`${apiUrl}/api/auth/buyer/upload-prescription`, formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.imageUrl;
};

// Enhanced: Get all products by category
export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase());
};

// Enhanced: Get all unique categories
export const getAllCategories = (): string[] => {
  const categories = mockProducts.map((product) => product.category);
  return Array.from(new Set(categories));
};

// Enhanced: Search products by name or description
export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
  );
};
