export interface Product {
  id: string;
  image: string;
  name: string;
  category: string;
  brand: string;
  supplier: string;
  price: number;
  stock: number;
  published: boolean;
  active: boolean;
}

export const products: Product[] = [];