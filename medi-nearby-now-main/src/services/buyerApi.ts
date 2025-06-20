import { API_BASE_URL } from "../config";
import { User } from "../types";

export async function fetchBuyerProfile(token: string): Promise<User> {
  const res = await fetch(`${API_BASE_URL}/api/auth/buyer/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch buyer profile");
  const data = await res.json();
  const buyer = data.buyer;
  return {
    _id: buyer._id,
    id: buyer._id, // keep both for compatibility
    name: buyer.name,
    phone: buyer.phone,
    addresses: buyer.addresses || [],
  };
}
