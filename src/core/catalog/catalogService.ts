import { supabase } from "../../lib/supabase";
import { storeConfig } from "../../config/storeConfig";
import type { Product, ProductCategory, ProductImage } from "../../types/product";

type Relation<T> = T | T[] | null;

type ProductImageRow = {
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
};

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number | string;
  currency: string;
  featured: boolean;
  metadata: Record<string, unknown> | null;
  categories: Relation<{ id: string; name: string }>;
  brands: Relation<{ id: string; name: string }>;
  product_images: ProductImageRow[] | null;
  inventory_levels: { quantity: number | string }[] | null;
};

function getRelation<T>(relation: Relation<T>): T | null {
  if (!relation) return null;
  return Array.isArray(relation) ? relation[0] ?? null : relation;
}

function mapImages(images: ProductImageRow[] | null): ProductImage[] {
  return [...(images ?? [])]
    .sort((a, b) => {
      if (a.is_primary !== b.is_primary) {
        return Number(b.is_primary) - Number(a.is_primary);
      }

      return a.display_order - b.display_order;
    })
    .map((image) => ({
      url: image.image_url,
      alt: image.alt_text,
      isPrimary: image.is_primary,
      order: image.display_order,
    }));
}

function mapProduct(row: ProductRow): Product {
  const category = getRelation(row.categories);
  const brand = getRelation(row.brands);

  const stock = (row.inventory_levels ?? []).reduce(
    (total, level) => total + Number(level.quantity ?? 0),
    0
  );

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    sku: row.sku,
    price: Number(row.price),
    currency: row.currency,
    category: category ? { id: category.id, name: category.name } : null,
    brand: brand ? { id: brand.id, name: brand.name } : null,
    images: mapImages(row.product_images),
    stock,
    featured: row.featured,
    metadata: row.metadata ?? {},
  };
}

let cachedStoreId: string | null = null;

export async function resolveStoreId(): Promise<string> {
  if (cachedStoreId) {
    return cachedStoreId;
  }

  const { data, error } = await supabase
    .from("stores")
    .select("id")
    .eq("slug", storeConfig.storeSlug)
    .eq("status", "active")
    .single();

  if (error || !data) {
    console.error(error);
    throw new Error("No se encontró la tienda.");
  }

  cachedStoreId = data.id;

  return data.id;
}

const PUBLIC_PRODUCT_SELECT = `
  id,
  slug,
  name,
  description,
  sku,
  price,
  currency,
  featured,
  metadata,
  categories ( id, name ),
  brands ( id, name ),
  product_images ( image_url, alt_text, is_primary, display_order ),
  inventory_levels ( quantity )
`;

export async function fetchCatalogProducts(): Promise<Product[]> {
  const storeId = await resolveStoreId();

  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_PRODUCT_SELECT)
    .eq("store_id", storeId)
    .eq("active", true)
    .eq("published", true)
    .order("name");

  if (error) {
    console.error(error);
    throw new Error("No se pudieron cargar los productos.");
  }

  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function fetchCatalogCategories(): Promise<ProductCategory[]> {
  const storeId = await resolveStoreId();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("store_id", storeId)
    .eq("active", true)
    .order("display_order");

  if (error) {
    console.error(error);
    throw new Error("No se pudieron cargar las categorías.");
  }

  return data ?? [];
}
