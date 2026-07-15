import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type { Product } from "../data/productsData";

type ProductInput = Omit<Product, "id">;

type ProductDatabaseRow = {
  id: string;
  name: string;
  price: number | string;
  categories:
    | { name: string }
    | { name: string }[]
    | null;
  brands:
    | { name: string }
    | { name: string }[]
    | null;
  product_images:
    | {
        image_url: string;
        is_primary: boolean;
        display_order: number;
      }[]
    | null;
  product_suppliers:
    | {
        preferred: boolean;
        suppliers:
          | { company: string }
          | { company: string }[]
          | null;
      }[]
    | null;
  inventory_levels:
    | {
        quantity: number | string;
        location_id: string;
      }[]
    | null;
};

function createSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getRelationName(
  relation:
    | { name: string }
    | { name: string }[]
    | null
): string {
  if (!relation) return "";

  if (Array.isArray(relation)) {
    return relation[0]?.name ?? "";
  }

  return relation.name;
}

function getSupplierName(
  productSuppliers: ProductDatabaseRow["product_suppliers"]
): string {
  if (!productSuppliers?.length) return "";

  const preferred =
    productSuppliers.find((item) => item.preferred) ??
    productSuppliers[0];

  const supplier = preferred.suppliers;

  if (!supplier) return "";

  if (Array.isArray(supplier)) {
    return supplier[0]?.company ?? "";
  }

  return supplier.company;
}

