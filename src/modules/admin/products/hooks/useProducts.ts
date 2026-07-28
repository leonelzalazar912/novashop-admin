import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../../../lib/supabase";
import type { Product } from "../data/productsData";

type ProductInput = Omit<Product, "id" | "active"> & {
  imageFile?: File | null;
};

type ProductUpdateInput = Product & {
  imageFile?: File | null;
};

const PRODUCT_IMAGES_BUCKET = "product-images";

type ProductDatabaseRow = {
  id: string;
  name: string;
  price: number | string;
  published: boolean;
  active: boolean;
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

function getStoragePathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/`;
  const index = url.indexOf(marker);

  if (index === -1) {
    return null;
  }

  return url.slice(index + marker.length);
}

async function uploadProductImage(
  storeId: string,
  productId: string,
  file: File
): Promise<string> {
  const dotIndex = file.name.lastIndexOf(".");
  const extension = dotIndex >= 0 ? file.name.slice(dotIndex + 1) : "jpg";
  const path = `${storeId}/${productId}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file);

  if (uploadError) {
    console.error(uploadError);
    throw new Error("No se pudo subir la imagen del producto.");
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);

  return publicUrl;
}

async function removeProductImage(url: string): Promise<void> {
  const path = getStoragePathFromPublicUrl(url);

  if (!path) {
    return;
  }

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    console.error(error);
  }
}

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
    published: row.published,
    active: row.active,
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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

      setUserId(user.id);

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
          published,
          active,
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
          published: product.published,
          featured: false,
        })
        .select("id")
        .single();

      if (productError || !createdProduct) {
        throw productError ??
          new Error("No se creó el producto.");
      }

      const productId = createdProduct.id;

      let imageUrl = product.image || "🎮";

      if (product.imageFile) {
        try {
          imageUrl = await uploadProductImage(
            storeId,
            productId,
            product.imageFile
          );
        } catch (uploadError) {
          await supabase
            .from("products")
            .delete()
            .eq("id", productId);

          throw uploadError;
        }
      }

      const [
        imageResult,
        supplierLinkResult,
        inventoryResult,
      ] = await Promise.all([
        supabase.from("product_images").insert({
          store_id: storeId,
          product_id: productId,
          image_url: imageUrl,
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

      const newProduct: Product = {
        id: productId,
        image: imageUrl,
        name: product.name,
        category: product.category,
        brand: product.brand,
        supplier: product.supplier,
        price: product.price,
        stock: product.stock,
        published: product.published,
        active: true,
      };

      setProducts((previous) => [
        ...previous,
        newProduct,
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
    product: ProductUpdateInput
  ) {
    if (!storeId || !locationId) {
      setError(
        "No se encontró la tienda o el depósito."
      );
      return;
    }

    try {
      setError("");

      const previousImage = products.find(
        (item) => item.id === product.id
      )?.image;

      const {
        categoryId,
        brandId,
        supplierId,
      } = await findRelatedIds(product);

      let newImageUrl = product.image || "🎮";

      if (product.imageFile) {
        newImageUrl = await uploadProductImage(
          storeId,
          product.id,
          product.imageFile
        );
      }

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
          published: product.published,
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
          image_url: newImageUrl,
          display_order: 0,
          is_primary: true,
        });

      if (imageError) {
        throw imageError;
      }

      if (previousImage && previousImage !== newImageUrl) {
        await removeProductImage(previousImage);
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

      const updatedProduct: Product = {
        id: product.id,
        image: newImageUrl,
        name: product.name,
        category: product.category,
        brand: product.brand,
        supplier: product.supplier,
        price: product.price,
        stock: product.stock,
        published: product.published,
        active: product.active,
      };

      setProducts((previous) =>
        previous.map((item) =>
          item.id === product.id ? updatedProduct : item
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
    setError("");

    const productToDelete = products.find(
      (item) => item.id === id
    );

    const { error: imagesError } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", id);

    if (imagesError) {
      console.error(imagesError);
      setError("No se pudo eliminar el producto.");
      return;
    }

    const { error: suppliersError } = await supabase
      .from("product_suppliers")
      .delete()
      .eq("product_id", id);

    if (suppliersError) {
      console.error(suppliersError);
      setError("No se pudo eliminar el producto.");
      return;
    }

    const { error: inventoryError } = await supabase
      .from("inventory_levels")
      .delete()
      .eq("product_id", id);

    if (inventoryError) {
      console.error(inventoryError);
      setError("No se pudo eliminar el producto.");
      return;
    }

    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error(deleteError);

      setError(
        deleteError.code === "23503"
          ? "No se pudo eliminar el producto porque tiene movimientos de stock o compras asociadas. Marcalo como inactivo en su lugar."
          : "No se pudo eliminar el producto."
      );

      return;
    }

    if (productToDelete) {
      await removeProductImage(productToDelete.image);
    }

    setProducts((previous) =>
      previous.filter((product) => product.id !== id)
    );

    showToast("Producto eliminado");
  }

  async function toggleProductActive(
    id: string
  ): Promise<boolean> {
    if (!storeId) {
      setError("No se encontró la tienda.");
      return false;
    }

    const product = products.find(
      (item) => item.id === id
    );

    if (!product) {
      setError("No se encontró el producto.");
      return false;
    }

    const newActive = !product.active;

    const { error: statusError } = await supabase
      .from("products")
      .update({ active: newActive })
      .eq("id", id)
      .eq("store_id", storeId);

    if (statusError) {
      console.error(statusError);
      setError("No se pudo cambiar el estado del producto.");
      return false;
    }

    setProducts((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, active: newActive } : item
      )
    );

    setError("");
    return true;
  }

  async function updateProductStock(
    productId: string,
    quantity: number,
    successMessage: string,
    movementType: "purchase" | "purchase_cancel",
    referenceId: string
  ): Promise<boolean> {
    if (!storeId || !locationId) {
      setError("No se encontró la tienda o el depósito.");
      return false;
    }

    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) {
      setError("No se encontró el producto.");
      return false;
    }

    const previousStock = product.stock;
    const newStock = Math.max(0, quantity);
    const quantityDelta = newStock - previousStock;

    if (quantityDelta === 0) {
      return true;
    }

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
      return false;
    }

    const { error: movementError } = await supabase
      .from("stock_movements")
      .insert({
        store_id: storeId,
        product_id: productId,
        location_id: locationId,
        movement_type: movementType,
        quantity_delta: quantityDelta,
        reference_type: "purchase",
        reference_id: referenceId,
        notes:
          movementType === "purchase"
            ? "Ingreso de stock por compra"
            : "Reversión de stock por cancelación de compra",
        created_by: userId,
      });

    if (movementError) {
      console.error(movementError);

      const { error: rollbackError } = await supabase
        .from("inventory_levels")
        .upsert(
          {
            store_id: storeId,
            product_id: productId,
            location_id: locationId,
            quantity: previousStock,
            reserved_quantity: 0,
          },
          {
            onConflict: "product_id,location_id",
          }
        );

      if (rollbackError) {
        console.error(rollbackError);
      }

      setError(
        "No se pudo registrar el movimiento de stock."
      );

      return false;
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

    return true;
  }

  async function increaseProductStock(
    productId: string,
    quantity: number,
    purchaseId: string
  ): Promise<boolean> {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) return false;

    return updateProductStock(
      productId,
      product.stock + quantity,
      "Stock actualizado por la compra",
      "purchase",
      purchaseId
    );
  }

  async function decreaseProductStock(
    productId: string,
    quantity: number,
    purchaseId: string
  ): Promise<boolean> {
    const product = products.find(
      (item) => item.id === productId
    );

    if (!product) return false;

    return updateProductStock(
      productId,
      product.stock - quantity,
      "Stock revertido por cancelación",
      "purchase_cancel",
      purchaseId
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
    toggleProductActive,
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