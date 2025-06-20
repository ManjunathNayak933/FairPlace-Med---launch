// Update this page (the content is just a fallback if you fail to update the page)

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Only fetch if not loading (auth restoration complete)
    if (loading) return;
    if (!isAuthenticated) return;
    axios
      .get(`${API_BASE_URL}/api/medicines`)
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, [isAuthenticated, loading]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);


  if (!isAuthenticated && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please log in to view products.
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-8">
      <div className="w-full max-w-xl mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="w-full max-w-xl">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No medicines found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="font-bold text-medblue-700 mb-1">
                  ₹{product.price}
                </p>
                <span className="text-xs text-gray-400">
                  {product.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
