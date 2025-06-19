
import React from "react";
import { Product } from "../types";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCart } from "../context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem(product, 1);
  };
  
  return (
    <div className="med-card animate-bounce-in">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover rounded-md mb-2"
        />
        {product.isGeneric && (
          <Badge className="absolute top-1 right-1 bg-yellow-500 hover:bg-yellow-500">
            Rx
          </Badge>
        )}
      </div>
      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
      <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
      <div className="flex justify-between items-center mt-2">
        <span className="font-semibold text-medblue-700">₹{product.price.toFixed(2)}</span>
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="bg-medgreen-500 hover:bg-medgreen-600 text-xs py-1"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
