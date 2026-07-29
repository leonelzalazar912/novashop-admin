# Arquitectura — NovaShop

> Documento de referencia rápida generado a partir de la exploración del código. Actualizar cuando cambien la estructura, el estado de la migración o las convenciones.
>
> Última actualización: 29/07/2026 (sesión de unificación del tipo `Product` + conexión del catálogo público a Supabase + Storage de imágenes + fixes de integridad de datos). Ver `docs/bitacora-desarrollo.txt` para el detalle sesión por sesión.

## 1. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Build / dev server | Vite 6 |
| Framework UI | React 18 + TypeScript |
| Estilos | Tailwind CSS 4 (`@tailwindcss/vite`) + `default_shadcn_theme.css` |
| Componentes UI | Radix UI (primitivas) + shadcn/ui (generados en `app/components/ui/`) + MUI (`@mui/material`, `@mui/icons-material`) convivendo |
| Gráficos | Recharts |
| Formularios | react-hook-form |
| Ruteo | react-router (declarado en `package.json`, pero la navegación real se maneja a mano con estado `screen` en [App.tsx](../src/app/App.tsx), no hay `<Routes>` en uso) |
| Backend / datos | Supabase (Postgres + Auth + Storage + Edge Functions) vía `@supabase/supabase-js` |
| Estado global | React Context API (sin Redux/Zustand) |
| Notificaciones UI | `sonner` (toasts) |
| Animaciones | `motion` (Framer Motion) |

El proyecto nació como export de **Figma Make** (`package.json` → `"name": "@figma/my-make-file"`). De ahí vienen `src/imports/` (capturas de pantalla de referencia), `src/app/components/figma/ImageWithFallback.tsx` y el resolver `figma:asset/` en [vite.config.ts](../vite.config.ts). La carpeta `app/components/ui/` es boilerplate shadcn/ui generado automáticamente: no contiene lógica de negocio, solo tratarla como librería de componentes.

Hay un alias `@` → `src/` configurado en `vite.config.ts`, pero **no se usa en el código**: todos los imports son relativos (incluso con rutas profundas tipo `../../../../lib/supabase`). Al escribir código nuevo, seguir la convención existente (relativo) salvo que se decida migrar todo a `@/`.

## 2. Estructura de carpetas

```
├─ src/
│  ├─ app/                  → Tienda pública (storefront)
│  │  ├─ App.tsx             → Componente raíz; máquina de estados de pantallas ("screen")
│  │  └─ components/         → Pantallas y componentes del storefront
│  │     ├─ ui/               → Librería shadcn/ui (genérica, sin lógica de negocio)
│  │     ├─ figma/             → Utilidades heredadas de Figma Make
│  │     └─ data.ts            → Catálogo mock viejo (~1170 líneas). YA NO SE IMPORTA en ningún lado — candidato a borrar o convertir en seed (ver Deuda)
│  │
│  ├─ modules/admin/        → Panel de administración (backoffice), feature-based
│  │
│  ├─ core/
│  │  ├─ cart/               → Dominio del carrito, aislado y reusable (Context + Provider + hook), ids de producto como `string` (UUID)
│  │  └─ catalog/            → Dominio del catálogo público: `catalogService.ts` (queries a Supabase, solo columnas públicas) + `useCatalog.ts` (hook con loading/error). Sigue el patrón Componente → hook → servicio → Supabase
│  │
│  ├─ config/               → Configuración centralizada (branding, negocio, categorías, textos, tema); `storeConfig.storeSlug` identifica la tienda para el acceso anónimo
│  ├─ lib/supabase.ts       → Cliente único de Supabase (createClient con env vars)
│  ├─ types/product.ts      → `Product` unificado (público, id `string`) + `AdminProduct` (extiende `Product` con `cost`/`supplier`/etc., solo para `modules/admin`)
│  ├─ styles/               → CSS global (fonts, tailwind, theme)
│  ├─ hooks/, services/, utils/  → Carpetas compartidas a nivel raíz, actualmente VACÍAS (reservadas, sin uso todavía)
│  └─ main.tsx               → Entry point de la app
│
├─ supabase/
│  ├─ config.toml           → Config del proyecto Supabase (CLI). Ojo: los defaults de `[storage]`/etc ahí son solo del entorno LOCAL con Docker, no aplican al proyecto remoto que se usa en desarrollo
│  └─ functions/manage-users/ → Edge Function (Deno) para altas/bajas/roles de usuarios con permisos elevados
│
├─ docs/                    → Documentación (este archivo, Changelog, Roadmap, ProductVision, TODO, bitácora)
├─ guidelines/Guidelines.md → Lineamientos de estilo/producto
└─ public/games/            → Imágenes de productos (assets estáticos; en desuso desde que las imágenes reales se suben a Supabase Storage)
```

