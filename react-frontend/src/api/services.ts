import { api } from "./axiosConfig";

// Typy
export interface Product {
  id: number;
  name: string;
  description: string;
  priceUnit: number;
  weightUnit: number;
  category: { name: string };
}

export interface OrderItem {
  product: { id: number; name?: string; priceUnit?: number };
  quantity: number;
}

export interface Order {
  id?: number;
  username: string;
  email: string;
  phoneNumber: string;
  orderItems: OrderItem[];
  orderState?: { name: string };
  approvalDate?: string;
  opinions?: any[];
}

// Auth
export const loginUser = (creds: any) => api.post("/login", creds);
export const registerUser = (data: any) => api.post("/register", data);
export const logoutUser = () => api.post("/logout");

// Produkty
export const getProducts = () => api.get<Product[]>("/products");
export const getCategories = () => api.get("/categories");
export const updateProduct = (id: number, data: Partial<Product>) =>
  api.put(`/products/${id}`, data);
export const getSeoDescription = (id: number) =>
  api.get(`/products/${id}/seo-description`, { responseType: "text" });

// Zamówienia
export const createOrder = (order: Order) => api.post("/orders", order);

// Admin pobiera wszystkie
export const getOrders = () => api.get<Order[]>("/orders");

// Klient pobiera swoje (NOWE)
export const getMyOrders = () => api.get<Order[]>("/orders/me");

export const getOrdersByStatus = (status: string) =>
  api.get<Order[]>(`/orders/status/${status}`);
export const updateOrderStatus = (id: number, status: string) =>
  api.patch(`/orders/${id}`, { orderState: { name: status } });
export const addOpinion = (
  orderId: number,
  data: { rating: number; content: string },
) => api.post(`/orders/${orderId}/opinions`, data);

// Inne
export const initDatabase = (data: any, contentType: string) =>
  api.post("/init", data, { headers: { "Content-Type": contentType } });
export const getOrderStates = () => api.get("/status");
