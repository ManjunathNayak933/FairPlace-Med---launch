import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useProducts, Product } from "@/contexts/ProductContext";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Tag, Check, X, Upload, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMedicinesPaginated } from "@/lib/utils";

// Helper to get product ID (id or _id)
const getProductId = (product: Product) =>
  product.id || (product as Record<string, unknown>)._id || "";

const getImageUrl = (image: string | undefined) => {
  if (!image) return undefined;
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL}${image}`;
};

const Products = () => {
  const { products, deleteProduct, loading, fetchProducts } = useProducts();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "g-tagged" | "regular">(
    "all"
  );
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(100);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  const [localLoading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate()
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Fetch products ONCE after user/session restoration
  useEffect(() => {
    if (!authLoading && user) {
      fetchProducts();
    }
    // Only run when authLoading or user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  // Debug: Log user and products before filtering
  console.log("User at filter:", user, "Products:", products);

  useEffect(() => {
    // Log search query and filter type changes
    console.log("Products filter updated:", products);
  }, [products]);

  // Fetch function for paginated products
  const fetchPaginatedData = React.useCallback(async (currentPage: number, search?: string) => {
    if (!authLoading && user) {
      if (search) {
        setIsSearching(true);
      } else {
        setLoading(true);
      }

      try {
        const data = await fetchMedicinesPaginated(currentPage, limit, search, user._id);
        setPaginatedProducts(data.products || []);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch paginated products:", error);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    }
  }, [authLoading, user, limit]);

  // Initial fetch (without search)
  useEffect(() => {
    if (!searchQuery) {
      fetchPaginatedData(page);
    }
  }, [fetchPaginatedData, page, searchQuery]);

  // Handle search with debouncing
  useEffect(() => {
    if (!searchQuery.trim()) return; // Don't debounce empty searches

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearching(true); // Show searching indicator immediately

    searchTimeoutRef.current = setTimeout(() => {
      setPage(1); // Reset to first page when searching
      fetchPaginatedData(1, searchQuery);
    }, 500); // 500ms debounce for better UX

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, fetchPaginatedData]);

  // Handle clearing search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPage(1);
      fetchPaginatedData(1); // Fetch without search when query is cleared
    }
  }, [searchQuery, fetchPaginatedData]);

  // Filter products by G-tagged status (search is now handled by backend)
  const filteredProducts = React.useMemo(() => {
    return paginatedProducts.filter((product) => {
      if (!product || !product.name || !product.description) return false;
      if (filterType === "all") return true;
      if (filterType === "g-tagged") return product.isGTagged;
      return !product.isGTagged;
    });
  }, [paginatedProducts, filterType]);

  // Enhanced delete handler with error handling and loading
  const handleDelete = async (id: string) => {
    setError(null);
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setPaginatedProducts((prev) =>
        prev.filter((product) => product._id !== id && product.id !== id)
      );
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(errorMsg || "Failed to delete product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };


  if (authLoading || loading || localLoading) {
    // Debug: Show loading state and user
    console.log("Loading state:", { authLoading, loading, localLoading, user });
    return <div className="text-center py-16">Loading products...</div>;
  }

  // If user is not authenticated after loading, show error and login button
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-200 max-w-md text-center">
          <p className="mb-2 font-semibold">
            Session expired or failed to restore session.
          </p>
          <p className="text-sm text-gray-700">
            Please log in again to access your products.
          </p>
        </div>
        <Button asChild>
          <Link to="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  // Pagination handlers
  const handlePrevPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-200">
          {error}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchProducts()} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <AddProductDialog onProductAdded={fetchProducts} />
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex">
          <Tabs
            value={filterType}
            onValueChange={(v) =>
              setFilterType(v as "all" | "g-tagged" | "regular")
            }
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="g-tagged">G-Tagged</TabsTrigger>
              <TabsTrigger value="regular">Regular</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Search indicator */}
      {isSearching && (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 rounded-full border-2 border-blue-200 border-t-blue-500 animate-spin mr-2"></div>
          <p className="text-gray-500">Searching products...</p>
        </div>
      )}

      {/* Products grid */}
      {!isSearching && filteredProducts.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Button asChild>
            <Link to="/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Add your first product
            </Link>
          </Button>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={String(getProductId(product))}
                product={product}
                onDelete={handleDelete}
                deleting={deletingId === String(getProductId(product))}
              />
            ))}
          </div>
          {!loading && !localLoading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button onClick={handlePrevPage} disabled={page === 1}>
                Previous
              </Button>
              <span>
                Page {page} of {totalPages}
              </span>
              <Button onClick={handleNextPage} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({
  product,
  onDelete,
  deleting = false,
}: {
  product: Product;
  onDelete: (id: string) => void;
  deleting?: boolean;
}) => {
  useEffect(() => {
    // Log product details for debugging
    // console.log("Rendering ProductCard for:", product.name, {
    //   id: getProductId(product),
    //   isGTagged: product.isGTagged,
    //   sellerId: product.sellerId,
    // });
  }, [product]);
  const navigate = useNavigate()
  const moveToEdit = (id) => {
    navigate(`/EditProduct/${id}`)
  }
  return (
    <Card className="overflow-hidden card-hover">
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-medium truncate" title={product.name}>
              {product.name}
            </h3>
            <p
              className="text-sm text-muted-foreground line-clamp-2 mt-1"
              title={product.description}
            >
              {product.description}
            </p>
          </div>
          {product.isGTagged && (
            <Badge
              variant="secondary"
              className="bg-med-light-green text-med-green font-medium"
            >
              <Tag className="h-3 w-3 mr-1" /> G
            </Badge>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold">₹{product.price}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        {/* {console.log(product,"pppppppppp")} */}
        <div className="mt-4 flex gap-2">
          <Button onClick={(() => moveToEdit(product._id))} size="sm" variant="outline" className="flex-1">
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-med-red"
            onClick={() => onDelete(String(getProductId(product)))}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AddProductDialog = ({
  onProductAdded,
}: {
  onProductAdded?: () => void;
}) => {
  const { addProduct, bulkAddProducts } = useProducts();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    isGTagged: false,
    image: null as File | null, // store File object, not string
    category: "",
  });
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file, // store the file object
      }));
    }
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBulkFile(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (activeTab === "single") {
        let imageUrl: string | undefined = undefined;
        if (formData.image) {
          // Upload image to backend and get URL
          const uploadData = new FormData();
          uploadData.append("file", formData.image);
          const res = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            body: uploadData,
          });
          if (!res.ok) throw new Error("Failed to upload image");
          const data = await res.json();
          imageUrl = data.url || data.imageUrl; // adjust according to your backend response
        }
        await addProduct({
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          stock: Number(formData.stock),
          isGTagged: formData.isGTagged,
          image: imageUrl,
          category: formData.category,
        });
        if (onProductAdded) onProductAdded();
      } else {
        bulkAddProducts([
          {
            name: "Mock Product 1",
            description: "Imported from Excel",
            price: 100,
            stock: 20,
            isGTagged: true,
            category: "Imported",
          },
          {
            name: "Mock Product 2",
            description: "Imported from Excel",
            price: 150,
            stock: 15,
            isGTagged: false,
            category: "Imported",
          },
        ]);
      }
      setOpen(false);
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        isGTagged: false,
        image: null,
        category: "",
      });
      setBulkFile(null);
    } catch (err) {
      setError(err?.message || "Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button> */}
        <Button asChild>
          <Link to="/products/add">Add Product</Link>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "single" | "bulk")}
          className="mt-4"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="single">Single Product</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
          </TabsList>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-200 mb-2">
              {error}
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            <TabsContent value="single" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g. Antibiotics"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Product description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isGTagged"
                  checked={formData.isGTagged}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isGTagged: checked }))
                  }
                />
                <Label htmlFor="isGTagged">
                  <span className="mr-1">Mark as G-Tagged medicine</span>
                  <Badge
                    variant="secondary"
                    className="bg-med-light-green text-med-green"
                  >
                    G
                  </Badge>
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Product Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4">
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium mb-2">
                  Upload Product Excel File
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  Upload an Excel file with your product data
                </p>

                {bulkFile ? (
                  <div className="bg-med-light-blue p-2 rounded flex items-center justify-between">
                    <span>{bulkFile.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setBulkFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Input
                      id="bulk-file"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      className="hidden"
                      onChange={handleBulkFileChange}
                    />
                    <Label htmlFor="bulk-file" className="cursor-pointer">
                      <Button type="button" variant="outline">
                        Select File
                      </Button>
                    </Label>
                  </div>
                )}
              </div>

              <div className="bg-med-light-green/20 p-4 rounded-md">
                <h4 className="font-medium flex items-center">
                  <Check className="h-4 w-4 mr-2 text-med-green" />
                  File Format
                </h4>
                <p className="text-sm mt-1 text-gray-600">
                  Your file should include columns for: Product Name,
                  Description, Price, Stock, Category, and a G-Tag column
                  (Yes/No)
                </p>
              </div>

              <div>
                <a
                  href="#"
                  className="text-med-blue hover:underline text-sm flex items-center"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download template file
                </a>
              </div>
            </TabsContent>

            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? activeTab === "single"
                    ? "Adding..."
                    : "Uploading..."
                  : activeTab === "single"
                    ? "Add Product"
                    : "Upload Products"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default Products;
