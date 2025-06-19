
// import React, { useEffect, useState } from "react";
// import { useAdmin } from "@/hooks/useAdmin";
// import { 
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger
// } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Order } from "@/types";
// import { MapPin, Phone, User, Clock, Check, Search, FileImage, Download } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { 
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger
// } from "@/components/ui/alert-dialog";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { toast } from "@/hooks/use-toast";
// import { API_BASE_URL } from "@/config";

// function Orders() {
//   const { orders, loading, error } = useAdmin(); // using hook to get orders
//   const [sellerOrders, setSellerOrders] = useState([]);

//   useEffect(() => {
//     const getDataa = async () => {
//       console.log("getDataa called ✅");

//       try {
//         console.log("API_BASE_URL is", API_BASE_URL);
//         const response = await fetch(`${API_BASE_URL}/api/seller-orders`);

//         console.log("Raw response:", response);

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Fetched seller orders ✅", data);
//         setSellerOrders(data); // optional: if you want to use it
//       } catch (error) {
//         console.error("Error fetching seller orders ❌:", error);
//       }
//     };

//     getDataa();
//   }, []);

//   if (loading) return <p>Loading orders...</p>;
//   if (error) return <p>Error loading orders: {error.message}</p>;

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return <Badge variant="secondary">Pending</Badge>;
//       case "accepted":
//         return <Badge variant="outline">Accepted</Badge>;
//       case "in-progress":
//         return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
//       case "completed":
//         return <Badge variant="default" className="bg-green-500">Completed</Badge>;
//       case "cancelled":
//         return <Badge variant="destructive">Cancelled</Badge>;
//       default:
//         return <Badge>{status}</Badge>;
//     }
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', {
//       dateStyle: 'medium',
//       timeStyle: 'short'
//     }).format(date);
//   };

//   const handleDownloadPrescription = () => {
//     if (order.prescription?.imageUrl) {
//       try {
//         // Create an anchor element and set the href to the image URL
//         const a = document.createElement('a');
//         a.href = order.prescription.imageUrl;
//         // Set the download attribute with a filename
//         a.download = `prescription-${order.prescription.id}.jpg`;
//         // Append to the DOM temporarily (needed for Firefox)
//         document.body.appendChild(a);
//         // Trigger the download
//         a.click();
//         // Remove the element
//         document.body.removeChild(a);
        
//         toast({
//           title: "Download started",
//           description: "The prescription image is being downloaded"
//         });
//       } catch (error) {
//         console.error("Download error:", error);
//         toast({
//           variant: "destructive",
//           title: "Download failed",
//           description: "Could not download the prescription image"
//         });
//       }
//     }
//   };

//   return (
//     <Card className="mb-4">
//       <CardHeader className="pb-3">
//         <div className="flex flex-wrap items-start justify-between">
//           <div>
//             <CardTitle className="text-lg">Order #{order.id}</CardTitle>
//             <CardDescription>
//               {formatDate(order.createdAt)}
//             </CardDescription>
//           </div>
//           <div className="flex flex-col items-end">
//             {getStatusBadge(order.status)}
//             <span className="mt-2 font-medium">${order.totalAmount.toFixed(2)}</span>
//           </div>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="space-y-4">
//           <div>
//             <h3 className="text-sm font-medium mb-2">Buyer Information</h3>
//             <div className="bg-slate-50 rounded-md p-3 space-y-2">
//               <div className="flex items-center text-sm">
//                 <User className="h-4 w-4 mr-2 text-muted-foreground" />
//                 <span>{order.buyer.name}</span>
//               </div>
//               <div className="flex items-center text-sm">
//                 <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
//                 <span>{order.buyer.phone}</span>
//               </div>
//               <div className="flex items-center text-sm">
//                 <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
//                 <span className="mr-2">{order.buyer.address}</span>
//                 <a 
//                   href={getBuyerLocationUrl(order.buyer.location.lat, order.buyer.location.lng)} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:text-blue-700"
//                   title="View on map"
//                 >
//                   <MapPin className="h-4 w-4" />
//                 </a>
//               </div>
//             </div>
//           </div>

//           {order.seller && (
//             <div>
//               <h3 className="text-sm font-medium mb-2">Seller Information</h3>
//               <div className="bg-slate-50 rounded-md p-3 space-y-2">
//                 <div className="flex items-center text-sm">
//                   <User className="h-4 w-4 mr-2 text-muted-foreground" />
//                   <span>{order.seller.name}</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
//                   <span>{order.seller.phone}</span>
//                 </div>
//                 <div className="flex items-center text-sm">
//                   <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
//                   <span className="mr-2">{order.seller.address}</span>
//                   <a 
//                     href={getSellerLocationUrl(order.seller.location.lat, order.seller.location.lng)} 
//                     target="_blank" 
//                     rel="noopener noreferrer"
//                     className="text-blue-500 hover:text-blue-700"
//                     title="View on map"
//                   >
//                     <MapPin className="h-4 w-4" />
//                   </a>
//                 </div>
//               </div>
//             </div>
//           )}

