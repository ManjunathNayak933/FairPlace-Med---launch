import axios from "axios";
import type { Address, Order } from "../types";

interface BackendOrderItem {
  productId: string;
  quantity: number;
}
interface BackendOrderPayload {
  buyer: string;
  items: BackendOrderItem[];
  total: number;
  address: Address;
  prescriptionImage?: string;
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://kamyakahub.in";

export const placeOrder = async (order: Order | BackendOrderPayload, token?: string) => {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await axios.post(`${API_BASE_URL}/api/buyer-orders`, order, { headers });
  return response.data;
};
