export interface ProductImage {
  url: string;
  alt: string | null;
  isPrimary: boolean;
  order: number;
}

export interface ProductCategory {
  id: string;
  name: string;
}

export interface ProductBrand {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  currency: string;
  category: ProductCategory | null;
  brand: ProductBrand | null;
  images: ProductImage[];
  stock: number;
  featured: boolean;
  metadata: Record<string, unknown>;
}

export interface AdminProductSupplier {
  id: string;
  name: string;
  unitCost: number | null;
}

export interface AdminProduct extends Product {
  cost: number;
  taxRate: number;
  minimumStock: number;
  trackStock: boolean;
  active: boolean;
  published: boolean;
  categoryId: string | null;
  brandId: string | null;
  supplier: AdminProductSupplier | null;
}
