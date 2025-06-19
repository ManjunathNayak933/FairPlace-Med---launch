
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Seller, Order, DashboardStats } from "../types";
import { getSellers, getOrders, deleteSeller, completeOrder, getDashboardStats } from "../lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AdminContextType {
  sellers: Seller[];
  orders: Order[];
  stats: DashboardStats;
  loading: boolean;
  error: string | null;
  handleDeleteSeller: (id: string) => Promise<void>;
  handleCompleteOrder: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSellers: 0,
    activeSellers: 0,
    pendingOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sellersData, ordersData, statsData] = await Promise.all([
          getSellers(),
          getOrders(),
          getDashboardStats()
        ]);
        
        setSellers(sellersData);
        setOrders(ordersData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleDeleteSeller = async (id: string) => {
    try {
      await deleteSeller(id);
      // Update local state to reflect deletion
      setSellers(prev => prev.filter(seller => seller.id !== id));
      setStats(prev => ({
        ...prev,
        totalSellers: prev.totalSellers - 1,
        activeSellers: sellers.find(s => s.id === id)?.status === 'active' 
          ? prev.activeSellers - 1 
          : prev.activeSellers
      }));
      
      toast({
        title: "Success",
        description: "Seller deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete seller. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteOrder = async (id: string) => {
    try {
      await completeOrder(id);
      // Update local state to reflect completion
      setOrders(prev => prev.map(order => 
        order.id === id 
          ? { ...order, status: "completed" } 
          : order
      ));
      
      setStats(prev => ({
        ...prev,
        inProgressOrders: prev.inProgressOrders - 1,
        completedOrders: prev.completedOrders + 1
      }));
      
      toast({
        title: "Success",
        description: "Order completed successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to complete order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [sellersData, ordersData, statsData] = await Promise.all([
        getSellers(),
        getOrders(),
        getDashboardStats()
      ]);
      
      setSellers(sellersData);
      setOrders(ordersData);
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider 
      value={{ 
        sellers, 
        orders, 
        stats,
        loading, 
        error, 
        handleDeleteSeller, 
        handleCompleteOrder,
        refreshData
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext };
export type { AdminContextType };
