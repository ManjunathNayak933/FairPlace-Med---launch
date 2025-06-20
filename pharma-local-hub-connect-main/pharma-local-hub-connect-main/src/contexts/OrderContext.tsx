import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";
import { Product } from "./ProductContext";
import { fetchOrders, updateOrderStatusInBackend } from "../lib/utils";

export type OrderStatus = "pending" | "accepted" | "rejected" | "fulfilled";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  sellerId: string;
  buyerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: string;
  buyerName: string;
  buyerPhone: string;
};

type OrderContextType = {
  orders: Order[];
  loading: boolean;
  todayOrders: Order[];
  pendingOrders: Order[];
  acceptedOrders: Order[];
  fulfilledOrders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getTotalEarnings: () => number;
  getTodayEarnings: () => number;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load orders for seller from backend API
  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchOrders(user._id).then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
    }
  }, [user]);

  // Filter orders by status
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const acceptedOrders = orders.filter((order) => order.status === "accepted");
  const fulfilledOrders = orders.filter(
    (order) => order.status === "fulfilled"
  );

  // Update order status and persist to backend
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatusInBackend(orderId, status, user?._id);
      // Refresh orders after update
      if (user) {
        const data = await fetchOrders(user._id);
        setOrders(data.orders || []);
      }
      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  // Calculate earnings
  const getTotalEarnings = () => {
    return orders
      .filter((order) => order.status === "fulfilled")
      .reduce((sum, order) => sum + order.total, 0);
  };

  const getTodayEarnings = () => {
    const today = new Date().toDateString();

    return orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt).toDateString();
        return orderDate === today && order.status === "fulfilled";
      })
      .reduce((sum, order) => sum + order.total, 0);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        todayOrders,
        pendingOrders,
        acceptedOrders,
        fulfilledOrders,
        updateOrderStatus,
        getTotalEarnings,
        getTodayEarnings,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
