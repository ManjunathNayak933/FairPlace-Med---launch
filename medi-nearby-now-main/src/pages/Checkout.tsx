import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Address } from "../types";
import { saveAddress, saveOrder } from "../services/dataService";
import { placeOrder } from "../services/orderService";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AddressForm from "../components/AddressForm";
import { toast } from "../components/ui/sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Backend order payload type
interface BackendOrderItem {
  productId: string;
  quantity: number;
}
interface BackendOrderPayload {
  buyer: string;
  items: BackendOrderItem[];
  total: number;
  address: Address;
  prescriptionImage?: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: string;
}

const Checkout = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { items, totalAmount, prescriptionImage, clearCart } = useCart();
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // On component mount
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Redirect if cart is empty and no prescription
    if (items.length === 0 && !prescriptionImage) {
      navigate("/cart");
      return;
    }
    
    // Set default address if available
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else {
        setSelectedAddressId(user.addresses[0].id);
      }
    } else {
      // Show add address dialog if no addresses
      setIsAddAddressDialogOpen(true);
    }
  }, [isAuthenticated, user, items, prescriptionImage, navigate]);
  
  // Handle new address submission
  const handleAddAddress = (address: Address) => {
    if (!user) return;
    
    const updatedUser = saveAddress(user, address);
    updateUser(updatedUser);
    setSelectedAddressId(address.id);
    setIsAddAddressDialogOpen(false);
    
    toast.success("Address saved successfully");
  };
  
  // Handle place order
  const handlePlaceOrder = async () => {
    if (!user || !selectedAddressId) return;
    setIsProcessing(true);
    try {
      // Find the selected address
      const selectedAddress = user.addresses.find(addr => addr.id === selectedAddressId);
      if (!selectedAddress) throw new Error("Selected address not found");

      // Get buyer info from localStorage (set at login)
      const buyer = JSON.parse(localStorage.getItem("buyer") || "null");
      const buyerToken = localStorage.getItem("buyerToken");
      if (!buyer || !buyer.id) throw new Error("Buyer not found. Please login again.");

      // Prepare order payload for backend
      const orderPayload: BackendOrderPayload = {
        buyer: buyer.id,
        items: items.map(item => ({
          productId: item.product._id, // Use MongoDB _id from Product
          quantity: item.quantity
        })),
        total: totalAmount + 20,
        address: selectedAddress as Address,
        prescriptionImage,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      await placeOrder(orderPayload, buyerToken || undefined);

      // Clear the cart
      clearCart();

      // Show success message
      toast.success("Order placed successfully!");

      // Redirect to orders page
      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <div className="med-container py-8 animate-fade-in">
      <h1 className="text-xl font-semibold mb-6">Checkout</h1>
      
      {/* Delivery Address */}
      <div className="med-card mb-4">
        <h2 className="font-medium mb-4">Delivery Address</h2>
        
        {user.addresses.length > 0 ? (
          <>
            <RadioGroup
              value={selectedAddressId || undefined}
              onValueChange={setSelectedAddressId}
              className="space-y-3"
            >
              {user.addresses.map(address => (
                <div key={address.id} className="flex items-start space-x-2 p-3 border rounded-md">
                  <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={address.id} className="font-medium cursor-pointer">
                      {address.street}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    {address.isDefault && (
                      <span className="text-xs bg-medblue-100 text-medblue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                        Default
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>
            
            <Button
              variant="outline"
              onClick={() => setIsAddAddressDialogOpen(true)}
              className="mt-4 w-full"
            >
              Add New Address
            </Button>
          </>
        ) : (
          <p className="text-gray-500">No addresses found. Please add one.</p>
        )}
      </div>
      
      {/* Order Summary */}
      <div className="med-card mb-4">
        <h2 className="font-medium mb-4">Order Summary</h2>
        
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.product._id} className="flex justify-between text-sm">
                <span>
                  {item.product.name} × {item.quantity}
                  {item.product.isGeneric && (
                    <span className="text-yellow-500 ml-1">(Rx)</span>
                  )}
                </span>
                <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Prescription order only.</p>
        )}
        
        {prescriptionImage && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-sm font-medium">Prescription Uploaded</p>
            <div className="mt-2 h-16 w-16 relative overflow-hidden rounded-md">
              <img
                src={prescriptionImage}
                alt="Prescription"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        )}
        
        <div className="border-t mt-4 pt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span>₹20.00</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span>₹{(totalAmount + 20).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Payment Section */}
      <div className="med-card mb-4">
        <h2 className="font-medium mb-4">Payment</h2>
        <p className="text-gray-600 mb-2">Payment method: Cash on Delivery</p>
        <p className="text-xs text-gray-500">You can pay when your order is delivered</p>
      </div>
      
      {/* Place Order Button */}
      <Button
        onClick={handlePlaceOrder}
        className="w-full bg-medblue-500 hover:bg-medblue-600"
        disabled={!selectedAddressId || isProcessing}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </Button>
      
      {/* Add Address Dialog */}
      <Dialog open={isAddAddressDialogOpen} onOpenChange={setIsAddAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <AddressForm onSubmit={handleAddAddress} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Checkout;
