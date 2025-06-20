import React, { useRef, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const BulkMedicineUpload: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!user || user.role !== "seller") return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("sellerId", user._id);
    setUploading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/medicines/bulk-csv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      let errorMsg = "Failed to upload CSV";
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        errorMsg = err.response.data.error;
      }
      setError(errorMsg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="bulk-medicine-csv" className="block font-medium mb-2">Bulk Add Medicines (CSV)</label>
      <input
        id="bulk-medicine-csv"
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={uploading}
        className="mb-2"
        title="Upload CSV file"
        placeholder="Choose CSV file"
      />
      <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} type="button">
        {uploading ? "Uploading..." : "Upload CSV"}
      </Button>
      {success && <div className="text-green-600 mt-2">Medicines added successfully!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
};

export default BulkMedicineUpload;