### `Product` unificado (resuelto en la sesión del 29/07/2026)

`src/types/product.ts` ahora define un único `Product` público:

```ts
interface Product {
  id: string;                                    // UUID
  slug: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  currency: string;
  category: { id: string; name: string } | null;
  brand: { id: string; name: string } | null;
  images: ProductImage[];
  stock: number;
  featured: boolean;
  metadata: Record<string, unknown>;              // atributos específicos de rubro (developer/genero/talle/etc.)
}
```

`AdminProduct extends Product` agrega `cost`, `taxRate`, `minimumStock`, `trackStock`, `active`, `published`, `categoryId`, `brandId`, `supplier` — campos que nunca deben llegar al storefront público. `AdminProduct` está definido pero **`modules/admin/products` todavía no lo usa** (sigue con su propio `Product` local en `products/data/productsData.ts`, con `category`/`brand`/`supplier` como strings planos) — la unificación quedó completa del lado público pero parcial del lado admin (ver Deuda, punto 1).

`core/cart/cartTypes.ts` (`CartItem extends Product`) y todo `core/cart/` migraron de `id: number` a `id: string` en la misma sesión.

## 3. Patrón feature-based en `modules/admin`

Cada entidad de negocio del admin vive en su propia carpeta con la misma mini-arquitectura interna:

```
modules/admin/<feature>/
  ├─ <Feature>Page.tsx        → Pantalla contenedora (compone tabla + formulario + toolbar)
  ├─ components/               → UI específica de la feature (tabla, formulario, filas)
  ├─ hooks/use<Feature>.ts     → Toda la lógica: fetch a Supabase, mutaciones, filtros, paginación, estado de loading/error
  └─ data/<feature>Data.ts     → Solo definiciones de tipos TS (interfaces). Ya NO contiene datos mock reales.
```

Features existentes: `brands`, `categories`, `clients`, `orders`, `products`, `purchases`, `suppliers`, `users`.

Elementos compartidos entre features, en `modules/admin/` directamente:
- `components/` → layout y widgets del dashboard (`AdminSidebar`, `AdminHeader`, `StatCard`, `DashboardCharts`, `NotificationPanel`, etc.) y `components/common/` (`Toast`, `Pagination`, `EmptyState`, `Toolbar`, `Message`) reutilizados por varias tablas.
- `hooks/` → hooks transversales: `useDataIntegrity` (chequea si un registro tiene dependencias antes de borrar, ej. "¿el cliente tiene pedidos?"), `useLocalStorage`, y variantes `use<Feature>Data.ts` (versión simplificada/solo-lectura usada por el dashboard, en paralelo a los hooks completos `use<Feature>.ts` dentro de cada feature — **hay cierta duplicación de lógica de fetch entre ambos**, a tener en cuenta).
- `types/dashboard.ts` → tipos compartidos del dashboard (ej. `DashboardAlert`).

### Convención del hook de feature (`use<Feature>.ts`)

Todos los hooks de Supabase en admin siguen el mismo patrón:

1. **Resolver tenant**: `supabase.auth.getUser()` → buscar `store_id` en la tabla `store_members` (`user_id` + `active = true`). Es un modelo **multi-tenant**: todo dato de negocio está scoped por `store_id`.
2. **Fetch con relaciones anidadas**: un único `select()` con joins de Postgrest (ej. `products` trae `categories(name)`, `brands(name)`, `product_images(...)`, `product_suppliers(suppliers(company))`, `inventory_levels(quantity, location_id)`).
3. **Mapeo DB → dominio**: función `mapX(row)` que convierte el tipo `<X>Row`/`<X>DatabaseRow` (snake_case, tal cual la fila de Postgres) al tipo de la app (camelCase, aplanado). Los `Row` types se declaran localmente en el propio hook, no se comparten.
4. **Estado local como cache**: `products`/`clients`/etc. viven en `useState` dentro del hook; tras cada mutación (`insert`/`update`/`delete`) se actualiza el estado local a mano en lugar de re-fetchear — optimista, sin librería de cache (no hay React Query/SWR).
5. **Errores en español, siempre logueados**: cada operación async está en `try/catch`, hace `console.error(caughtError)` y setea un `error: string` legible para el usuario en español (ej. `"No se pudo actualizar el producto."`).
6. **Stock e inventario**: los productos usan un modelo de inventario por depósito (`inventory_locations`, `inventory_levels` con `location_id`), con `stock_movements` como bitácora auditable de cada cambio (compra, cancelación de compra, etc.).
7. **Duplicados/integridad**: validaciones de negocio como email único de cliente se resuelven trayendo todos los registros del store y comparando en el cliente (`emailAlreadyExists`), no con constraint de Postgres consultado directamente.

