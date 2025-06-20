import { API_BASE_URL } from "../config";
import { Order } from "../types";

export async function fetchBuyerOrders(buyerId: string): Promise<Order[]> {
  const res = await fetch(`${API_BASE_URL}/api/buyer-orders?buyerId=${encodeURIComponent(buyerId)}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  const data = await res.json();
  return data.orders || [];
}
