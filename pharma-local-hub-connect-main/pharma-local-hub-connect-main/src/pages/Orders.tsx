
import React, { useState } from 'react';
import { useOrders, Order, OrderStatus } from '@/contexts/OrderContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Package, Clock, Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';

const Orders = () => {
  const { pendingOrders, acceptedOrders, fulfilledOrders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const filterOrders = (orders: Order[]) => {
    if (!searchQuery) return orders;
    
    return orders.filter(order => 
      order.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rejected</Badge>;
      case 'fulfilled':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Fulfilled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search orders by customer name or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingOrders.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedOrders.length})
          </TabsTrigger>
          <TabsTrigger value="fulfilled">
            Fulfilled ({fulfilledOrders.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
          <OrdersList 
            orders={filterOrders(pendingOrders)} 
            onViewOrder={viewOrderDetails}
            onUpdateStatus={(id, status) => updateOrderStatus(id, status)}
            showActions
          />
        </TabsContent>
        
        <TabsContent value="accepted" className="mt-4">
          <OrdersList 
            orders={filterOrders(acceptedOrders)} 
            onViewOrder={viewOrderDetails}
            onUpdateStatus={(id, status) => updateOrderStatus(id, status)}
            showActions
            actionLabel="Mark as Fulfilled"
            actionStatus="fulfilled"
          />
        </TabsContent>
        
        <TabsContent value="fulfilled" className="mt-4">
          <OrdersList 
            orders={filterOrders(fulfilledOrders)} 
            onViewOrder={viewOrderDetails}
            onUpdateStatus={(id) => {}}
          />
        </TabsContent>
      </Tabs>
      
      {selectedOrder && (
        <OrderDetailsDialog 
          order={selectedOrder} 
          open={viewDialogOpen} 
          onOpenChange={setViewDialogOpen} 
          onUpdateStatus={(status) => {
            updateOrderStatus(selectedOrder.id, status);
            if (status !== 'pending') setViewDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

interface OrdersListProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  showActions?: boolean;
  actionLabel?: string;
  actionStatus?: OrderStatus;
}

const OrdersList = ({ 
  orders, 
  onViewOrder, 
  onUpdateStatus, 
  showActions = false,
  actionLabel = "Accept",
  actionStatus = "accepted"
}: OrdersListProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden card-hover">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{order.buyerName}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-sm text-gray-500">Order #{order.id.slice(-6)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                </p>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <div className="font-bold text-lg mr-2">₹{order.total}</div>
                <Button variant="outline" size="sm" onClick={() => onViewOrder(order)}>
                  View
                </Button>
                {showActions && (
                  <>
                    {order.status === 'pending' ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-med-red border-med-red"
                          onClick={() => onUpdateStatus(order.id, 'rejected')}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-med-green hover:bg-med-green/90"
                          onClick={() => onUpdateStatus(order.id, 'accepted')}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => onUpdateStatus(order.id, actionStatus)}
                      >
                        {actionLabel}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (status: OrderStatus) => void;
}

const OrderDetailsDialog = ({ order, open, onOpenChange, onUpdateStatus }: OrderDetailsDialogProps) => {
  const getStatusIcon = () => {
    switch (order.status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <Check className="h-5 w-5 text-blue-500" />;
      case 'rejected':
        return <X className="h-5 w-5 text-red-500" />;
      case 'fulfilled':
        return <Check className="h-5 w-5 text-green-500" />;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {getStatusIcon()}
            <span className="ml-2">Order #{order.id.slice(-6)}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Customer</h4>
              <p>{order.buyerName}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Phone</h4>
              <p>{order.buyerPhone}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Delivery Address</h4>
            <p>{order.deliveryAddress}</p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>
                    {item.name} <span className="text-gray-500">× {item.quantity}</span>
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
          
          {order.status === 'pending' && (
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                className="flex-1 text-med-red border-med-red"
                onClick={() => onUpdateStatus('rejected')}
              >
                <X className="h-4 w-4 mr-1" />
                Reject Order
              </Button>
              <Button 
                className="flex-1 bg-med-green hover:bg-med-green/90"
                onClick={() => onUpdateStatus('accepted')}
              >
                <Check className="h-4 w-4 mr-1" />
                Accept Order
              </Button>
            </div>
          )}
          
          {order.status === 'accepted' && (
            <Button 
              className="w-full"
              onClick={() => onUpdateStatus('fulfilled')}
            >
              Mark as Fulfilled
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
    case 'accepted':
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Accepted</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rejected</Badge>;
    case 'fulfilled':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Fulfilled</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

export default Orders;