### Excepción: `users` usa una Edge Function, no acceso directo a tablas

`modules/admin/users/services/usersService.ts` no llama a `supabase.from(...)` sino a `supabase.functions.invoke("manage-users", { body })`. Es el único módulo con capa `services/` propia. Motivo: crear/invitar/dar de baja usuarios requiere permisos elevados (service role) que no se le pueden dar al cliente, así que esa lógica vive server-side en [supabase/functions/manage-users](../supabase/functions/manage-users) (Deno Edge Function) con acciones `list | invite | update | remove`. El servicio valida la forma de la respuesta en runtime (type guards `isUser`, `isUserRole`, etc.) antes de confiar en ella.

Este patrón (Edge Function + `services/`) es el candidato natural a repetir para cualquier otra operación admin que necesite privilegios elevados o lógica server-side.

## 4. Estado de la migración a Supabase

**Migrados a Supabase (leen/escriben en Postgres real):**
- `modules/admin/products` (`useProducts`)
- `modules/admin/brands` (`useBrands`, `useBrandsData`)
- `modules/admin/categories` (`useCategories`, `useCategoriesData`)
- `modules/admin/clients` (`useClients`)
- `modules/admin/orders` (`useOrders`)
- `modules/admin/purchases` (`usePurchases`)
- `modules/admin/suppliers` (`useSuppliers`, `useSuppliersData`)
- `modules/admin/users` (vía Edge Function `manage-users`, no tabla directa)

En todos estos, `data/<feature>Data.ts` quedó reducido a solo tipos TS (algunos con un `export const x: X[] = []` residual sin uso real).

**Migrado en la sesión del 29/07/2026:**
- **Catálogo público del storefront** (`CatalogScreen`, `ProductGrid`, `ProductCard`, `FeaturedGames`, `ConsoleCategories`, `Header` (buscador), `CartDrawer`, `CheckoutScreen`, `CompletedScreen`): ya no usan `src/app/components/data.ts`. Consumen `useCatalog()` (`core/catalog/`), que trae productos y categorías reales de Supabase para la tienda `store_slug = "novashop-demo"` (resuelta en runtime vía `stores`, no hardcodeada por UUID). Solo se muestran productos con `active = true AND published = true`.
- **Imágenes de producto**: migraron de base64 embebido en `product_images.image_url` a Supabase Storage (bucket público `product-images`, ruta `{store_id}/{product_id}/{uuid}.ext`). Ver `useProducts.ts` (`uploadProductImage`/`removeProductImage`) y § Modelo de datos → Storage.
- **`products.published`/`products.active`**: ahora expuestos y editables desde `ProductForm.tsx` (toggle "Publicado/Borrador", default **Borrador** — publicar es una decisión explícita) y desde `ProductsTable.tsx`/`ProductRow.tsx` (acción "Activar"/"Desactivar", mismo patrón que `ClientsTable`). Antes `published` se hardcodeaba en `false` al crear y nunca se actualizaba al editar — todo producto nuevo nacía invisible en la tienda sin que hubiera forma de cambiarlo desde la UI.
- **Borrado de productos**: `handleDeleteProduct` ahora borra en cascada `product_images` → `product_suppliers` → `inventory_levels` (y el archivo en Storage) antes de borrar el producto. Si `stock_movements` o `purchase_items` referencian al producto, el borrado se bloquea con un mensaje claro sugiriendo usar "Desactivar" (mismo patrón que ya existía para `order_items` vía `hasOrdersByProduct`, ahora extendido con `hasStockMovementsByProduct`/`hasPurchaseItemsByProduct` en `useDataIntegrity.ts`). El error del hook ahora se renderiza en `ProductsPage.tsx` (antes se perdía en silencio).

