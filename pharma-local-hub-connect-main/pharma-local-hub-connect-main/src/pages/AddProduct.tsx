import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { addProductToBackend } from "../lib/utils";

const AddProduct: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage("You must be logged in to add products");
      return;
    }
    try {
      await addProductToBackend(
        {
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          category,
        },
        user._id
      );
      setMessage("Product added successfully!");
      setTimeout(() => navigate("/products"), 1200);
    } catch (err) {
      setMessage("Failed to add product");
    }
  };
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 id="add-product-title" className="text-xl font-bold mb-4">Add New Product</h1>
      <form 
        onSubmit={handleSubmit} 
        className="space-y-4"
        aria-labelledby="add-product-title"
        noValidate
      >
        <div>
          <label htmlFor="product-name" className="block mb-1 font-medium">Name</label>
          <input
            id="product-name"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter product name"
            title="Product name is required"
            aria-describedby="product-name-help"
          />
        </div>
        <div>
          <label htmlFor="product-description" className="block mb-1 font-medium">Description</label>
          <textarea
            id="product-description"
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter product description"
            title="Product description is required"
            aria-describedby="product-description-help"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="product-price" className="block mb-1 font-medium">Price (₹)</label>
          <input
            id="product-price"
            type="number"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="0.00"
            title="Product price is required"
            aria-describedby="product-price-help"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="product-stock" className="block mb-1 font-medium">Stock</label>
          <input
            id="product-stock"
            type="number"
            className="w-full border rounded px-3 py-2"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
            placeholder="Enter stock quantity"
            title="Stock quantity is required"
            aria-describedby="product-stock-help"
            min="0"
            step="1"
          />
        </div>
        <div>
          <label htmlFor="product-category" className="block mb-1 font-medium">Category</label>
          <input
            id="product-category"
            className="w-full border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Antibiotics, Pain Relief, etc."
            title="Product category (optional)"
            aria-describedby="product-category-help"
          />
        </div>        <Button 
          type="submit" 
          className="w-full"
          title="Submit form to add new product"
          aria-describedby={message ? "form-message" : undefined}
        >
          Add Product
        </Button>
        {message && (
          <div 
            id="form-message"
            className={`mt-2 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
            role="alert"
            aria-live="polite"
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