function mapProduct(row: ProductDatabaseRow): Product {
  const images = [...(row.product_images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) {
      return Number(b.is_primary) - Number(a.is_primary);
    }

    return a.display_order - b.display_order;
  });

  const stock = (row.inventory_levels ?? []).reduce(
    (total, level) => total + Number(level.quantity ?? 0),
    0
  );

  return {
    id: row.id,
    image: images[0]?.image_url ?? "🎮",
    name: row.name,
    category: getRelationName(row.categories),
    brand: getRelationName(row.brands),
    supplier: getSupplierName(row.product_suppliers),
    price: Number(row.price),
    stock,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("Todas");
  const [sortBy, setSortBy] =
    useState<"name" | "price" | "stock">("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const productsPerPage = 5;

  function showToast(message: string) {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2500);
  }

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(userError);
        setError("No hay una sesión iniciada.");
        setLoading(false);
        return;
      }

      const {
        data: membership,
        error: membershipError,
      } = await supabase
        .from("store_members")
        .select("store_id")
        .eq("user_id", user.id)
        .eq("active", true)
        .limit(1)
        .maybeSingle();

      if (membershipError || !membership) {
        console.error(membershipError);
        setError(
          "No se encontró una tienda asociada al usuario."
        );
        setLoading(false);
        return;
      }

      setStoreId(membership.store_id);

      const {
        data: location,
        error: locationError,
      } = await supabase
        .from("inventory_locations")
        .select("id")
        .eq("store_id", membership.store_id)
        .eq("active", true)
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (locationError || !location) {
        console.error(locationError);
        setError(
          "No se encontró un depósito para administrar el stock."
        );
        setLoading(false);
        return;
      }

      setLocationId(location.id);

      const {
        data,
        error: productsError,
      } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          categories (
            name
          ),
          brands (
            name
          ),
          product_images (
            image_url,
            is_primary,
            display_order
          ),
          product_suppliers (
            preferred,
            suppliers (
              company
            )
          ),
          inventory_levels (
            quantity,
            location_id
          )
        `)
        .eq("store_id", membership.store_id)
        .order("name");

      if (productsError) {
        console.error(productsError);
        setError("No se pudieron cargar los productos.");
        setLoading(false);
        return;
      }

      setProducts(
        (data as unknown as ProductDatabaseRow[]).map(
          mapProduct
        )
      );

      setLoading(false);
    }

    void loadProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, sortBy]);

  async function findRelatedIds(product: ProductInput) {
    if (!storeId) {
      throw new Error("No se encontró la tienda.");
    }

    const [
      categoryResult,
      brandResult,
      supplierResult,
    ] = await Promise.all([
      supabase
        .from("categories")
        .select("id")
        .eq("store_id", storeId)
        .eq("name", product.category)
        .limit(1)
        .maybeSingle(),

      supabase
        .from("brands")
        .select("id")
        .eq("store_id", storeId)
        .eq("name", product.brand)
        .limit(1)
        .maybeSingle(),

      supabase
        .from("suppliers")
        .select("id")
        .eq("store_id", storeId)
        .eq("company", product.supplier)
        .limit(1)
        .maybeSingle(),
    ]);

    if (
      categoryResult.error ||
      !categoryResult.data
    ) {
      throw new Error(
        "No se encontró la categoría seleccionada."
      );
    }

    if (brandResult.error || !brandResult.data) {
      throw new Error(
        "No se encontró la marca seleccionada."
      );
    }

    if (
      supplierResult.error ||
      !supplierResult.data
    ) {
      throw new Error(
        "No se encontró el proveedor seleccionado."
      );
    }

    return {
      categoryId: categoryResult.data.id,
      brandId: brandResult.data.id,
      supplierId: supplierResult.data.id,
    };
  }

  async function handleAddProduct(
    product: ProductInput
  ) {
    if (!storeId || !locationId) {
      setError(
        "No se encontró la tienda o el depósito."
      );
      return;
    }

    try {
      setError("");

      const {
        categoryId,
        brandId,
        supplierId,
      } = await findRelatedIds(product);

      const {
        data: createdProduct,
        error: productError,
      } = await supabase
        .from("products")
        .insert({
          store_id: storeId,
          category_id: categoryId,
          brand_id: brandId,
          name: product.name.trim(),
          slug: `${createSlug(product.name)}-${Date.now()}`,
          price: product.price,
          cost: 0,
          minimum_stock: 0,
          track_stock: true,
          active: true,
          published: false,
          featured: false,
        })
        .select("id")
        .single();

      if (productError || !createdProduct) {
        throw productError ??
          new Error("No se creó el producto.");
      }

      const productId = createdProduct.id;

      const [
        imageResult,
        supplierLinkResult,
        inventoryResult,
      ] = await Promise.all([
        supabase.from("product_images").insert({
          store_id: storeId,
          product_id: productId,
          image_url: product.image || "🎮",
          display_order: 0,
          is_primary: true,
        }),

        supabase.from("product_suppliers").insert({
          store_id: storeId,
          product_id: productId,
          supplier_id: supplierId,
          preferred: true,
        }),

        supabase.from("inventory_levels").insert({
          store_id: storeId,
          product_id: productId,
          location_id: locationId,
          quantity: product.stock,
          reserved_quantity: 0,
        }),
      ]);

      const relatedError =
        imageResult.error ??
        supplierLinkResult.error ??
        inventoryResult.error;

      if (relatedError) {
        await supabase
          .from("products")
          .delete()
          .eq("id", productId);

        throw relatedError;
      }

      setProducts((previous) => [
        ...previous,
        {
          id: productId,
          ...product,
        },
      ]);

      setShowForm(false);
      showToast("Producto creado correctamente");
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo crear el producto."
      );
    }
  }

  async function handleUpdateProduct(
    product: Product
  ) {
    if (!storeId || !locationId) {
      setError(
        "No se encontró la tienda o el depósito."
      );
      return;
    }

    try {
      setError("");

      const {
        categoryId,
        brandId,
        supplierId,
      } = await findRelatedIds(product);

      const { error: productError } = await supabase
        .from("products")
        .update({
          category_id: categoryId,
          brand_id: brandId,
          name: product.name.trim(),
          slug: `${createSlug(product.name)}-${product.id.slice(
            0,
            8
          )}`,
          price: product.price,
        })
        .eq("id", product.id)
        .eq("store_id", storeId);

      if (productError) {
        throw productError;
      }

      const { error: deleteImagesError } =
        await supabase
          .from("product_images")
          .delete()
          .eq("product_id", product.id);

      if (deleteImagesError) {
        throw deleteImagesError;
      }

      const { error: imageError } = await supabase
        .from("product_images")
        .insert({
          store_id: storeId,
          product_id: product.id,
          image_url: product.image || "🎮",
          display_order: 0,
          is_primary: true,
        });

      if (imageError) {
        throw imageError;
      }

      const { error: deleteSupplierError } =
        await supabase
          .from("product_suppliers")
          .delete()
          .eq("product_id", product.id);

      if (deleteSupplierError) {
        throw deleteSupplierError;
      }

      const { error: supplierError } =
        await supabase
          .from("product_suppliers")
          .insert({
            store_id: storeId,
            product_id: product.id,
            supplier_id: supplierId,
            preferred: true,
          });

      if (supplierError) {
        throw supplierError;
      }

      const { error: inventoryError } =
        await supabase
          .from("inventory_levels")
          .upsert(
            {
              store_id: storeId,
              product_id: product.id,
              location_id: locationId,
              quantity: product.stock,
              reserved_quantity: 0,
            },
            {
              onConflict: "product_id,location_id",
            }
          );

      if (inventoryError) {
        throw inventoryError;
      }

      setProducts((previous) =>
        previous.map((item) =>
          item.id === product.id ? product : item
        )
      );

      setEditingProduct(null);
      setShowForm(false);
      showToast("Producto actualizado");
    } catch (caughtError) {
      console.error(caughtError);
      setError("No se pudo actualizar el producto.");
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!window.confirm("¿Eliminar este producto?")) {
      return;
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(deleteError);
      setError(
        "No se pudo eliminar el producto. Puede tener movimientos asociados."
      );
      return;
    }

    setProducts((previous) =>
      previous.filter((product) => product.id !== id)
    );

    setError("");
    showToast("Producto eliminado");
  }

  async function updateProductStock(
    productId: string,
    quantity: number,
    successMessage: string
  ) {
    if (!storeId || !locationId) return;

    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) return;

    const newStock = Math.max(0, quantity);

    const { error: stockError } = await supabase
      .from("inventory_levels")
      .upsert(
        {
          store_id: storeId,
          product_id: productId,
          location_id: locationId,
          quantity: newStock,
          reserved_quantity: 0,
        },
        {
          onConflict: "product_id,location_id",
        }
      );

    if (stockError) {
      console.error(stockError);
      setError("No se pudo actualizar el stock.");
      return;
    }

    setProducts((previous) =>
      previous.map((item) =>
        item.id === productId
          ? { ...item, stock: newStock }
          : item
      )
    );

    setError("");
    showToast(successMessage);
  }

  async function increaseProductStock(
    productId: string,
    quantity: number
  ) {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) return;

    await updateProductStock(
      productId,
      product.stock + quantity,
      "Stock actualizado por la compra"
    );
  }

  async function decreaseProductStock(
    productId: string,
    quantity: number
  ) {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) return;

    await updateProductStock(
      productId,
      product.stock - quantity,
      "Stock revertido por cancelación"
    );
  }

  const filteredProducts = useMemo(
    () =>
      [...products]
        .filter((product) => {
          const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

          const matchesCategory =
            categoryFilter === "Todas" ||
            product.category === categoryFilter;

          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          if (sortBy === "name") {
            return a.name.localeCompare(b.name);
          }

          return a[sortBy] - b[sortBy];
        }),
    [products, search, categoryFilter, sortBy]
  );

  const categories = [
    "Todas",
    ...new Set(
      products
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / productsPerPage
    )
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return {
    products,
    search,
    setSearch,
    showForm,
    setShowForm,
    editingProduct,
    setEditingProduct,
    filteredProducts: paginatedProducts,
    handleAddProduct,
    handleDeleteProduct,
    handleUpdateProduct,
    increaseProductStock,
    decreaseProductStock,
    toast,
    categoryFilter,
    setCategoryFilter,
    categories,
    currentPage,
    setCurrentPage,
    totalPages,
    sortBy,
    setSortBy,
    loading,
    error,
  };
}