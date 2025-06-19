
export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  status: "active" | "inactive";
  createdAt: string;
}

export interface Buyer {
  id: string;
  name: string;
  phone: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface Order {
  id: string;
  status: "pending" | "accepted" | "in-progress" | "completed" | "cancelled";
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  buyer: Buyer;
  seller?: Seller;
  createdAt: string;
  prescription?: {
    id: string;
    imageUrl: string;
    notes?: string;
  };
}

export interface DashboardStats {
  totalSellers: number;
  activeSellers: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
}
