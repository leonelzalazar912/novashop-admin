export type Brand = {
  id: string;
  name: string;
  country: string;
  website: string;
  description: string;
  active: boolean;
};

export const initialBrands: Brand[] = [];