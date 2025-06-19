import React, { useState } from "react";
import { Button } from "./ui/button";
import { Camera } from "lucide-react";
import { uploadImage } from "../services/dataService";
import { useAuth } from "../context/AuthContext";

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  label?: string;
}

const ImageUploader = ({ onImageUploaded, label = "Upload Image" }: ImageUploaderProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const imageUrl = await uploadImage(file, token);
      onImageUploaded(imageUrl);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        disabled={loading}
      />
      <label htmlFor="file-upload">
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 py-8 bg-gray-50 hover:bg-gray-100"
          disabled={loading}
          asChild
        >
          <div>
            <Camera className="h-6 w-6 mb-2 mx-auto text-gray-400" />
            <span className="block text-sm font-medium">
              {loading ? "Uploading..." : label}
            </span>
          </div>
        </Button>
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default ImageUploader;
