import { apiClient } from "./api-client";

export interface KajabiProduct {
  id: string;
  title: string;
  description?: string;
  url?: string;
  thumbnail_url?: string;
  product_type_name?: string;
}

export async function getKajabiProducts(): Promise<KajabiProduct[]> {
  try {
    const res = await apiClient.getKajabiProducts();
    return res || [];
  } catch (error) {
    console.error("Failed to fetch Kajabi products", error);
    return [];
  }
}

export interface KajabiCustomer {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
  public_bio?: string;
  public_location?: string;
}

export async function getKajabiCustomers(
  page = 1,
  size = 50,
  search?: string
): Promise<KajabiCustomer[]> {
  try {
    // apiClient.getKajabiCustomers should be implemented in lib/api-client.ts
    // it returns an array of customers
    const res = await apiClient.getKajabiCustomers(page, size, search);
    return res || [];
  } catch (error) {
    console.error("Failed to fetch Kajabi customers", error);
    return [];
  }
}

export async function getKajabiCustomer(
  id: string
): Promise<KajabiCustomer | null> {
  try {
    const res = await apiClient.getKajabiCustomer(id);
    return res || null;
  } catch (error) {
    console.error("Failed to fetch Kajabi customer by id", error);
    return null;
  }
}