**Todavía con datos mock / sin conectar:**
- `modules/admin/data/dashboardData.ts` (`dashboardStats`, `recentOrders`): números fijos de ejemplo para las tarjetas del dashboard, no calculados desde Supabase (a diferencia de `useDashboard`, que sí calcula KPIs reales pero solo a partir del array de `products` que se le pase por props).
- `core/cart/` (carrito de compra): vive enteramente en estado de React (`CartContext`/`CartProvider`), sin persistencia en Supabase ni relación con `inventory_levels`. Ya usa `id: string` (UUID) desde la migración de esta sesión, pero el carrito en sí sigue siendo solo cliente.

**Autenticación:** ya usa Supabase Auth en el storefront (`LoginScreen`, `RegisterScreen`, `SetPasswordScreen` — con manejo de flujos `invite`/`recovery` por query/hash params) y es la puerta de entrada también para el admin (mismo login sirve para `screen === "admin"`).

**Navegación admin ↔ storefront:** `AdminSidebar` tiene un botón "🛍️ Ver tienda" (`onGoStore`) que lleva a `screen === "home"`. Es navegación mínima agregada para poder probar el catálogo conectado; no hay un camino de vuelta directo al admin (hay que loguearse de nuevo).

## 5. Modelo de datos en Supabase

No hay migraciones versionadas en el repo (la base se creó a mano desde el SQL Editor del dashboard; `supabase db pull`/`db dump` requieren Docker, no disponible en el entorno de desarrollo actual). El esquema de esta sección se extrajo el 28/07/2026 consultando `information_schema.columns`, `pg_policies` y `pg_class` directamente. Es la fuente de verdad más confiable que el "modelo conceptual preliminar" de `docs/NovaShop_Contexto.txt`, que ya quedó desactualizado en varios puntos.

**Tablas confirmadas por schema real, con RLS activado en todas:**
- Multiempresa: `stores`, `store_members`, `store_settings`, `profiles`, `roles`
- Catálogo: `categories`, `brands`, `products`, `product_images`, `product_suppliers`
- Inventario: `inventory_locations`, `inventory_levels`, `stock_movements`
- Compras: `suppliers`, `purchases`, `purchase_items`
- Clientes y pedidos: `customers`, `customer_addresses`, `orders`, `order_items`, `order_addresses`, `order_status_history`, `payments`, `shipments`
- Auditoría: `audit_logs`

Varias de estas (`stores`, `store_settings`, `order_addresses`, `order_status_history`, `payments`, `shipments`, `audit_logs`) **existen en la base pero todavía no las consume ningún hook del frontend** — están más avanzadas de lo que sugería `NovaShop_Contexto.txt`. Confirmar con una consulta directa antes de asumir que una tabla no existe.

### Columnas reales de `products` (tabla núcleo del catálogo)

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid | PK |
| `store_id` | uuid | tenant |
| `category_id`, `brand_id` | uuid, nullable | relaciones por ID (no texto) |
| `name`, `slug`, `description` | text | `description` nullable |
| `sku`, `barcode` | text, nullable | |
| `price`, `cost`, `tax_rate` | numeric | `cost` es interno/admin, nunca debe exponerse al público |
| `currency` | varchar, default `'ARS'` | |
| `minimum_stock` | numeric | interno/admin |
| `track_stock` | boolean, default `true` | |
| `active`, `published`, `featured` | boolean | flags separados; `active && published` es la condición de visibilidad pública |
| `metadata` | jsonb, default `'{}'` | agregada el 29/07/2026. Atributos libres específicos de cada rubro (developer/género/año para gaming, talle/color para ropa, etc.) — decisión explícita de mantener `products` genérico y no agregar columnas fijas por rubro |
| `created_at`, `updated_at` | timestamptz | |

**Siguen sin existir** `original_price`/`discount`/`rating`/`reviews`/`badge` — quedaron fuera de alcance a propósito (ver Backlog en ProductVision.md → Catálogo/Ecommerce). `product_images` (`image_url`, `alt_text`, `display_order`, `is_primary`) y `product_suppliers` (`supplier_id`, `supplier_sku`, `unit_cost`, `preferred`) son tablas relacionadas 1-a-N, no columnas de `products`.

