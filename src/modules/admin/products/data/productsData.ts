export interface Product {
  id: number;
  image: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    image: "🎮",
    name: "God of War Ragnarok",
    category: "Acción",
    price: 45000,
    stock: 12,
  },
  {
    id: 2,
    image: "⚽",
    name: "EA Sports FC 25",
    category: "Deportes",
    price: 72500,
    stock: 8,
  },
  {
    id: 3,
    image: "🥋",
    name: "Mortal Kombat 1",
    category: "Pelea",
    price: 18900,
    stock: 3,
  },
  {
    id: 4,
    image: "🚗",
    name: "Gran Turismo 7",
    category: "Carreras",
    price: 51000,
    stock: 6,
  },
];