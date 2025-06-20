import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_BASE_URL } from "../config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchMedicines() {
  const res = await fetch(`${API_BASE_URL}/api/medicines`);
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch(`${API_BASE_URL}/api/orders`);
  return res.json();
}

export async function fetchProfile() {
  const res = await fetch(`${API_BASE_URL}/api/auth/profile`);
  return res.json();
}
