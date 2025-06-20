
// import React, { useState } from "react";
// import { useAdmin } from "@/hooks/useAdmin";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardHeader, 
//   CardTitle 
// } from "@/components/ui/card";
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
// import { Badge } from "@/components/ui/badge";
// import { MapPin, Trash2, Search } from "lucide-react";
// import { Seller } from "@/types";

// const Sellers = () => {
//   const { sellers, loading, handleDeleteSeller } = useAdmin();
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredSellers = sellers.filter(
//     seller => 
//       seller.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       seller.address.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const getLocationUrl = (seller: Seller) => {
//     const { lat, lng } = seller.location;
//     return `https://www.google.com/maps?q=${lat},${lng}`;
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold tracking-tight">Sellers Management</h1>
//         <p className="text-muted-foreground">
//           Manage all registered medicine sellers in the platform
//         </p>
//       </div>

//       <Card>
//         <CardHeader className="pb-3">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <CardTitle>All Sellers</CardTitle>
//             <div className="relative w-full md:w-64">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search sellers..."
//                 className="pl-8"
//                 value={searchTerm}
//                 onChange={handleSearch}
//               />
//             </div>
//           </div>
//           <CardDescription>
//             Total: {filteredSellers.length} sellers
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="flex justify-center items-center h-40">
//               <p>Loading sellers...</p>
//             </div>
//           ) : filteredSellers.length === 0 ? (
//             <div className="text-center py-10">
//               <p className="text-muted-foreground">No sellers found</p>
//             </div>
//           ) : (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Name</TableHead>
//                     <TableHead className="hidden md:table-cell">Email</TableHead>
//                     <TableHead className="hidden md:table-cell">Phone</TableHead>
//                     <TableHead className="hidden lg:table-cell">Address</TableHead>
//                     <TableHead className="hidden md:table-cell">Status</TableHead>
//                     <TableHead>Actions</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredSellers.map(seller => (
//                     <TableRow key={seller.id}>
//                       <TableCell className="font-medium">{seller.name}</TableCell>
//                       <TableCell className="hidden md:table-cell">{seller.email}</TableCell>
//                       <TableCell className="hidden md:table-cell">{seller.phone}</TableCell>
//                       <TableCell className="hidden lg:table-cell">
//                         <div className="flex items-center">
//                           {seller.address}
//                           <a 
//                             href={getLocationUrl(seller)} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="ml-2 text-blue-500 hover:text-blue-700"
//                             title="View on map"
//                           >
//                             <MapPin className="h-4 w-4" />
//                           </a>
//                         </div>
//                       </TableCell>
//                       <TableCell className="hidden md:table-cell">
//                         <Badge variant={seller.status === 'active' ? 'default' : 'secondary'}>
//                           {seller.status}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
//                               <Trash2 className="h-4 w-4" />
//                               <span className="sr-only">Delete</span>
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 This will permanently delete the seller {seller.name} and cannot be undone.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDeleteSeller(seller.id)}
//                                 className="bg-red-500 hover:bg-red-600"
//                               >
//                                 Delete
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Sellers;
import React, { useState, useMemo, useEffect } from "react";
import { useAdmin } from "@/hooks/useAdmin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Trash2, Search } from "lucide-react";

interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  shopName?: string;
  gstNumber?: string;
  status: string;
  address?: {
    lat?: number | null;
    lng?: number | null;
  };
}

const Sellers = () => {
  const { sellers, loading, handleDeleteSeller } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  // State to store resolved place names for each seller by ID
  const [placeNames, setPlaceNames] = useState<Record<string, string>>({});

  // Function to reverse geocode lat/lng using Nominatim OpenStreetMap API
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      // Return display_name or fallback
      return data.display_name || "Unknown location";
    } catch (error) {
      return "Unknown location";
    }
  };

  // For each seller with lat/lng, fetch the place name if not already cached
  useEffect(() => {
    sellers.forEach((seller) => {
      const lat = seller.address?.lat;
      const lng = seller.address?.lng;
      if (
        lat != null &&
        lng != null &&
        !placeNames[seller.id] // fetch only if not already fetched
      ) {
        reverseGeocode(lat, lng).then((placeName) => {
          setPlaceNames((prev) => ({ ...prev, [seller.id]: placeName }));
        });
      }
    });
  }, [sellers, placeNames]);

  // Filter sellers based on searchTerm matching name, email, or place name
  const filteredSellers = useMemo(() => {
    return sellers.filter((seller: Seller) => {
      const term = searchTerm.toLowerCase();
      const nameMatch = seller.name.toLowerCase().includes(term);
      const emailMatch = seller.email.toLowerCase().includes(term);

      const placeName = placeNames[seller.id] || "";
      const placeMatch = placeName.toLowerCase().includes(term);

      return nameMatch || emailMatch || placeMatch;
    });
  }, [sellers, searchTerm, placeNames]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Generate Google Maps URL for seller address
  const getLocationUrl = (seller: Seller) => {
    const lat = seller.address?.lat;
    const lng = seller.address?.lng;
    if (lat == null || lng == null) return "#";
    return `https://www.google.com/maps?q=${lat},${lng}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sellers Management</h1>
        <p className="text-muted-foreground">
          Manage all registered medicine sellers in the platform
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Sellers</CardTitle>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sellers..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearch}
                aria-label="Search sellers"
              />
            </div>
          </div>
          <CardDescription>Total: {filteredSellers.length} sellers</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div
              className="flex justify-center items-center h-40"
              role="status"
              aria-live="polite"
            >
              <p>Loading sellers...</p>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No sellers found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Address</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell className="font-medium">{seller.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{seller.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {seller.phone || "-"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell max-w-xs break-words">
                        <div className="flex items-center space-x-1">
                          <span>
                            {placeNames[seller.id] || (
                              <em className="text-sm text-gray-500">Loading...</em>
                            )}
                          </span>
                          {seller.address?.lat != null && seller.address?.lng != null && (
                            <a
                              href={getLocationUrl(seller)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                              title={`View ${seller.name}'s location on map`}
                              aria-label={`View location of ${seller.name} on map`}
                            >
                              <MapPin className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={seller.status === "active" ? "default" : "secondary"}>
                          {seller.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700"
                              aria-label={`Delete seller ${seller.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the seller {seller.name} and cannot
                                be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSeller(seller.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Sellers;
