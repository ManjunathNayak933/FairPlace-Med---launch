import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "../config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    return { status: "Backend not reachable", error: error.message };
  }
}

export async function fetchMedicines() {
  const res = await fetch(`${API_BASE_URL}/api/medicines`);
  return res.json();
}

export async function fetchMedicinesPaginated(
  page = 1, 
  limit = 100, 
  search?: string,
  sellerId?: string
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search && search.trim()) {
    params.append('search', search.trim());
  }
  
  if (sellerId) {
    params.append('sellerId', sellerId);
  }
  
  const res = await fetch(`${API_BASE_URL}/api/medicines?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch medicines");
  return res.json();
}

export async function fetchOrders(sellerId?: string) {
  let url = `${API_BASE_URL}/api/seller-orders`;
  if (sellerId) {
    url += `?sellerId=${encodeURIComponent(sellerId)}`;
  }
  const res = await fetch(url);
  console.log("API response", res);
  
  return res.json();
}

export async function fetchProfile() {
  const token = localStorage.getItem("medicineToken");
  const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.json();
}

export async function addProductToBackend(product, sellerId) {
  const formData = new FormData();
  for (const key in product) {
    if (product[key] !== undefined && product[key] !== null) {
      formData.append(key, product[key]);
    }
  }
  formData.append("sellerId", sellerId);

  const res = await fetch(`${API_BASE_URL}/api/medicines`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
}
// export async function editProductToBackend(product, sellerId) {
//   const formData = new FormData();
//   for (const key in product) {
//     if (product[key] !== undefined && product[key] !== null) {
//       formData.append(key, product[key]);
//     }
//   }
//   formData.append("sellerId", sellerId);

//   const res = await fetch(`${API_BASE_URL}/api/medicines/`, {
//     method: "POST",
//     body: formData,
//   });
//   if (!res.ok) throw new Error("Failed to add product");
//   return res.json();
// }

export async function updateProfile(data) {
  const token = localStorage.getItem("medicineToken");
  const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

export async function updateOrderStatusInBackend(orderId, status, sellerId) {
  const res = await fetch(`${API_BASE_URL}/api/seller-orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, sellerId }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}