//           {order.prescription && (
//             <div>
//               <h3 className="text-sm font-medium mb-2">Prescription</h3>
//               <div className="bg-slate-50 rounded-md p-3 space-y-2">
//                 <div className="flex flex-col sm:flex-row gap-2 justify-between">
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button variant="outline" className="flex items-center justify-center gap-2">
//                         <FileImage className="h-4 w-4" />
//                         View Prescription
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-md w-full">
//                       <DialogHeader>
//                         <DialogTitle>Prescription #{order.prescription.id}</DialogTitle>
//                         <DialogDescription>
//                           {order.prescription.notes && (
//                             <div className="mt-2 p-2 bg-slate-100 rounded-md text-sm">
//                               <p className="font-medium">Notes:</p>
//                               <p>{order.prescription.notes}</p>
//                             </div>
//                           )}
//                         </DialogDescription>
//                       </DialogHeader>
//                       <div className="mt-4">
//                         <img 
//                           src={order.prescription.imageUrl} 
//                           alt="Prescription" 
//                           className="w-full rounded-md border"
//                         />
//                       </div>
//                       <DialogFooter className="mt-4">
//                         <Button 
//                           variant="outline" 
//                           className="flex items-center gap-2"
//                           onClick={handleDownloadPrescription}
//                         >
//                           <Download className="h-4 w-4" />
//                           Download Prescription
//                         </Button>
//                       </DialogFooter>
//                     </DialogContent>
//                   </Dialog>
                  
//                   <Button 
//                     variant="outline" 
//                     className="flex items-center gap-2"
//                     onClick={handleDownloadPrescription}
//                   >
//                     <Download className="h-4 w-4" />
//                     Download
//                   </Button>
//                 </div>
                
//                 {order.prescription.notes && (
//                   <div className="text-sm text-muted-foreground">
//                     <p className="line-clamp-2">Notes: {order.prescription.notes}</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           <div>
//             <h3 className="text-sm font-medium mb-2">Order Items</h3>
//             <div className="bg-slate-50 rounded-md p-3">
//               <div className="space-y-1">
//                 {order.items.map((item, index) => (
//                   <div key={index} className="flex justify-between text-sm">
//                     <span>{item.name} x{item.quantity}</span>
//                     <span>${item.price.toFixed(2)}</span>
//                   </div>
//                 ))}
//                 <Separator className="my-2" />
//                 <div className="flex justify-between font-medium">
//                   <span>Total</span>
//                   <span>${order.totalAmount.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end">
//           {(order.status === "accepted" || order.status === "in-progress") && (
//             <AlertDialog>
//               <AlertDialogTrigger asChild>
//                 <Button className="bg-green-600 hover:bg-green-700">
//                   <Check className="mr-2 h-4 w-4" />
//                   Complete Order
//                 </Button>
//               </AlertDialogTrigger>
//               <AlertDialogContent>
//                 <AlertDialogHeader>
//                   <AlertDialogTitle>Mark order as completed?</AlertDialogTitle>
//                   <AlertDialogDescription>
//                     This action will mark the order as completed. Make sure the delivery has been confirmed by the buyer.
//                   </AlertDialogDescription>
//                 </AlertDialogHeader>
//                 <AlertDialogFooter>
//                   <AlertDialogCancel>Cancel</AlertDialogCancel>
//                   <AlertDialogAction
//                     onClick={() => onCompleteOrder(order.id)}
//                     className="bg-green-600 hover:bg-green-700"
//                   >
//                     Complete
//                   </AlertDialogAction>
//                 </AlertDialogFooter>
//               </AlertDialogContent>
//             </AlertDialog>
//           )}
          
//           {order.status === "completed" && (
//             <div className="text-green-600 flex items-center">
//               <Check className="mr-2 h-4 w-4" />
//               Order Completed
//             </div>
//           )}

//           {order.status === "pending" && (
//             <div className="text-amber-600 flex items-center">
//               <Clock className="mr-2 h-4 w-4" />
//               Waiting for seller acceptance
//             </div>
//           )}

