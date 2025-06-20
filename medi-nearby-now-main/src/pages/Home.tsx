// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useLocation } from "../context/LocationContext";
// import { Product } from "../types";
// import { fetchPaginatedMedicines, PaginatedProducts } from "../services/medicineService";
// import ProductCard from "../components/ProductCard";
// import LocationPrompt from "../components/LocationPrompt";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Search } from "lucide-react";

// const Home = () => {
//   const { isAuthenticated, loading } = useAuth();
//   const { latitude, longitude } = useLocation();
//   const navigate = useNavigate();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSearching, setIsSearching] = useState(false);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(100);
//   const [totalPages, setTotalPages] = useState(1);
//   const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

//   // Redirect if not authenticated (but only after loading is false)
//   useEffect(() => {
//     if (!loading && !isAuthenticated) {
//       navigate("/login");
//     }
//   }, [isAuthenticated, loading, navigate]);

//   // Fetch data function
//   const fetchData = React.useCallback(async (currentPage: number, search?: string) => {
//     if (loading || !isAuthenticated) return;

//     if (search) {
//       setIsSearching(true);
//     } else {
//       setIsLoading(true);
//     }

//     try {
//       const data: PaginatedProducts = await fetchPaginatedMedicines(currentPage, limit, search);
//       setProducts(data.products);
//       setTotalPages(data.totalPages);
//     } catch (error) {
//       console.error("Failed to fetch medicines:", error);
//     } finally {
//       setIsLoading(false);
//       setIsSearching(false);
//     }
//   }, [loading, isAuthenticated, limit]);

//   // // Initial data fetch
//   // useEffect(() => {
//   //   if (!searchQuery) {
//   //     fetchData(page);
//   //   }
//   // }, [fetchData, page, searchQuery]);

// // 1. Fetch data without search query
// useEffect(() => {
//   if (!searchQuery.trim()) {
//     fetchData(page);
//   }
// }, [fetchData, page, searchQuery]);

// // 2. Fetch data with search query (fixes your bug)
// useEffect(() => {
//   if (searchQuery.trim()) {
//     fetchData(page, searchQuery);
//   }
// }, [fetchData, page, searchQuery]);



//   // Handle search with debouncing
//   useEffect(() => {
//     if (!searchQuery.trim()) return; // Don't debounce empty searches

//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     setIsSearching(true); // Show searching indicator immediately

//     searchTimeoutRef.current = setTimeout(() => {
//       setPage(1); // Reset to first page when searching
//       fetchData(1, searchQuery);
//     }, 500); // 500ms debounce for better UX

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchQuery, fetchData]);

//   // Handle clearing search
//   useEffect(() => {
//     if (!searchQuery.trim()) {
//       setPage(1);
//       fetchData(1); // Fetch without search when query is cleared
//     }
//   }, [searchQuery, fetchData]);

//   // Group products by category (no need for filtering since backend handles search)
//   const groupedProducts = products.reduce<Record<string, Product[]>>((acc, product) => {
//     if (!acc[product.category]) {
//       acc[product.category] = [];
//     }
//     acc[product.category].push(product);
//     return acc;
//   }, {});

//   // Pagination controls
//   const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
//   const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

//   return (
//     <div className="med-container pt-4 pb-16 animate-fade-in">
//       {/* Show location prompt if location is not available */}
//       {(!latitude || !longitude) && <LocationPrompt />}
//       {/* Search bar */}
//       <div className="mb-6 relative">
//         <Input
//           type="text"
//           placeholder="Search medicines..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="pr-10"
//         />
//         <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
//       </div>
//       {/* Search indicator */}
//       {isSearching && (
//         <div className="flex items-center justify-center py-4">
//           <div className="w-6 h-6 rounded-full border-2 border-medblue-200 border-t-medblue-500 animate-spin mr-2"></div>
//           <p className="text-gray-500">Searching...</p>
//         </div>
//       )}

//       {/* Loading state */}
//       {isLoading && !isSearching && (
//         <div className="flex flex-col items-center justify-center py-12">
//           <div className="w-12 h-12 rounded-full border-4 border-medblue-200 border-t-medblue-500 animate-spin mb-4"></div>
//           <p className="text-gray-500">Loading nearby medicines...</p>
//         </div>
//       )}

//       {/* Products grid */}
//       {!isLoading && !isSearching && Object.keys(groupedProducts).length === 0 && (
//         <div className="text-center py-16 border border-dashed rounded-lg">
//           <p className="text-muted-foreground mb-4">
//             {searchQuery ? `No medicines found for "${searchQuery}"` : "No medicines found"}
//           </p>
//         </div>
//       )}

//       {!isLoading && !isSearching && Object.keys(groupedProducts).length > 0 && (
//         <div className="space-y-6">
//           {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
//             <div key={category}>
//               <h2 className="text-xl font-semibold mb-4 text-gray-800">{category}</h2>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {categoryProducts.map((product, idx) => (
//                   <ProductCard key={product.id ? product.id : idx} product={product} />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination Controls */}
//       {!isLoading && !isSearching && totalPages > 1 && (
//         <div className="flex justify-center items-center gap-4 mt-6">
//           <Button onClick={handlePrevPage} disabled={page === 1}>Previous</Button>
//           <span>Page {page} of {totalPages}</span>
//           <Button onClick={handleNextPage} disabled={page === totalPages}>Next</Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "../context/LocationContext";
import { Product } from "../types";
import ProductCard from "../components/ProductCard";
import LocationPrompt from "../components/LocationPrompt";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { API_BASE_URL } from "@/config";

const Home = () => {
  const { isAuthenticated, loading } = useAuth();
  const { latitude, longitude } = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // items per page

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

 const fetchData = async () => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/medicines?page=${page}&limit=${limit}&search=${searchQuery}`
    );
    const data = await res.json();
    setProducts(data.products);
    setTotalPages(data.totalPages);
  } catch (error) {
    console.error("Error fetching medicines:", error);
  }
};


useEffect(() => {
  if (isAuthenticated && !loading) {
    fetchData();
  }
}, [isAuthenticated, loading, page, searchQuery]);


  // const filteredProducts = products.filter(product =>
  //   product.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <div className="med-container pt-4 pb-16">
      {(!latitude || !longitude) && <LocationPrompt />}

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Search medicines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">
          {searchQuery ? `No results for "${searchQuery}"` : "No medicines found."}
        </p>
      )}


      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