`stores`: `id`, `owner_user_id`, `name`, `slug`, `status` (default `'active'`), `currency`, `timezone`, `created_at`, `updated_at`. La tienda de desarrollo es `slug = "novashop-demo"` (`id = 81f5b4cb-1954-41de-8954-51ec1b922dea`).

### Supabase Storage

Agregado el 29/07/2026. Bucket **`product-images`**, público, límite 5 MB, tipos `image/png`, `image/jpeg`, `image/webp`. Ruta de objetos: `{store_id}/{product_id}/{uuid}.{ext}`.

- Lectura: sin policy propia — un bucket público sirve los objetos por URL directa sin pasar por RLS. Trade-off aceptado: la imagen de un producto en Borrador es técnicamente accesible si alguien adivina la URL (impacto bajo).
- Escritura (`insert`/`update`/`delete` en `storage.objects`): restringida a `is_store_member(store_id)`, extrayendo el `store_id` del primer segmento del path con `storage.foldername(name)`.
- El frontend nunca sube/borra directo desde el componente: `useProducts.ts` tiene `uploadProductImage`/`removeProductImage`, llamadas desde `handleAddProduct`/`handleUpdateProduct`/`handleDeleteProduct`. Al reemplazar o borrar la imagen de un producto, el archivo viejo se borra del bucket (`removeProductImage`, best-effort — si falla el borrado solo se loguea, no bloquea la operación principal).
- No hay `supabase storage` subcommand para crear buckets desde la CLI (solo `ls/cp/mv/rm` de objetos) — el bucket y sus policies se crearon a mano por SQL en el Editor, mismo flujo que el resto del esquema.

### Políticas RLS de lectura pública ya existentes

Antes de asumir que hace falta crear una policy nueva para el catálogo público, **ya existen** (rol `anon` incluido):
- `products_public_read`: `(active = true AND published = true) OR is_store_member(store_id)`
- `product_images_public_read`: solo imágenes de productos que cumplen la condición anterior
- `brands_public_read` / `categories_public_read`: `active = true OR is_store_member(store_id)`
- `stores_public_read_active`: `status = 'active' OR is_store_member(id)`
- `store_settings_public_read`: settings de tiendas activas

`cost`, `minimum_stock` y `supplier` no están expuestos por ninguna policy de lectura pública específica por columna — Postgres RLS es a nivel de fila, no de columna, así que cualquier código que use la policy `products_public_read` para armar la respuesta al público **debe seleccionar explícitamente solo las columnas públicas** (no hacer `select("*")`) para no filtrar `cost`/`minimum_stock` a un cliente anónimo aunque la fila sea visible.

## 6. Decisiones de arquitectura vigentes

Documentadas originalmente en `docs/NovaShop_Contexto.txt` (14/07/2026). Se listan acá porque son restricciones de diseño activas, no solo historial:

1. **Supabase es la infraestructura definitiva.** `localStorage` queda permitido únicamente para preferencias no sensibles, caché o estado temporal — nunca como fuente de verdad de datos de negocio.
2. **No crear módulos nuevos (Ventas, Caja, Reportes) hasta terminar de migrar la infraestructura existente.** Esto no bloquea trabajo *dentro* de módulos ya existentes (catálogo, productos, etc.).
3. **Modelo multiempresa por `store_id`.** Toda tabla de negocio nueva debe incluir `store_id` y todo query debe filtrar por el `store_id` del usuario autenticado (resuelto vía `store_members`).
4. **IDs son UUID generados por Postgres**, nunca `Date.now()` ni contadores en el cliente.
5. **Las relaciones se guardan por ID** (`category_id`, `brand_id`, `supplier_id`), nunca como texto libre. El texto (`category: string`, etc.) solo puede existir como campo derivado/de lectura en el tipo de dominio de la UI, mapeado desde la relación real.
6. **Separación interfaz/persistencia**: el flujo ideal es `Componente → hook → servicio → Supabase`. **Nota de estado real**: hoy solo `users` sigue esto completo (tiene `services/usersService.ts`); el resto de los hooks llaman `supabase.from(...)` directo — ver deuda técnica, punto 6.
7. **Diseñar antes de ejecutar SQL.** No crear tablas una por una sin revisar antes el modelo completo de la entidad.
8. **Nunca exponer la clave `service_role` en el frontend.** Cualquier operación que la necesite (como la gestión de usuarios) va en una Edge Function, siguiendo el patrón de `manage-users` (§3).

