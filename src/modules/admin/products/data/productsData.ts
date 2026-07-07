export interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  brand: string;
  supplier: string;
  price: number;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    image: "🎮",
    name: "God of War Ragnarok",
    category: "Acción",
    brand: "Sony",
    supplier: "Proveedor principal",
    price: 45000,
    stock: 12,
  },
  {
    id: 2,
    image: "⚽",
    name: "EA Sports FC 25",
    category: "Deportes",
    brand: "EA Sports",
    supplier: "Proveedor principal",
    price: 72500,
    stock: 8,
  },
  {
    id: 3,
    image: "🥋",
    name: "Mortal Kombat 1",
    category: "Pelea",
    brand: "Warner Bros",
    supplier: "Proveedor principal",
    price: 18900,
    stock: 3,
  },
  {
    id: 4,
    image: "🚗",
    name: "Gran Turismo 7",
    category: "Carreras",
    brand: "Sony",
    supplier: "Proveedor principal",
    price: 51000,
    stock: 6,
  },
];