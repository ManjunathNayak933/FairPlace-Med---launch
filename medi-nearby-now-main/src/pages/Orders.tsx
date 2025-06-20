import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import { fetchBuyerOrders } from "../services/orderApi";
import { Order } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, FileImage, ChevronRight, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const OrderStatusBadge = ({ status }: { status: Order["status"] }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <Badge variant="outline" className={`${statusColors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Helper type for order items (robust to both shapes)
type OrderItemType = {
  product?: { id: string; name: string; price: number; isGeneric?: boolean };
  name?: string;
  price?: number;
  quantity: number;
  isGeneric?: boolean;
};

const Orders = () => {
  const auth = useContext(AuthContext) as AuthContextType;
  const user = auth?.user;
  const isAuthenticated = auth?.isAuthenticated;
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setIsLoading(true);
      fetchBuyerOrders(user.id)
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, user, navigate]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="med-container py-8 animate-fade-in">
      <h1 className="text-xl font-semibold mb-6">Your Orders</h1>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-medblue-200 border-t-medblue-500 animate-spin mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="med-card text-center py-8">
          <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
          <Button
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
            className="bg-medblue-500 hover:bg-medblue-600"
          >
            Browse Medicines
          </Button>

        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="med-card animate-slide-in">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id?.toString().slice(-8)}</p>
                  <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status as Order["status"]} />
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="py-2">
                    <div className="flex flex-1 justify-between items-center pr-4">
                      <span className="font-medium">Order Details</span>
                      <span className="font-semibold">₹{(order.totalAmount)?.toFixed(2)}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {(order.items as OrderItemType[]).map((item, idx) => (
                          <div key={item.product?.id || item.name || idx} className="flex justify-between text-sm">
                            <span>
                              {(item.product?.name || item.name) + " × " + item.quantity}
                              {(item.product?.isGeneric || item.isGeneric) && (
                                <span className="text-yellow-500 ml-1">(Rx)</span>
                              )}
                            </span>
                            <span>₹{((item.product?.price ?? item.price ?? 0) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">Prescription order only.</p>
                    )}
                    {order.prescriptionImage && (
                      <div className="mb-4">
                        <p className="text-sm font-medium flex items-center mb-2">
                          <FileImage className="h-4 w-4 mr-1" />
                          Prescription
                        </p>
                        <div className="h-20 w-20 relative overflow-hidden rounded-md">
                          <img
                            src={order.prescriptionImage}
                            alt="Prescription"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium mb-1">Delivery Address</p>
                      <p className="text-xs text-gray-500">
                        {order.address?.street}, {order.address?.city}, {order.address?.state} {order.address?.postalCode}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