## 7. Convenciones detectadas

- **Idioma**: todo el código de dominio (mensajes de error, labels, comentarios) está en español; identificadores de código (variables, funciones, tipos) en inglés.
- **Mercado**: Argentina — moneda `ARS` hardcodeada en `storeConfig.ts` y en inserts (`currency: "ARS"`), `country: "Argentina"` hardcodeado en direcciones nuevas.
- **Naming**: componentes en PascalCase, hooks `use<Cosa>.ts` en camelCase, siempre con export nombrado (no default) salvo `App.tsx`.
- **Sin capa de servicios genérica**: la lógica de acceso a datos vive directamente en los hooks (`supabase.from(...)` inline), no hay un repositorio/DAO intermedio — excepto `users`, que sí tiene `services/`.
- **Sin librería de data-fetching**: no hay React Query/SWR; todo es `useEffect` + `useState` manual, con `loading`/`error` repetidos en cada hook.
- **Multi-tenant por `store_id`**: prácticamente toda tabla de negocio (`products`, `orders`, `customers`, `suppliers`, `purchases`, etc.) se filtra por `store_id`, resuelto en cada hook vía `store_members`. Cualquier query nueva a Supabase debe replicar ese filtro para no filtrar datos entre tiendas.
- **Confirmaciones destructivas con `window.confirm`**: los `handleDelete*` usan el diálogo nativo del navegador, no un modal propio. El `confirm` vive en el componente `*Table.tsx` (donde también corre el pre-chequeo de integridad), **no** en el hook — si un hook tiene su propio `window.confirm` interno es un bug (double-confirm), no un patrón a repetir.
- **Borrado con integridad de datos — patrón híbrido**: al borrar una entidad, distinguir entre relaciones que son "estado actual" (sin valor propio sin la entidad — ej. `product_images`, `product_suppliers`, `inventory_levels`) y relaciones que son "historial/auditoría" (`order_items`, `stock_movements`, `purchase_items`). Las primeras se borran en cascada desde el hook antes de borrar la fila principal; las segundas **bloquean el borrado** con un mensaje claro sugiriendo usar el campo `active` para desactivar en su lugar. El pre-chequeo vive en `useDataIntegrity.ts` (`has<Relación>By<Entidad>`, un `recordExists` por tabla) y se llama desde el `*Table.tsx` antes de siquiera confirmar. Ver `modules/admin/products` como referencia completa del patrón.
- **`active` como alternativa a borrar**: toda entidad con historial (productos, clientes, marcas, categorías, proveedores) tiene un botón "Activar"/"Desactivar" en su tabla, ligado a la columna `active` ya existente en el schema. Es la vía recomendada cuando el borrado físico está bloqueado por integridad referencial.
- **Resolución de tienda para acceso anónimo**: el storefront público no tiene sesión, así que no puede resolver `store_id` vía `store_members` como los hooks de admin. En su lugar, `core/catalog/catalogService.ts` resuelve `store_id` a partir de un `storeConfig.storeSlug` fijo, consultando `stores` (lectura pública ya permitida por `stores_public_read_active`). Preparado para resolver por dominio en un futuro multi-tienda.
- **`config/` como punto único de personalización**: `storeConfig.ts` (branding, colores, moneda), `business.ts`, `categories.ts`, `texts.ts`, `theme.ts` — sugiere intención de reusar esta base para múltiples tiendas ("white-label"), aunque hoy solo hay una tienda configurada.
- **`core/` para dominio reusable fuera de `app/`**: por ahora solo `cart/`, pero es el lugar pensado para lógica de negocio que no debería depender de componentes de UI del storefront.
- **Edge Functions para lo que requiere privilegios de servidor**: seguir el patrón de `manage-users` (Deno + service role) en vez de exponer operaciones sensibles vía RLS/cliente.

## 8. Deuda / puntos a resolver a futuro

