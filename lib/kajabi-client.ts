import { apiClient } from './api-client';

export interface KajabiCourse {
  id: string;
  title: string;
  description?: string;
  url?: string;
}

export async function getKajabiCourses(): Promise<KajabiCourse[]> {
  try {
  const res = await apiClient.getKajabiCourses();
  return res || [];
  } catch (error) {
    console.error('Failed to fetch Kajabi courses', error);
    return [];
  }
}
