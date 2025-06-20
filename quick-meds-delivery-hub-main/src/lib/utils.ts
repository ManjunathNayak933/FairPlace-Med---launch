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
  try {
    // Fetch from both buyer and seller endpoints to get complete order data
    const [buyerResponse, sellerResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/buyer-orders`),
      fetch(`${API_BASE_URL}/api/seller-orders`)
    ]);
    
    const buyerData = await buyerResponse.json();
    const sellerData = await sellerResponse.json();
    
    // Combine orders from both endpoints, avoiding duplicates by using a Map
    const orderMap = new Map();
    
    // Add buyer orders
    if (buyerData.orders) {
      buyerData.orders.forEach(order => {
        orderMap.set(order.id, order);
      });
    }
    
    // Add seller orders (these might be the same orders with different perspectives)
    if (sellerData.orders) {
      sellerData.orders.forEach(order => {
        if (orderMap.has(order.id)) {
          // Merge seller data into existing order
          const existingOrder = orderMap.get(order.id);
          orderMap.set(order.id, {
            ...existingOrder,
            ...order,
            // Preserve buyer info from buyer endpoint if it exists
            buyerName: existingOrder.buyerName || order.buyerName,
            buyerPhone: existingOrder.buyerPhone || order.buyerPhone,
            deliveryAddress: existingOrder.deliveryAddress || order.deliveryAddress
          });
        } else {
          orderMap.set(order.id, order);
        }
      });
    }
    
    // Convert map back to array
    const orders = Array.from(orderMap.values());
    
    return { orders };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { orders: [] };
  }
}

export async function fetchProfile() {
  const res = await fetch(`${API_BASE_URL}/api/auth/profile`);
  return res.json();
}

export async function getSellers() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/sellers`);
    return res.json();
  } catch (error) {
    console.error('Error fetching sellers:', error);
    return [];
  }
}

export async function deleteSeller(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/sellers/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete seller');
    return res.json();
  } catch (error) {
    console.error('Error deleting seller:', error);
    throw error;
  }
}

export async function getOrders() {
  try {
    // Admin needs to see all orders, so fetch from both endpoints
    const orders = await fetchOrders();
    return orders.orders || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export async function completeOrder(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'completed' })
    });
    if (!res.ok) throw new Error('Failed to complete order');
    return res.json();
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
}

export async function getDashboardStats() {
  try {
    // Fetch data to calculate stats
    const [sellersData, ordersData] = await Promise.all([
      getSellers(),
      getOrders()
    ]);

    const stats = {
      totalSellers: sellersData.length,
      activeSellers: sellersData.filter(seller => seller.status === 'active').length,
      pendingOrders: ordersData.filter(order => order.status === 'pending').length,
      inProgressOrders: ordersData.filter(order => ['accepted', 'processing', 'in-progress'].includes(order.status)).length,
      completedOrders: ordersData.filter(order => ['completed', 'delivered'].includes(order.status)).length
    };

    return stats;
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    return {
      totalSellers: 0,
      activeSellers: 0,
      pendingOrders: 0,
      inProgressOrders: 0,
      completedOrders: 0
    };
  }
}
