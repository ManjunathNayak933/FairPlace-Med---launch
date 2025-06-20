import { API_BASE_URL } from "@/config";
import { Product } from "../types";

// export interface PaginatedProducts {
//   products: Product[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
//   searchQuery?: string | null;
// }

// export async function fetchPaginatedMedicines(
//   page = 1, 
//   limit = 100, 
//   search?: string
// ): Promise<PaginatedProducts> {
//   const params = new URLSearchParams({
//     page: page.toString(),
//     limit: limit.toString(),
//   });
//   console.log(params,"params")
  
//   if (search && search.trim()) {
//     params.append('search', search.trim());
//   }
//   console.log("Calling API:", { page, limit, search });

  
//   const response = await fetch(`${API_BASE_URL}/api/medicines`);
//   // const response = await fetch(`${API_BASE_URL}/api/medicines?${params.toString()}`);
//   console.log(response,"response")
//   if (!response.ok) throw new Error("Failed to fetch medicines");
//   return response.json();
// }


// services/medicineService.ts
export async function fetchAllMedicines(search?: string): Promise<{ products: Product[] }> {
  const params = new URLSearchParams();
  if (search?.trim()) {
    params.append("search", search.trim());
  }

  const response = await fetch(`${API_BASE_URL}/api/medicines/all`);
  console.log(response,"response")
  if (!response.ok) throw new Error("Failed to fetch medicines");

  return response.json();
}
