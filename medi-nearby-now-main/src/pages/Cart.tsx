
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash, Minus, Plus, FileImage } from "lucide-react";
import ImageUploader from "../components/ImageUploader";

const Cart = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, prescriptionImage, totalAmount, updateQuantity, removeItem, hasGenericMedicine, uploadPrescription, removePrescription } = useCart();
  const navigate = useNavigate();
  const [isShowingPrescriptionUpload, setIsShowingPrescriptionUpload] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleUploadPrescription = (imageUrl: string) => {
    uploadPrescription(imageUrl);
    setIsShowingPrescriptionUpload(false);
  };

  const handleCheckout = () => {
    if (hasGenericMedicine && !prescriptionImage) {
      setIsShowingPrescriptionUpload(true);
      return;
    }
    navigate("/checkout");
  };

  if (isShowingPrescriptionUpload) {
    return (
      <div className="med-container py-8 animate-fade-in">
        <h1 className="text-xl font-semibold mb-6">Upload Prescription</h1>
        <div className="med-card mb-4">
          <p className="text-gray-600 mb-4">
            You have generic medicines in your cart. Please upload a valid prescription to continue.
          </p>
          <ImageUploader onImageUploaded={handleUploadPrescription} label="Upload Prescription" />
          <Button
            variant="outline"
            onClick={() => setIsShowingPrescriptionUpload(false)}
            className="w-full mt-4"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="med-container py-8 animate-fade-in">
      <h1 className="text-xl font-semibold mb-6">Your Cart</h1>

      {items.length === 0 && !prescriptionImage ? (
        <div className="med-card text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Button
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
            className="bg-medblue-500 hover:bg-medblue-600"
          >
            Browse Medicines
          </Button>

          <div className="mt-6 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsShowingPrescriptionUpload(true)}
              className="w-full"
            >
              <FileImage className="mr-2 h-4 w-4" />
              Order with Prescription Only
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Cart items */}
          {items.length > 0 && (
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={item.product._id} className="med-card flex items-center">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.description}</p>
                    <p className="text-medblue-700 font-semibold mt-1">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                      className="h-7 w-7"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                      className="h-7 w-7"
                      disabled={item.quantity >= item.product?.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeItem(item.product._id)}
                      className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Prescription section */}
          {prescriptionImage ? (
            <div className="med-card mb-4">
              <h3 className="font-medium mb-2">Prescription</h3>
              <div className="relative">
                <img
                  src={prescriptionImage}
                  alt="Prescription"
                  className="w-full h-40 object-cover rounded-md"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={removePrescription}
                  className="absolute top-2 right-2"
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : hasGenericMedicine ? (
            <div className="med-card mb-4">
              <p className="text-yellow-700 mb-2">
                Your cart contains generic medicines that require a prescription.
              </p>
              <Button
                variant="outline"
                onClick={() => setIsShowingPrescriptionUpload(true)}
                className="w-full"
              >
                <FileImage className="mr-2 h-4 w-4" />
                Upload Prescription
              </Button>
            </div>
          ) : (
            <div className="med-card mb-4">
              <Button
                variant="outline"
                onClick={() => setIsShowingPrescriptionUpload(true)}
                className="w-full"
              >
                <FileImage className="mr-2 h-4 w-4" />
                Upload Prescription (Optional)
              </Button>
            </div>
          )}

          {/* Order summary */}
          <div className="med-card">
            <h3 className="font-medium mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>₹20.00</span>
              </div>
              <div className="border-t my-2 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{(totalAmount + 20).toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full mt-4 bg-medblue-500 hover:bg-medblue-600"
              disabled={(hasGenericMedicine && !prescriptionImage) && items.length > 0}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
