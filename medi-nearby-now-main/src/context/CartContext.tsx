import React, { createContext, useState, useContext, useEffect } from "react";
import { CartState, CartItem, Product } from "../types";
import { toast } from "../components/ui/sonner";

interface CartContextType extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  clearCartAfterOrder: () => void;
  uploadPrescription: (imageUrl: string) => void;
  removePrescription: () => void;
  hasGenericMedicine: boolean;
  totalItems: number;
  totalAmount: number;
  undoRemoveItem: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartState, setCartState] = useState<CartState>({
    items: [],
    prescriptionImage: null,
  });
  
  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("medCart");
    if (storedCart) {
      try {
        setCartState(JSON.parse(storedCart));
      } catch (error) {
        localStorage.removeItem("medCart");
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("medCart", JSON.stringify(cartState));
  }, [cartState]);
  
  const addItem = (product: Product, quantity = 1) => {
    setCartState((prevState) => {
      // Always add as a new cart line, even if product already exists
      const updatedItems = [...prevState.items, { product, quantity }];
      toast.success(`${product.name} added to cart`, {
        description: `${quantity} item${quantity > 1 ? 's' : ''} added as a new entry`
      });
      return {
        ...prevState,
        items: updatedItems,
      };
    });
  };
  
  // Enhanced: Add clearCartAfterOrder and undo remove item
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);
  const removeItem = (productId: string) => {
    setCartState((prevState) => {
      const itemToRemove = prevState.items.find((item) => item.product._id === productId);
      const updatedItems = prevState.items.filter((item) => item.product._id !== productId);
      if (itemToRemove) setLastRemovedItem(itemToRemove);
      toast.info("Item removed from cart", {
        action: {
          label: "Undo",
          onClick: () => undoRemoveItem(),
        },
      });
      return {
        ...prevState,
        items: updatedItems,
      };
    });
  };
  const undoRemoveItem = () => {
    if (lastRemovedItem) {
      setCartState((prevState) => ({
        ...prevState,
        items: [...prevState.items, lastRemovedItem],
      }));
      toast.success("Item restored to cart");
      setLastRemovedItem(null);
    }
  };

  // Enhanced: Clear cart after successful order
  const clearCartAfterOrder = () => {
    setCartState({ items: [], prescriptionImage: null });
    toast.success("Order placed! Cart cleared.");
  };
  
  const clearCart = () => {
    setCartState({
      items: [],
      prescriptionImage: null,
    });
    
    toast.info("Cart cleared");
  };
  
  const uploadPrescription = (imageUrl: string) => {
    setCartState((prevState) => ({
      ...prevState,
      prescriptionImage: imageUrl,
    }));
    
    toast.success("Prescription uploaded successfully");
  };
  
  const removePrescription = () => {
    setCartState((prevState) => ({
      ...prevState,
      prescriptionImage: null,
    }));
    
    toast.info("Prescription removed");
  };
  
  // Update quantity of a specific item (for multi-line cart, only updates the first match)
  const updateQuantity = (productId: string, quantity: number) => {
    setCartState((prevState) => {
      // Find the first matching item and update its quantity
      const updatedItems = [...prevState.items];
      const idx = updatedItems.findIndex((item) => item.product._id === productId);
      if (idx !== -1) {
        if (quantity < 1) {
          updatedItems.splice(idx, 1);
        } else {
          updatedItems[idx] = { ...updatedItems[idx], quantity };
        }
      }
      return {
        ...prevState,
        items: updatedItems,
      };
    });
    toast.info("Item quantity updated");
  };

  // Calculate if there's any generic medicine in cart
  const hasGenericMedicine = cartState.items.some(
    (item) => item.product.isGeneric
  );
  
  // Calculate total number of items
  const totalItems = cartState.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  
  // Calculate total amount
  const totalAmount = cartState.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  
  return (
    <CartContext.Provider
      value={{
        ...cartState,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearCartAfterOrder,
        uploadPrescription,
        removePrescription,
        hasGenericMedicine,
        totalItems,
        totalAmount,
        undoRemoveItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
