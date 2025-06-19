import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";
import { fetchMedicinesPaginated, addProductToBackend } from "../lib/utils";
import axios from "axios";
import { API_BASE_URL } from "@/config";

export type Product = {
  id?: string;
  _id?: string; // MongoDB _id for backend products
  name: string;
  description: string;
  price: number;
  stock: number;
  isGTagged: boolean; // Special 'G' tag for certain medicines
  sellerId: string;
  image?: string;
  category?: string;
};

type ProductContextType = {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, "id" | "sellerId">) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkAddProducts: (products: Omit<Product, "id" | "sellerId">[]) => void;
  fetchProducts: (page?: number, limit?: number) => void; // Accept page/limit
};

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

// useProducts hook moved to useProducts.ts

export const ProductProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [page, setPage] = useState(1);
  const [limit] = useState(100);

  // Fetch products from backend for this seller (paginated)
  const fetchProducts = async (fetchPage = page, fetchLimit = limit) => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchMedicinesPaginated(fetchPage, fetchLimit);
      // Only show products for this seller
      const sellerProducts = Array.isArray(data.products)
        ? data.products.filter((p) => String(p.sellerId) === String(user._id))
        : [];
      setProducts(sellerProducts);
    } finally {
      setLoading(false);
    }
  };

  // Load products for seller from backend API
  useEffect(() => {
    // Only fetch if authLoading is false (user restoration complete)
    if (typeof authLoading === "boolean" && !authLoading) {
      if (user) {
        fetchProducts(page, limit);
      } else {
        setProducts([]); // Clear products immediately if user logs out
      }
    }
  }, [user, authLoading, page, limit]);

  const addProduct = async (productData: Omit<Product, "id" | "sellerId">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add products",
        variant: "destructive",
      });
      return;
    }
    try {
      await addProductToBackend(productData, user._id);
      await fetchProducts(); // Refetch after add
      toast({
        title: "Product added",
        description: `${productData.name} has been added to your inventory`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to backend",
        variant: "destructive",
      });
    }
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id || product._id === id
          ? { ...product, ...data }
          : product
      )
    );
    toast({
      title: "Product updated",
      description: "The product has been updated successfully",
    });
  };

  const deleteProduct = async (id: string) => {
    try {
      console.log ("DELETE api called")
      const res = await axios.delete(`${API_BASE_URL}/api/medicines/${id}`);
      console.log(res, "DELETE api FINISHED")
      toast({
        title: "Product removed",
        description: "The product has been removed from your inventory",
      });
    } catch (error) {
      toast({
        title: "Product delete error",
        description: "",
      });
    }
  };

  const bulkAddProducts = (
    productsData: Omit<Product, "id" | "sellerId">[]
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add products",
        variant: "destructive",
      });
      return;
    }

    const newProducts = productsData.map((product) => ({
      ...product,
      id:
        "product_" +
        Date.now().toString() +
        "_" +
        Math.random().toString(36).substr(2, 9),
      sellerId: user._id,
    }));

    setProducts((prevProducts) => [...prevProducts, ...newProducts]);

    toast({
      title: "Products added",
      description: `${newProducts.length} products have been added to your inventory`,
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkAddProducts,
        fetchProducts,
        // Optionally expose setPage if you want to control pagination from components
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
