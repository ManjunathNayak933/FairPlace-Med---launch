
import { Seller, Order, DashboardStats } from "../types";

// Mock Sellers Data
export const mockSellers: Seller[] = [
  {
    id: "s1",
    name: "City Pharmacy",
    email: "city@pharmacy.com",
    phone: "555-123-4567",
    address: "123 Main St, City Center",
    location: { lat: 37.7749, lng: -122.4194 },
    status: "active",
    createdAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "s2",
    name: "MediPlus Drugstore",
    email: "info@mediplus.com",
    phone: "555-987-6543",
    address: "456 Park Ave, Downtown",
    location: { lat: 37.7833, lng: -122.4167 },
    status: "active",
    createdAt: "2023-02-10T10:15:00Z",
  },
  {
    id: "s3",
    name: "Health First Pharmacy",
    email: "contact@healthfirst.com",
    phone: "555-456-7890",
    address: "789 Market St, Business District",
    location: { lat: 37.7879, lng: -122.4074 },
    status: "inactive",
    createdAt: "2023-03-05T09:45:00Z",
  },
  {
    id: "s4",
    name: "Quick Meds",
    email: "service@quickmeds.com",
    phone: "555-789-0123",
    address: "321 Oak Rd, Suburbia",
    location: { lat: 37.7648, lng: -122.4348 },
    status: "active",
    createdAt: "2023-04-20T14:20:00Z",
  },
  {
    id: "s5",
    name: "Care Pharmaceuticals",
    email: "help@carepharm.com",
    phone: "555-234-5678",
    address: "654 Pine St, North Side",
    location: { lat: 37.7951, lng: -122.4047 },
    status: "active",
    createdAt: "2023-05-12T11:30:00Z",
  },
];

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: "o1",
    status: "accepted",
    items: [
      { name: "Paracetamol", quantity: 2, price: 5.99 },
      { name: "Vitamin C", quantity: 1, price: 8.75 },
    ],
    totalAmount: 20.73,
    buyer: {
      id: "b1",
      name: "John Doe",
      phone: "555-111-2233",
      address: "101 Maple Dr, East End",
      location: { lat: 37.7680, lng: -122.4230 },
    },
    seller: mockSellers[0],
    createdAt: "2023-06-01T13:45:00Z",
  },
  {
    id: "o2",
    status: "in-progress",
    items: [
      { name: "Antibiotics", quantity: 1, price: 12.50 },
      { name: "Bandages", quantity: 3, price: 3.25 },
    ],
    totalAmount: 22.25,
    buyer: {
      id: "b2",
      name: "Jane Smith",
      phone: "555-444-5566",
      address: "202 Cedar St, West Side",
      location: { lat: 37.7820, lng: -122.4250 },
    },
    seller: mockSellers[1],
    createdAt: "2023-06-02T10:30:00Z",
  },
  {
    id: "o3",
    status: "pending",
    items: [
      { name: "Allergy Medicine", quantity: 1, price: 15.99 },
      { name: "Cold Relief", quantity: 1, price: 9.49 },
    ],
    totalAmount: 25.48,
    buyer: {
      id: "b3",
      name: "Michael Johnson",
      phone: "555-777-8899",
      address: "303 Birch Ln, South Side",
      location: { lat: 37.7699, lng: -122.4280 },
    },
    createdAt: "2023-06-03T09:15:00Z",
  },
  {
    id: "o4",
    status: "completed",
    items: [
      { name: "Blood Pressure Monitor", quantity: 1, price: 45.99 },
    ],
    totalAmount: 45.99,
    buyer: {
      id: "b4",
      name: "Emily Wilson",
      phone: "555-222-3344",
      address: "404 Walnut Way, North End",
      location: { lat: 37.7880, lng: -122.4090 },
    },
    seller: mockSellers[3],
    createdAt: "2023-06-01T11:20:00Z",
  },
  {
    id: "o5",
    status: "cancelled",
    items: [
      { name: "Diabetes Test Strips", quantity: 2, price: 22.50 },
      { name: "Insulin Syringes", quantity: 1, price: 15.75 },
    ],
    totalAmount: 60.75,
    buyer: {
      id: "b5",
      name: "Robert Brown",
      phone: "555-666-7788",
      address: "505 Elm St, Central District",
      location: { lat: 37.7765, lng: -122.4200 },
    },
    createdAt: "2023-06-02T16:45:00Z",
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalSellers: mockSellers.length,
  activeSellers: mockSellers.filter(seller => seller.status === "active").length,
  pendingOrders: mockOrders.filter(order => order.status === "pending").length,
  inProgressOrders: mockOrders.filter(order => ["accepted", "in-progress"].includes(order.status)).length,
  completedOrders: mockOrders.filter(order => order.status === "completed").length,
};

// Service functions
export const getSellers = (): Promise<Seller[]> => {
  return Promise.resolve([...mockSellers]);
};

export const deleteSeller = (id: string): Promise<void> => {
  return Promise.resolve();
};

export const getOrders = (): Promise<Order[]> => {
  return Promise.resolve([...mockOrders]);
};

export const completeOrder = (id: string): Promise<void> => {
  return Promise.resolve();
};

export const getDashboardStats = (): Promise<DashboardStats> => {
  return Promise.resolve({...mockDashboardStats});
};