**Resuelto en la sesión del 29/07/2026** (se deja registro para no reabrir sin motivo):
- ~~Unificar el modelo `Product` del storefront con el de admin~~ → resuelto del lado público (`src/types/product.ts`), sigue pendiente del lado admin (ver punto 1 abajo).
- ~~Conectar el catálogo público a Supabase~~ → resuelto (`core/catalog/`).
- ~~Imágenes de producto en base64~~ → migradas a Supabase Storage (bucket `product-images`).
- ~~`ProductsPage.tsx` no mostraba el `error` del hook~~ → resuelto con `<Message message={error} />`.
- ~~`handleDeleteProduct` fallaba en silencio por FK de `stock_movements`~~ → resuelto con el patrón híbrido cascada/bloqueo (§7).
- ~~7 imports rotos a `../data/productsData` en componentes del dashboard~~ y ~~mezcla `id: number`/`id: string` en `BrandsPage.tsx`/`CategoriesPage.tsx`/`CategoryForm.tsx`/`SuppliersPage.tsx`~~ → corregidos (bugs preexistentes, no relacionados con la migración de `Product`; sobrevivieron porque el proyecto nunca corrió un chequeo de tipos real hasta esta sesión — ver punto 3 abajo).
- ~~`handleAddBrand`/`handleAddSupplier` sin `await`~~ → el mensaje "ya existe" nunca se mostraba porque comparaban una `Promise` (siempre truthy) en vez de esperar el `boolean`. Corregido.

**Pendiente:**

1. `modules/admin/products` todavía usa su propio tipo `Product` local (`category`/`brand`/`supplier` como strings planos) en vez del `AdminProduct` unificado de `src/types/product.ts`. Tocar `useProducts.ts` + `ProductForm.tsx` + `ProductRow.tsx` + `ProductsTable.tsx` + `ProductsToolbar.tsx` es un cambio de alcance considerable sobre un módulo ya probado — se decidió no hacerlo en la misma sesión que se conectó el catálogo público, para no arriesgar el CRUD de productos funcionando.
2. **No hay `tsconfig.json` en el proyecto**, ni `typescript` estaba instalado hasta esta sesión (se agregó como devDependency). `npm run build` nunca chequeó tipos (solo transpila con esbuild vía `vite build`), por eso convivieron sin detectarse los 12 bugs corregidos arriba. Cualquier chequeo de tipos hoy depende de pasar flags manuales por CLI (`npx tsc --noEmit --jsx react-jsx --target es2020 --module esnext --moduleResolution bundler --lib es2020,dom --skipLibCheck src/main.tsx`). Crear un `tsconfig.json` real (con `vite/client` en `types`, `include`/`exclude` correctos) es la forma correcta de que esto se chequee solo, y potencialmente de agregarlo al build/CI.
3. `src/app/components/data.ts` (~1170 líneas de catálogo mock) quedó sin ningún import una vez conectado el catálogo real — candidato a borrar, o a convertir en script de seed para poblar `products` en desarrollo.
4. `src/config/categories.ts`: el export `categories` (Electrónica/Ropa/Perfumería/Juguetes) confirmado **sin ningún uso** en el código — solo se usa `navigation` de ese mismo archivo. Candidato a limpiar.
5. `handleDeleteProduct` borra `product_images`/`product_suppliers`/`inventory_levels` **antes** de intentar borrar `products` (es el único orden posible del lado cliente, porque esas tablas también bloquearían el borrado del producto si quedaran). Si el borrado final de `products` falla por una causa no cubierta por el pre-chequeo de `ProductsTable.tsx` (ej. una compra creada en el instante exacto entre el chequeo y el borrado), el producto queda "vivo" pero sin sus filas relacionadas. No es atómico porque Supabase-js no soporta transacciones multi-tabla desde el cliente; la solución correcta sería una función Postgres (RPC) que envuelva todo en una transacción. Se aceptó el riesgo residual (bajo, single-admin) en vez de construir el RPC.
6. Decidir si `hooks/`, `services/`, `utils/` a nivel raíz de `src/` se van a usar o se eliminan (están vacías).
7. Evaluar si conviene adoptar el alias `@/` de forma consistente, ya que está configurado pero no se usa.
8. Revisar la duplicación entre `use<Feature>.ts` (dentro de cada feature) y `use<Feature>Data.ts` (en `modules/admin/hooks/`), que parecen resolver fetch similar por caminos separados.
9. Los hooks de admin acceden a Supabase directo desde el hook, incumpliendo la decisión de arquitectura §6.6 (`Componente → hook → servicio → Supabase`). `users` y ahora `core/catalog` son los únicos alineados con la decisión. Evaluar si conviene formalizarlo para el resto o relajar la decisión documentada.
10. Advertencia de bundle >500 kB en cada `npm run build` (preexistente, no abordada — candidato: `import()` dinámico para separar admin del storefront).
