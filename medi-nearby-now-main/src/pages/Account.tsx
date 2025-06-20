
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddressForm from "../components/AddressForm";
import { Address } from "../types";
import { saveAddress } from "../services/dataService";
import { toast } from "../components/ui/sonner";
import { User, MapPin, LogOut, Package } from "lucide-react";

const Account = () => {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  const handleAddressSubmit = (addressData: Partial<Address>) => {
    if (!user) return;
    
    // Ensure all required fields are present before saving
    if (!addressData.street || !addressData.city || !addressData.state || !addressData.postalCode) {
      toast.error("Please fill in all required address fields");
      return;
    }
    
    // Create a complete Address object with all required fields
    const address: Address = {
      id: addressData.id || crypto.randomUUID(),
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      postalCode: addressData.postalCode,
      isDefault: addressData.isDefault || false,
      latitude: addressData.latitude || 0,
      longitude: addressData.longitude || 0,
    };
    
    const updatedUser = saveAddress(user, address);
    updateUser(updatedUser);
    setIsAddAddressDialogOpen(false);
    setEditingAddress(null);
    
    toast.success(
      editingAddress ? "Address updated successfully" : "Address added successfully"
    );
  };
  
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddAddressDialogOpen(true);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  if (!user) return null;
  
  return (
    <div className="med-container py-8 animate-fade-in">
      <h1 className="text-xl font-semibold mb-6">Your Account</h1>
      
      {/* Profile Section */}
      <div className="med-card mb-6">
        <div className="flex items-center">
          <div className="h-16 w-16 bg-medblue-100 rounded-full flex items-center justify-center mr-4">
            <User className="h-8 w-8 text-medblue-500" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">{user.name}</h2>
            <p className="text-gray-600">{user.phone}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-4 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      {/* Addresses Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Addresses</h2>
          <Button
            size="sm"
            onClick={() => {
              setEditingAddress(null);
              setIsAddAddressDialogOpen(true);
            }}
            className="bg-medblue-500 hover:bg-medblue-600"
          >
            Add New
          </Button>
        </div>
        
        {user.addresses.length === 0 ? (
          <div className="med-card text-center py-6">
            <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 mb-4">No addresses added yet</p>
            <Button
              variant="outline"
              onClick={() => {
                setEditingAddress(null);
                setIsAddAddressDialogOpen(true);
              }}
            >
              Add Your First Address
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {user.addresses.map((address) => (
              <div key={address.id} className="med-card">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{address.street}</p>
                    <p className="text-sm text-gray-500">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    {address.isDefault && (
                      <span className="text-xs bg-medblue-100 text-medblue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                        Default
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditAddress(address)}
                    className="h-8"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Orders Shortcut */}
      <Button
        variant="outline"
        onClick={() => navigate("/orders")}
        className="w-full"
      >
        <Package className="h-4 w-4 mr-2" />
        View Your Orders
      </Button>
      
      {/* Add/Edit Address Dialog */}
      <Dialog open={isAddAddressDialogOpen} onOpenChange={setIsAddAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>
          <AddressForm
            onSubmit={handleAddressSubmit}
            defaultValues={editingAddress || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;
