import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { fetchOrders } from "../lib/utils";
import { toast } from "../components/ui/use-toast";

export type OrderStatus = "pending" | "accepted" | "rejected" | "fulfilled";
export type Order = {
  id: string;
  sellerId: string;
  buyerId: string;
  items: any[];
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
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context)
    throw new Error("useOrders must be used within an OrderProvider");
  return context;
};

export const OrderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchOrders().then((data) => {
      setOrders(data.orders || []);
      setLoading(false);
    });
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    // TODO: Replace with backend API call (e.g., PUT /api/orders/:id)
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
    toast({
      title: "Order updated",
      description: `Order status changed to ${status}`,
    });
  };

  return (
    <OrderContext.Provider value={{ orders, loading, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};
