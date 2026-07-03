export interface Product {
  id: number;
  name: string;
  platform: string;
  platformColor: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  badge?: string;

  genre?: string;
  stock?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  developer?: string;
  releaseYear?: number;
}