//           {order.status === "cancelled" && (
//             <div className="text-red-600">
//               Order Cancelled
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const Orders = () => {
//   const { orders, loading, handleCompleteOrder } = useAdmin();
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredOrders = orders.filter(
//     order =>
//       order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.buyer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (order.seller?.name && order.seller.name.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const pendingOrders = filteredOrders.filter(order => order.status === "pending");
//   const inProgressOrders = filteredOrders.filter(
//     order => ["accepted", "in-progress"].includes(order.status)
//   );
//   const completedOrders = filteredOrders.filter(order => order.status === "completed");
//   const cancelledOrders = filteredOrders.filter(order => order.status === "cancelled");

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
//         <p className="text-muted-foreground">
//           Track and manage all medicine delivery orders
//         </p>
//       </div>

//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <Tabs defaultValue="in-progress" className="w-full">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
//             <TabsList className="grid grid-cols-4">
//               <TabsTrigger value="in-progress">
//                 In Progress ({inProgressOrders.length})
//               </TabsTrigger>
//               <TabsTrigger value="pending">
//                 Pending ({pendingOrders.length})
//               </TabsTrigger>
//               <TabsTrigger value="completed">
//                 Completed ({completedOrders.length})
//               </TabsTrigger>
//               <TabsTrigger value="cancelled">
//                 Cancelled ({cancelledOrders.length})
//               </TabsTrigger>
//             </TabsList>

//             <div className="relative md:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search orders..."
//                 className="pl-8"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-40">
//               <p>Loading orders...</p>
//             </div>
//           ) : (
//             <>
//               <TabsContent value="in-progress" className="mt-0">
//                 {inProgressOrders.length === 0 ? (
//                   <Card>
//                     <CardContent className="text-center py-10">
//                       <p className="text-muted-foreground">No in-progress orders found</p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="space-y-4">
//                     {inProgressOrders.map(order => (
//                       <OrderCard 
//                         key={order.id} 
//                         order={order} 
//                         onCompleteOrder={handleCompleteOrder}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </TabsContent>

//               <TabsContent value="pending" className="mt-0">
//                 {pendingOrders.length === 0 ? (
//                   <Card>
//                     <CardContent className="text-center py-10">
//                       <p className="text-muted-foreground">No pending orders found</p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="space-y-4">
//                     {pendingOrders.map(order => (
//                       <OrderCard 
//                         key={order.id} 
//                         order={order} 
//                         onCompleteOrder={handleCompleteOrder}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </TabsContent>

//               <TabsContent value="completed" className="mt-0">
//                 {completedOrders.length === 0 ? (
//                   <Card>
//                     <CardContent className="text-center py-10">
//                       <p className="text-muted-foreground">No completed orders found</p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="space-y-4">
//                     {completedOrders.map(order => (
//                       <OrderCard 
//                         key={order.id} 
//                         order={order} 
//                         onCompleteOrder={handleCompleteOrder}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </TabsContent>

//               <TabsContent value="cancelled" className="mt-0">
//                 {cancelledOrders.length === 0 ? (
//                   <Card>
//                     <CardContent className="text-center py-10">
//                       <p className="text-muted-foreground">No cancelled orders found</p>
//                     </CardContent>
//                   </Card>
//                 ) : (
//                   <div className="space-y-4">
//                     {cancelledOrders.map(order => (
//                       <OrderCard 
//                         key={order.id} 
//                         order={order} 
//                         onCompleteOrder={handleCompleteOrder}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </TabsContent>
//             </>
//           )}
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default Orders;

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone,
  User,
  Clock,
  Check,
  FileImage,
  Download,
  Search,
} from "lucide-react";
import { API_BASE_URL } from "@/config";

// Helper to get badge by status, adjust to your API statuses
const getStatusBadge = (status) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "accepted":
      return <Badge variant="outline">Accepted</Badge>;
    case "in-progress":
      return (
        <Badge className="bg-blue-500 text-white">
          In Progress
        </Badge>
      );
    case "completed":
    case "fulfilled": // If your API sends 'fulfilled' instead of completed
      return (
        <Badge className="bg-green-500 text-white">
          Completed
        </Badge>
      );
    case "cancelled":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getMapUrl = (lat, lng) => `https://www.google.com/maps?q=${lat},${lng}`;

function OrderCard({ order, onCompleteOrder }) {
  const handleDownloadPrescription = () => {
    if (order.prescriptionImage) {
      try {
        const a = document.createElement("a");
        a.href = order.prescriptionImage;
        a.download = `prescription-${order._id}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast({
          title: "Download started",
          description: "Prescription is downloading...",
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: "Could not download the prescription.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Order #{order._id.slice(0, 8)}</CardTitle>
            <CardDescription>
              {formatDate(order.createdAt)}
            </CardDescription>
          </div>
          <div className="text-right">
            {getStatusBadge(order.status)}
            <div className="font-semibold mt-1">
              ${order.total.toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium">Buyer Info</h3>
          <div className="text-sm space-y-1">
            <div className="flex items-center">
              {console.log(order,"rrrrrrrrrrrrrr")}
              <User className="mr-2 h-4 w-4" />{" "}
              {order.buyer?.name || order.buyer}
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4" />{" "}
              {order.buyer?.phone || "N/A"}
            </div>
            {order.deliveryAddress && (
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />{" "}
                {order.deliveryAddress.street},{" "}
                {order.deliveryAddress.city}
                {order.deliveryAddress.latitude && order.deliveryAddress.longitude && (
                  <a
                    className="ml-2 text-blue-500"
                    href={getMapUrl(
                      order.deliveryAddress.latitude,
                      order.deliveryAddress.longitude
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {order.prescriptionImage && (
          <div>
            <h3 className="text-sm font-medium">Prescription</h3>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <FileImage className="h-4 w-4" /> View
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Prescription</DialogTitle>
                    <DialogDescription>
                      {order.prescriptionNotes && (
                        <p>{order.prescriptionNotes}</p>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <img
                    src={order.prescriptionImage}
                    alt="Prescription"
                    className="rounded w-full"
                  />
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={handleDownloadPrescription}
                    >
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={handleDownloadPrescription}>
                <Download className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium">Items</h3>
          <div className="text-sm space-y-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  {console.log(item,"itemmmmmmmmmm")}
                  {item.name} x{item.quantity}
                </span>
                <span>$ {item?.productId?.price?.toFixed(2)}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span>Fees</span>
              <span>$ 20</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>$ {order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          {["accepted", "in-progress"].includes(order.status) ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-green-600 text-white">
                  <Check className="mr-2 h-4 w-4" /> Complete Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Mark as Completed?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure the order is fulfilled?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onCompleteOrder(order._id)}
                    className="bg-green-600"
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : order.status === "completed" || order.status === "fulfilled" ? (
            <div className="text-green-600 flex items-center justify-end">
              <Check className="h-4 w-4 mr-2" />
              Order Completed
            </div>
          ) : order.status === "pending" ? (
            <div className="text-yellow-500 flex items-center justify-end">
              <Clock className="h-4 w-4 mr-2" />
              Waiting for seller acceptance
            </div>
          ) : order.status === "cancelled" ? (
            <div className="text-red-500 text-right">Order Cancelled</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("in-progress");
  const [loading, setLoading] = useState(false);

  // Fetch orders from API
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/orders`)
      .then((res) => {
        console.log(res,"ressssssssssssss")
        setOrders(res.data.data || []);
      })
      .catch((err) => {
        toast({
          title: "Error fetching orders",
          description: err.message,
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter orders by search term (buyer name or order id)
  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();
    const buyerName = order.buyer?.name?.toLowerCase() || "";
    const sellerName = order.seller?.name?.toLowerCase() || "";
    return (
      order._id.toLowerCase().includes(search) ||
      buyerName.includes(search) ||
      sellerName.includes(search)
    );
  });

  console.log(filteredOrders,"filteredOrders")
  // Group orders by status categories (adjust status mapping as needed)
  const groupedOrders = {
    "in-progress": filteredOrders.filter((o) =>
      ["accepted", "in-progress"].includes(o.status)
    ),
    completed: filteredOrders.filter((o) =>
      ["completed", "fulfilled"].includes(o.status)
    ),
    pending: filteredOrders.filter((o) => o.status === "pending"),
    cancelled: filteredOrders.filter((o) => o.status === "rejected"),
  };

  // Mark order as completed on server & update UI
  const completeOrder = (orderId) => {
    axios
      .put(`${API_BASE_URL}/api/orders/${orderId}/complete`)
      .then(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: "completed" } : o
          )
        );
        toast({
          title: "Order marked as completed",
          variant: "success",
        });
      })
      .catch(() => {
        toast({
          title: "Failed to complete order",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex mb-4 gap-2 items-center">
        <Input
          placeholder="Search by Order ID or Buyer Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
          leftIcon={<Search />}
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="in-progress">
            In Progress{" "}
            <Badge>{groupedOrders["in-progress"].length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed <Badge>{groupedOrders.completed.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending <Badge>{groupedOrders.pending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled <Badge>{groupedOrders.cancelled.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {Object.entries(groupedOrders).map(([status, ordersForStatus]) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {loading ? (
              <p>Loading orders...</p>
            ) : ordersForStatus.length === 0 ? (
              <p>No {status} orders found.</p>
            ) : (
              ordersForStatus.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onCompleteOrder={completeOrder}
                />
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
