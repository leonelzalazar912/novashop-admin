export interface Product {
  id: string;
  image: string;
  name: string;
  category: string;
  brand: string;
  supplier: string;
  price: number;
  stock: number;
}

export const products: Product[] = [];