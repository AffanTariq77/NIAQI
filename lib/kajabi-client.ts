import { apiClient } from "./api-client";

export interface KajabiProduct {
  id: string;
  title: string;
  description?: string;
  url?: string;
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
