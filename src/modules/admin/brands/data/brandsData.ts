export type Brand = {
  id: number;
  name: string;
  country: string;
  website: string;
  description: string;
  active: boolean;
};

export const initialBrands: Brand[] = [
  {
    id: 1,
    name: "Samsung",
    country: "Corea del Sur",
    website: "https://www.samsung.com",
    description: "Electrónica y tecnología.",
    active: true,
  },
  {
    id: 2,
    name: "Apple",
    country: "Estados Unidos",
    website: "https://www.apple.com",
    description: "Tecnología de consumo.",
    active: true,
  },
  {
    id: 3,
    name: "Sony",
    country: "Japón",
    website: "https://www.sony.com",
    description: "Electrónica, audio y videojuegos.",
    active: false,
  },
];