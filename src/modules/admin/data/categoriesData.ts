export type Category = {
  id: number;
  name: string;
  description: string;
  active: boolean;
};

export const initialCategories: Category[] = [
  {
    id: 1,
    name: "Electrónica",
    description: "Productos tecnológicos y dispositivos.",
    active: true,
  },
  {
    id: 2,
    name: "Ropa",
    description: "Indumentaria y accesorios.",
    active: true,
  },
  {
    id: 3,
    name: "Hogar",
    description: "Artículos para casa y decoración.",
    active: true,
  },
];