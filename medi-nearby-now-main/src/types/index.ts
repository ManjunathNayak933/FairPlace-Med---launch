
export interface User {
  _id: string;
  id: string;
  name: string;
  phone: string;
  addresses: Address[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

export interface Product {
  _id: string; // MongoDB ObjectId as string
  id?: string; // Optional legacy id field
  name: string;
  description: string;
  price: number;
  image: string;
  isGeneric: boolean; // 'G' tagged product requiring prescription
  sellerId: string;
  sellerDistance?: number; // Distance from user in kilometers
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  stock:number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  address: Address;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  prescriptionImage?: string;
  createdAt: string;
}

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface CartState {
  items: CartItem[];
  prescriptionImage: string | null;
}
