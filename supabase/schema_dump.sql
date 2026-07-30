-- NovaShop — dump manual del schema de Supabase (schema `public`, más lo mínimo
-- necesario de `storage` y el trigger de `auth.users`).
--
-- Generado a mano vía consultas a information_schema/pg_catalog el 29/07/2026,
-- sin Docker (supabase db pull/db dump no están disponibles en este entorno).
-- Ver docs/Architecture.md para el detalle de cómo se generó cada sección.
--
-- Excluido a propósito: la extensión "supabase_vault" (gestionada por la
-- plataforma de Supabase, se aprovisiona sola en cualquier proyecto nuevo) y
-- todo lo que vive en los schemas internos de Supabase (auth.*, storage.* salvo
-- buckets/políticas propias, realtime.*, etc.).
--
-- Este archivo es una FOTO del estado actual, no una migración incremental:
-- no hay `supabase/migrations/` versionadas porque el schema se construyó a
-- mano por el SQL Editor. Para volver a generarlo tras un cambio de schema,
-- repetir el proceso de consultas documentado en la bitácora.

begin;

-- ============================================================
-- 1. Extensiones
-- ============================================================

create extension if not exists "pg_stat_statements" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "uuid-ossp" with schema extensions;

-- ============================================================
-- 2. Tipos custom
-- ============================================================

create type public.checkout_line_item as (product_id uuid, product_name text, quantity integer, unit_price numeric);

-- ============================================================
-- 3. Secuencias
-- ============================================================

create sequence if not exists public.order_number_seq start with 1 increment by 1 minvalue 1 maxvalue 9223372036854775807 no cycle;

-- ============================================================
-- 4. Tablas (columnas, sin constraints todavía)
-- ============================================================

create table public.audit_logs (
  id uuid not null default gen_random_uuid(),
  store_id uuid,
  user_id uuid,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone not null default now()
);

create table public.brands (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  name text not null,
  slug text not null,
  description text,
  logo_url text,
  country text,
  website text,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.categories (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  parent_category_id uuid,
  name text not null,
  slug text not null,
  description text,
  image_url text,
  display_order integer not null default 0,
  active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.customer_addresses (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  customer_id uuid not null,
  label text,
  recipient_name text,
  phone text,
  street text not null,
  street_number text,
  apartment text,
  postal_code text,
  city text not null,
  province text,
  country text not null default 'Argentina'::text,
  references_text text,
  is_default_shipping boolean not null default false,
  is_default_billing boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.customers (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  auth_user_id uuid,
  first_name text,
  last_name text,
  business_name text,
  document_type text,
  document_number text,
  tax_condition text,
  email text,
  phone text,
  notes text,
  active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.inventory_levels (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  product_id uuid not null,
  location_id uuid not null,
  quantity numeric(14,3) not null default 0,
  reserved_quantity numeric(14,3) not null default 0,
  updated_at timestamp with time zone not null default now()
);

create table public.inventory_locations (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  name text not null,
  code text not null,
  address text,
  active boolean not null default true,
  is_default boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.order_addresses (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  order_id uuid not null,
  address_type text not null,
  recipient_name text,
  phone text,
  street text not null,
  street_number text,
  apartment text,
  postal_code text,
  city text not null,
  province text,
  country text not null default 'Argentina'::text,
  references_text text,
  created_at timestamp with time zone not null default now()
);

create table public.order_items (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  order_id uuid not null,
  product_id uuid,
  product_name text not null,
  sku text,
  quantity numeric(14,3) not null,
  unit_price numeric(14,2) not null,
  discount_total numeric(14,2) not null default 0,
  subtotal numeric(14,2) not null,
  created_at timestamp with time zone not null default now()
);

create table public.order_status_history (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  order_id uuid not null,
  previous_status text,
  new_status text not null,
  notes text,
  changed_by uuid,
  created_at timestamp with time zone not null default now()
);

create table public.orders (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  customer_id uuid,
  order_number text not null,
  customer_name text,
  customer_email text,
  customer_phone text,
  status text not null default 'draft'::text,
  payment_status text not null default 'pending'::text,
  fulfillment_status text not null default 'unfulfilled'::text,
  currency character varying(3) not null default 'ARS'::character varying,
  subtotal numeric(14,2) not null default 0,
  discount_total numeric(14,2) not null default 0,
  shipping_total numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  notes text,
  placed_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  created_by uuid,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.payments (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  order_id uuid not null,
  provider text,
  payment_method text,
  external_reference text,
  status text not null default 'pending'::text,
  currency character varying(3) not null default 'ARS'::character varying,
  amount numeric(14,2) not null,
  paid_at timestamp with time zone,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.product_images (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  product_id uuid not null,
  image_url text not null,
  alt_text text,
  display_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create table public.product_suppliers (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  product_id uuid not null,
  supplier_id uuid not null,
  supplier_sku text,
  unit_cost numeric(14,2),
  preferred boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.products (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  category_id uuid,
  brand_id uuid,
  name text not null,
  slug text not null,
  description text,
  sku text,
  barcode text,
  price numeric(14,2) not null default 0,
  cost numeric(14,2) not null default 0,
  currency character varying(3) not null default 'ARS'::character varying,
  tax_rate numeric(6,3) not null default 0,
  minimum_stock numeric(14,3) not null default 0,
  track_stock boolean not null default true,
  active boolean not null default true,
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table public.profiles (
  id uuid not null,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.purchase_items (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  purchase_id uuid not null,
  product_id uuid,
  product_name text not null,
  sku text,
  quantity numeric(14,3) not null,
  unit_cost numeric(14,2) not null,
  subtotal numeric(14,2) not null,
  created_at timestamp with time zone not null default now()
);

create table public.purchases (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  supplier_id uuid not null,
  purchase_number text not null,
  status text not null default 'completed'::text,
  payment_status text not null default 'pending'::text,
  purchase_date date not null default CURRENT_DATE,
  currency character varying(3) not null default 'ARS'::character varying,
  subtotal numeric(14,2) not null default 0,
  discount_total numeric(14,2) not null default 0,
  tax_total numeric(14,2) not null default 0,
  total numeric(14,2) not null default 0,
  payment_method text,
  observations text,
  created_by uuid,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.roles (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  code text not null,
  name text not null,
  description text,
  is_system boolean not null default false,
  created_at timestamp with time zone not null default now()
);

create table public.shipments (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  order_id uuid not null,
  shipping_method text,
  carrier text,
  tracking_number text,
  status text not null default 'pending'::text,
  shipped_at timestamp with time zone,
  delivered_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.stock_movements (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  product_id uuid not null,
  location_id uuid not null,
  movement_type text not null,
  quantity_delta numeric(14,3) not null,
  reference_type text,
  reference_id uuid,
  notes text,
  created_by uuid,
  created_at timestamp with time zone not null default now()
);

create table public.store_members (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  user_id uuid not null,
  role_id uuid not null,
  active boolean not null default true,
  invited_at timestamp with time zone,
  joined_at timestamp with time zone default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.store_settings (
  store_id uuid not null,
  slogan text,
  logo_url text,
  primary_color text not null default '#6A3CE6'::text,
  secondary_color text not null default '#8F6BFF'::text,
  background_color text not null default '#0d0e12'::text,
  whatsapp text,
  instagram text,
  email text,
  address text,
  product_label text not null default 'Productos'::text,
  category_label text not null default 'Categorías'::text,
  featured_label text not null default 'Destacados'::text,
  payment_methods jsonb not null default '[]'::jsonb,
  shipping_methods jsonb not null default '[]'::jsonb,
  additional_settings jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.stores (
  id uuid not null default gen_random_uuid(),
  owner_user_id uuid not null,
  name text not null,
  slug text not null,
  status text not null default 'active'::text,
  currency character varying(3) not null default 'ARS'::character varying,
  timezone text not null default 'America/Argentina/Buenos_Aires'::text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

create table public.suppliers (
  id uuid not null default gen_random_uuid(),
  store_id uuid not null,
  company text not null,
  contact_name text,
  email text,
  phone text,
  address text,
  city text,
  province text,
  country text not null default 'Argentina'::text,
  postal_code text,
  tax_id text,
  website text,
  notes text,
  supplier_type text,
  active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- ============================================================
-- 5. Row Level Security habilitado
-- ============================================================

alter table public.audit_logs enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.customers enable row level security;
alter table public.inventory_levels enable row level security;
alter table public.inventory_locations enable row level security;
alter table public.order_addresses enable row level security;
alter table public.order_items enable row level security;
alter table public.order_status_history enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.product_images enable row level security;
alter table public.product_suppliers enable row level security;
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.purchase_items enable row level security;
alter table public.purchases enable row level security;
alter table public.roles enable row level security;
alter table public.shipments enable row level security;
alter table public.stock_movements enable row level security;
alter table public.store_members enable row level security;
alter table public.store_settings enable row level security;
alter table public.stores enable row level security;
alter table public.suppliers enable row level security;

-- ============================================================
-- 6. Constraints (PRIMARY KEY, UNIQUE, CHECK, FOREIGN KEY)
-- ============================================================

alter table public.audit_logs add constraint audit_logs_pkey PRIMARY KEY (id);
alter table public.brands add constraint brands_pkey PRIMARY KEY (id);
alter table public.categories add constraint categories_pkey PRIMARY KEY (id);
alter table public.customer_addresses add constraint customer_addresses_pkey PRIMARY KEY (id);
alter table public.customers add constraint customers_pkey PRIMARY KEY (id);
alter table public.inventory_levels add constraint inventory_levels_pkey PRIMARY KEY (id);
alter table public.inventory_locations add constraint inventory_locations_pkey PRIMARY KEY (id);
alter table public.order_addresses add constraint order_addresses_pkey PRIMARY KEY (id);
alter table public.order_items add constraint order_items_pkey PRIMARY KEY (id);
alter table public.order_status_history add constraint order_status_history_pkey PRIMARY KEY (id);
alter table public.orders add constraint orders_pkey PRIMARY KEY (id);
alter table public.payments add constraint payments_pkey PRIMARY KEY (id);
alter table public.product_images add constraint product_images_pkey PRIMARY KEY (id);
alter table public.product_suppliers add constraint product_suppliers_pkey PRIMARY KEY (id);
alter table public.products add constraint products_pkey PRIMARY KEY (id);
alter table public.profiles add constraint profiles_pkey PRIMARY KEY (id);
alter table public.purchase_items add constraint purchase_items_pkey PRIMARY KEY (id);
alter table public.purchases add constraint purchases_pkey PRIMARY KEY (id);
alter table public.roles add constraint roles_pkey PRIMARY KEY (id);
alter table public.shipments add constraint shipments_pkey PRIMARY KEY (id);
alter table public.stock_movements add constraint stock_movements_pkey PRIMARY KEY (id);
alter table public.store_members add constraint store_members_pkey PRIMARY KEY (id);
alter table public.store_settings add constraint store_settings_pkey PRIMARY KEY (store_id);
alter table public.stores add constraint stores_pkey PRIMARY KEY (id);
alter table public.suppliers add constraint suppliers_pkey PRIMARY KEY (id);

alter table public.brands add constraint brands_store_slug_unique UNIQUE (store_id, slug);
alter table public.categories add constraint categories_store_slug_unique UNIQUE (store_id, slug);
alter table public.inventory_levels add constraint inventory_levels_product_location_unique UNIQUE (product_id, location_id);
alter table public.inventory_locations add constraint inventory_locations_store_code_unique UNIQUE (store_id, code);
alter table public.order_addresses add constraint order_addresses_type_unique UNIQUE (order_id, address_type);
alter table public.orders add constraint orders_store_number_unique UNIQUE (store_id, order_number);
alter table public.payments add constraint payments_provider_reference_unique UNIQUE (provider, external_reference);
alter table public.product_suppliers add constraint product_suppliers_unique UNIQUE (product_id, supplier_id);
alter table public.products add constraint products_store_sku_unique UNIQUE (store_id, sku);
alter table public.products add constraint products_store_slug_unique UNIQUE (store_id, slug);
alter table public.purchases add constraint purchases_store_number_unique UNIQUE (store_id, purchase_number);
alter table public.roles add constraint roles_store_code_unique UNIQUE (store_id, code);
alter table public.store_members add constraint store_members_store_user_unique UNIQUE (store_id, user_id);
alter table public.stores add constraint stores_slug_key UNIQUE (slug);

alter table public.inventory_levels add constraint inventory_levels_reserved_nonnegative CHECK ((reserved_quantity >= (0)::numeric));
alter table public.order_addresses add constraint order_addresses_address_type_check CHECK ((address_type = ANY (ARRAY['shipping'::text, 'billing'::text])));
alter table public.order_items add constraint order_items_discount_total_check CHECK ((discount_total >= (0)::numeric));
alter table public.order_items add constraint order_items_quantity_check CHECK ((quantity > (0)::numeric));
alter table public.order_items add constraint order_items_subtotal_check CHECK ((subtotal >= (0)::numeric));
alter table public.order_items add constraint order_items_unit_price_check CHECK ((unit_price >= (0)::numeric));
alter table public.orders add constraint orders_fulfillment_status_check CHECK ((fulfillment_status = ANY (ARRAY['unfulfilled'::text, 'preparing'::text, 'ready_for_pickup'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])));
alter table public.orders add constraint orders_payment_status_check CHECK ((payment_status = ANY (ARRAY['pending'::text, 'authorized'::text, 'paid'::text, 'partially_refunded'::text, 'refunded'::text, 'failed'::text, 'cancelled'::text])));
alter table public.orders add constraint orders_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])));
alter table public.orders add constraint orders_totals_nonnegative CHECK (((subtotal >= (0)::numeric) AND (discount_total >= (0)::numeric) AND (shipping_total >= (0)::numeric) AND (tax_total >= (0)::numeric) AND (total >= (0)::numeric)));
alter table public.payments add constraint payments_amount_check CHECK ((amount >= (0)::numeric));
alter table public.payments add constraint payments_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'authorized'::text, 'paid'::text, 'failed'::text, 'refunded'::text, 'cancelled'::text])));
alter table public.product_suppliers add constraint product_suppliers_unit_cost_check CHECK (((unit_cost IS NULL) OR (unit_cost >= (0)::numeric)));
alter table public.products add constraint products_cost_check CHECK ((cost >= (0)::numeric));
alter table public.products add constraint products_price_check CHECK ((price >= (0)::numeric));
alter table public.products add constraint products_tax_rate_check CHECK ((tax_rate >= (0)::numeric));
alter table public.purchase_items add constraint purchase_items_quantity_check CHECK ((quantity > (0)::numeric));
alter table public.purchase_items add constraint purchase_items_subtotal_check CHECK ((subtotal >= (0)::numeric));
alter table public.purchase_items add constraint purchase_items_unit_cost_check CHECK ((unit_cost >= (0)::numeric));
alter table public.purchases add constraint purchases_payment_status_check CHECK ((payment_status = ANY (ARRAY['pending'::text, 'partially_paid'::text, 'paid'::text, 'cancelled'::text])));
alter table public.purchases add constraint purchases_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'completed'::text, 'cancelled'::text])));
alter table public.purchases add constraint purchases_totals_nonnegative CHECK (((subtotal >= (0)::numeric) AND (discount_total >= (0)::numeric) AND (tax_total >= (0)::numeric) AND (total >= (0)::numeric)));
alter table public.shipments add constraint shipments_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'preparing'::text, 'shipped'::text, 'delivered'::text, 'failed'::text, 'cancelled'::text])));
alter table public.stock_movements add constraint stock_movements_movement_type_check CHECK ((movement_type = ANY (ARRAY['initial'::text, 'purchase'::text, 'purchase_cancel'::text, 'sale'::text, 'order_reservation'::text, 'order_release'::text, 'return'::text, 'adjustment'::text, 'transfer_in'::text, 'transfer_out'::text])));
alter table public.stock_movements add constraint stock_movements_quantity_delta_check CHECK ((quantity_delta <> (0)::numeric));
alter table public.stores add constraint stores_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text])));
alter table public.suppliers add constraint suppliers_supplier_type_check CHECK (((supplier_type IS NULL) OR (supplier_type = ANY (ARRAY['wholesaler'::text, 'distributor'::text, 'manufacturer'::text, 'importer'::text, 'other'::text]))));

alter table public.audit_logs add constraint audit_logs_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.audit_logs add constraint audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.brands add constraint brands_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.categories add constraint categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES categories(id) ON DELETE SET NULL;
alter table public.categories add constraint categories_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.customer_addresses add constraint customer_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;
alter table public.customer_addresses add constraint customer_addresses_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.customers add constraint customers_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.customers add constraint customers_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.inventory_levels add constraint inventory_levels_location_id_fkey FOREIGN KEY (location_id) REFERENCES inventory_locations(id) ON DELETE CASCADE;
alter table public.inventory_levels add constraint inventory_levels_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
alter table public.inventory_levels add constraint inventory_levels_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.inventory_locations add constraint inventory_locations_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.order_addresses add constraint order_addresses_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
alter table public.order_addresses add constraint order_addresses_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.order_items add constraint order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
alter table public.order_items add constraint order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
alter table public.order_items add constraint order_items_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.order_status_history add constraint order_status_history_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.order_status_history add constraint order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
alter table public.order_status_history add constraint order_status_history_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.orders add constraint orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.orders add constraint orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL;
alter table public.orders add constraint orders_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.payments add constraint payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
alter table public.payments add constraint payments_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.product_images add constraint product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
alter table public.product_images add constraint product_images_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.product_suppliers add constraint product_suppliers_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
alter table public.product_suppliers add constraint product_suppliers_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.product_suppliers add constraint product_suppliers_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE;
alter table public.products add constraint products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL;
alter table public.products add constraint products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
alter table public.products add constraint products_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.profiles add constraint profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.purchase_items add constraint purchase_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
alter table public.purchase_items add constraint purchase_items_purchase_id_fkey FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE;
alter table public.purchase_items add constraint purchase_items_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.purchases add constraint purchases_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.purchases add constraint purchases_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.purchases add constraint purchases_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES suppliers(id);
alter table public.roles add constraint roles_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.shipments add constraint shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
alter table public.shipments add constraint shipments_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.stock_movements add constraint stock_movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
alter table public.stock_movements add constraint stock_movements_location_id_fkey FOREIGN KEY (location_id) REFERENCES inventory_locations(id);
alter table public.stock_movements add constraint stock_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id);
alter table public.stock_movements add constraint stock_movements_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.store_members add constraint store_members_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id);
alter table public.store_members add constraint store_members_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.store_members add constraint store_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
alter table public.store_settings add constraint store_settings_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;
alter table public.stores add constraint stores_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES auth.users(id);
alter table public.suppliers add constraint suppliers_store_id_fkey FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE;

-- ============================================================
-- 7. Índices propios (los de PK/UNIQUE ya los crea la sección anterior)
-- ============================================================

CREATE INDEX idx_audit_logs_store_created ON public.audit_logs USING btree (store_id, created_at DESC);
CREATE INDEX idx_brands_store ON public.brands USING btree (store_id);
CREATE INDEX idx_categories_parent ON public.categories USING btree (parent_category_id);
CREATE INDEX idx_categories_store ON public.categories USING btree (store_id);
CREATE INDEX idx_customers_email ON public.customers USING btree (store_id, email);
CREATE INDEX idx_customers_store ON public.customers USING btree (store_id);
CREATE INDEX idx_inventory_levels_product ON public.inventory_levels USING btree (product_id);
CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);
CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_id);
CREATE INDEX idx_orders_store_created ON public.orders USING btree (store_id, created_at DESC);
CREATE INDEX idx_payments_order ON public.payments USING btree (order_id);
CREATE INDEX idx_product_images_product ON public.product_images USING btree (product_id);
CREATE INDEX idx_products_brand ON public.products USING btree (brand_id);
CREATE INDEX idx_products_category ON public.products USING btree (category_id);
CREATE INDEX idx_products_published ON public.products USING btree (store_id, published, active);
CREATE INDEX idx_products_store ON public.products USING btree (store_id);
CREATE INDEX idx_purchase_items_purchase ON public.purchase_items USING btree (purchase_id);
CREATE INDEX idx_purchases_store_date ON public.purchases USING btree (store_id, purchase_date DESC);
CREATE INDEX idx_shipments_order ON public.shipments USING btree (order_id);
CREATE INDEX idx_stock_movements_product ON public.stock_movements USING btree (product_id, created_at DESC);
CREATE INDEX idx_store_members_user ON public.store_members USING btree (user_id);
CREATE INDEX idx_suppliers_store ON public.suppliers USING btree (store_id);

-- ============================================================
-- 8. Funciones
-- ============================================================

CREATE OR REPLACE FUNCTION public.bootstrap_new_store()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  owner_role_id uuid;
begin
  insert into public.roles (
    store_id,
    code,
    name,
    description,
    is_system
  )
  values
    (
      new.id,
      'owner',
      'Propietario',
      'Control total del comercio',
      true
    )
  returning id into owner_role_id;

  insert into public.roles (
    store_id,
    code,
    name,
    description,
    is_system
  )
  values
    (
      new.id,
      'admin',
      'Administrador',
      'Administración general del comercio',
      true
    ),
    (
      new.id,
      'seller',
      'Vendedor',
      'Gestión de pedidos, clientes y ventas',
      true
    ),
    (
      new.id,
      'employee',
      'Empleado',
      'Acceso operativo limitado',
      true
    );

  insert into public.store_members (
    store_id,
    user_id,
    role_id,
    active,
    joined_at
  )
  values (
    new.id,
    new.owner_user_id,
    owner_role_id,
    true,
    now()
  );

  insert into public.store_settings (store_id)
  values (new.id);

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.checkout_create_order(p_store_id uuid, p_items jsonb, p_customer jsonb, p_delivery jsonb, p_payment_method text)
 RETURNS TABLE(order_id uuid, order_number text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_location_id uuid;
  v_customer_id uuid;
  v_email text := lower(trim(p_customer->>'email'));
  v_first_name text := nullif(trim(p_customer->>'first_name'), '');
  v_last_name text := nullif(trim(p_customer->>'last_name'), '');
  v_phone text := nullif(trim(p_customer->>'phone'), '');
  v_customer_name text;
  v_row record;
  v_product record;
  v_available numeric;
  v_lines checkout_line_item[] := '{}';
  v_subtotal numeric := 0;
  v_order_id uuid;
  v_order_number text;
  v_line checkout_line_item;
begin
  -- 1. Validar tienda
  perform 1 from stores where id = p_store_id and status = 'active';
  if not found then
    raise exception 'La tienda no está disponible.';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El carrito está vacío.';
  end if;

  if v_email is null then
    raise exception 'Falta el email de contacto.';
  end if;

  -- 2. Depósito activo de la tienda (misma convención que usa el admin)
  select id into v_location_id
  from inventory_locations
  where store_id = p_store_id and active = true
  limit 1;

  if v_location_id is null then
    raise exception 'No se encontró depósito activo para la tienda.';
  end if;

  -- 3. Validar stock y precios, línea por línea, en orden fijo por product_id
  --    (evita deadlocks entre checkouts concurrentes que comparten productos)
  for v_row in
    select *
    from jsonb_to_recordset(p_items) as x(product_id uuid, quantity integer)
    order by product_id
  loop
    if v_row.product_id is null or v_row.quantity is null or v_row.quantity <= 0 then
      raise exception 'Cantidad inválida en el carrito.';
    end if;

    select id, name, price, active, published
    into v_product
    from products
    where id = v_row.product_id and store_id = p_store_id;

    if not found or not v_product.active or not v_product.published then
      raise exception 'Uno de los productos ya no está disponible.';
    end if;

    select quantity into v_available
    from inventory_levels
    where product_id = v_row.product_id and location_id = v_location_id
    for update;

    if v_available is null then
      v_available := 0;
    end if;

    if v_available < v_row.quantity then
      raise exception 'Stock insuficiente para "%" (disponible: %, solicitado: %).',
        v_product.name, v_available, v_row.quantity;
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_row.quantity);

    v_lines := array_append(
      v_lines,
      row(v_row.product_id, v_product.name, v_row.quantity, v_product.price)::checkout_line_item
    );
  end loop;

  -- 4. Cliente invitado: buscar por email en la tienda, o crear
  select id into v_customer_id
  from customers
  where store_id = p_store_id and lower(email) = v_email;

  v_customer_name := trim(coalesce(v_first_name, '') || ' ' || coalesce(v_last_name, ''));

  if v_customer_id is null then
    insert into customers (store_id, first_name, last_name, email, phone)
    values (p_store_id, v_first_name, v_last_name, v_email, v_phone)
    returning id into v_customer_id;
  else
    update customers
    set first_name = coalesce(v_first_name, first_name),
        last_name = coalesce(v_last_name, last_name),
        phone = coalesce(v_phone, phone)
    where id = v_customer_id;
  end if;

  -- 5. Orden
  v_order_number := 'PED-' || lpad(nextval('order_number_seq')::text, 6, '0');

  insert into orders (
    store_id, customer_id, order_number,
    customer_name, customer_email, customer_phone,
    status, payment_status, fulfillment_status, currency,
    subtotal, discount_total, shipping_total, tax_total, total,
    notes, placed_at, created_by
  ) values (
    p_store_id, v_customer_id, v_order_number,
    v_customer_name, v_email, v_phone,
    'confirmed', 'pending', 'unfulfilled', 'ARS',
    v_subtotal, 0, 0, 0, v_subtotal,
    'Método de pago seleccionado: ' || p_payment_method, now(), null
  )
  returning id into v_order_id;

  -- 6. Ítems de la orden
  insert into order_items (store_id, order_id, product_id, product_name, quantity, unit_price, discount_total, subtotal)
  select p_store_id, v_order_id, l.product_id, l.product_name, l.quantity, l.unit_price, 0, l.quantity * l.unit_price
  from unnest(v_lines) as l;

  -- 7. Dirección de entrega, solo si es envío a domicilio
  if p_delivery->>'method' = 'shipping' then
    insert into order_addresses (
      store_id, order_id, address_type, recipient_name, phone,
      street, street_number, apartment, postal_code, city, province, references_text
    ) values (
      p_store_id, v_order_id, 'shipping', v_customer_name, v_phone,
      p_delivery->>'address', p_delivery->>'number', null,
      p_delivery->>'postal_code', p_delivery->>'city', p_delivery->>'province',
      p_delivery->>'references'
    );
  end if;

  -- 8. Descontar stock y registrar movimiento, por línea
  for v_line in select * from unnest(v_lines)
  loop
    update inventory_levels
    set quantity = quantity - v_line.quantity
    where product_id = v_line.product_id and location_id = v_location_id;

    insert into stock_movements (
      store_id, product_id, location_id, movement_type, quantity_delta,
      reference_type, reference_id, notes, created_by
    ) values (
      p_store_id, v_line.product_id, v_location_id, 'sale', -v_line.quantity,
      'order', v_order_id, 'Salida de stock por venta online', null
    );
  end loop;

  return query select v_order_id, v_order_number;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (
    id,
    full_name
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.is_store_admin(target_store_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.store_members sm
    join public.roles r on r.id = sm.role_id
    where sm.store_id = target_store_id
      and sm.user_id = auth.uid()
      and sm.active = true
      and r.code in ('owner', 'admin')
  );
$function$
;

CREATE OR REPLACE FUNCTION public.is_store_member(target_store_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.store_members sm
    where sm.store_id = target_store_id
      and sm.user_id = auth.uid()
      and sm.active = true
  );
$function$
;

CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

-- ============================================================
-- 9. Triggers
-- ============================================================

CREATE TRIGGER brands_set_updated_at BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER customer_addresses_set_updated_at BEFORE UPDATE ON public.customer_addresses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER customers_set_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER inventory_levels_set_updated_at BEFORE UPDATE ON public.inventory_levels FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER inventory_locations_set_updated_at BEFORE UPDATE ON public.inventory_locations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER payments_set_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER product_suppliers_set_updated_at BEFORE UPDATE ON public.product_suppliers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER purchases_set_updated_at BEFORE UPDATE ON public.purchases FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER shipments_set_updated_at BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER store_members_set_updated_at BEFORE UPDATE ON public.store_members FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER store_settings_set_updated_at BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER stores_set_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trigger_bootstrap_new_store AFTER INSERT ON public.stores FOR EACH ROW EXECUTE FUNCTION bootstrap_new_store();
CREATE TRIGGER suppliers_set_updated_at BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Trigger sobre auth.users (schema gestionado por Supabase) que crea el
-- perfil correspondiente en public.profiles al registrarse un usuario nuevo.
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 10. Políticas RLS (tablas de public)
-- ============================================================

create policy audit_logs_insert_members on public.audit_logs as PERMISSIVE for INSERT to authenticated with check (is_store_member(store_id));
create policy audit_logs_select_admin on public.audit_logs as PERMISSIVE for SELECT to authenticated using (is_store_admin(store_id));
create policy brands_admin_delete on public.brands as PERMISSIVE for DELETE to authenticated using (is_store_admin(store_id));
create policy brands_member_insert on public.brands as PERMISSIVE for INSERT to authenticated with check (is_store_member(store_id));
create policy brands_member_update on public.brands as PERMISSIVE for UPDATE to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy brands_public_read on public.brands as PERMISSIVE for SELECT to anon, authenticated using (((active = true) OR is_store_member(store_id)));
create policy categories_admin_delete on public.categories as PERMISSIVE for DELETE to authenticated using (is_store_admin(store_id));
create policy categories_member_insert on public.categories as PERMISSIVE for INSERT to authenticated with check (is_store_member(store_id));
create policy categories_member_update on public.categories as PERMISSIVE for UPDATE to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy categories_public_read on public.categories as PERMISSIVE for SELECT to anon, authenticated using (((active = true) OR is_store_member(store_id)));
create policy customer_addresses_members on public.customer_addresses as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy customers_members on public.customers as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy inventory_levels_members on public.inventory_levels as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy inventory_locations_members on public.inventory_locations as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy order_addresses_members on public.order_addresses as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy order_items_members on public.order_items as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy order_status_history_members on public.order_status_history as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy orders_members on public.orders as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy payments_members on public.payments as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy product_images_member_manage on public.product_images as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy product_images_public_read on public.product_images as PERMISSIVE for SELECT to anon, authenticated using ((EXISTS ( SELECT 1
   FROM products p
  WHERE ((p.id = product_images.product_id) AND (((p.active = true) AND (p.published = true)) OR is_store_member(p.store_id))))));
create policy product_suppliers_members on public.product_suppliers as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy products_admin_delete on public.products as PERMISSIVE for DELETE to authenticated using (is_store_admin(store_id));
create policy products_member_insert on public.products as PERMISSIVE for INSERT to authenticated with check (is_store_member(store_id));
create policy products_member_update on public.products as PERMISSIVE for UPDATE to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy products_public_read on public.products as PERMISSIVE for SELECT to anon, authenticated using ((((active = true) AND (published = true)) OR is_store_member(store_id)));
create policy profiles_select_own on public.profiles as PERMISSIVE for SELECT to authenticated using ((id = auth.uid()));
create policy profiles_update_own on public.profiles as PERMISSIVE for UPDATE to authenticated using ((id = auth.uid())) with check ((id = auth.uid()));
create policy purchase_items_members on public.purchase_items as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy purchases_members on public.purchases as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy roles_manage_admin on public.roles as PERMISSIVE for ALL to authenticated using (is_store_admin(store_id)) with check (is_store_admin(store_id));
create policy roles_select_members on public.roles as PERMISSIVE for SELECT to authenticated using (is_store_member(store_id));
create policy shipments_members on public.shipments as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy stock_movements_members on public.stock_movements as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));
create policy store_members_manage_admin on public.store_members as PERMISSIVE for ALL to authenticated using (is_store_admin(store_id)) with check (is_store_admin(store_id));
create policy store_members_select_members on public.store_members as PERMISSIVE for SELECT to authenticated using (((user_id = auth.uid()) OR is_store_admin(store_id)));
create policy store_settings_manage_admin on public.store_settings as PERMISSIVE for ALL to authenticated using (is_store_admin(store_id)) with check (is_store_admin(store_id));
create policy store_settings_public_read on public.store_settings as PERMISSIVE for SELECT to anon, authenticated using (((EXISTS ( SELECT 1
   FROM stores s
  WHERE ((s.id = store_settings.store_id) AND (s.status = 'active'::text)))) OR is_store_member(store_id)));
create policy stores_delete_owner on public.stores as PERMISSIVE for DELETE to authenticated using ((owner_user_id = auth.uid()));
create policy stores_insert_owner on public.stores as PERMISSIVE for INSERT to authenticated with check ((owner_user_id = auth.uid()));
create policy stores_public_read_active on public.stores as PERMISSIVE for SELECT to anon, authenticated using (((status = 'active'::text) OR is_store_member(id)));
create policy stores_update_admin on public.stores as PERMISSIVE for UPDATE to authenticated using (is_store_admin(id)) with check (is_store_admin(id));
create policy suppliers_members on public.suppliers as PERMISSIVE for ALL to authenticated using (is_store_member(store_id)) with check (is_store_member(store_id));

-- ============================================================
-- 11. Storage: bucket de imágenes de producto + sus políticas
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values ('product-images', 'product-images', true, 5242880, array['image/png','image/jpeg','image/webp']) on conflict (id) do nothing;

create policy product_images_delete_members on storage.objects as PERMISSIVE for DELETE to authenticated using (((bucket_id = 'product-images'::text) AND is_store_member(((storage.foldername(name))[1])::uuid)));
create policy product_images_insert_members on storage.objects as PERMISSIVE for INSERT to authenticated with check (((bucket_id = 'product-images'::text) AND is_store_member(((storage.foldername(name))[1])::uuid)));
create policy product_images_update_members on storage.objects as PERMISSIVE for UPDATE to authenticated using (((bucket_id = 'product-images'::text) AND is_store_member(((storage.foldername(name))[1])::uuid))) with check (((bucket_id = 'product-images'::text) AND is_store_member(((storage.foldername(name))[1])::uuid)));

-- ============================================================
-- 12. Grants y revokes
-- ============================================================

-- checkout_create_order: invocable desde el storefront público (checkout de invitado).
grant EXECUTE on function public.checkout_create_order to anon;
grant EXECUTE on function public.checkout_create_order to authenticated;

-- is_store_admin / is_store_member: usadas adentro de casi todas las políticas
-- RLS de arriba. anon necesita EXECUTE para que esas políticas se puedan
-- evaluar en absoluto al leer catálogo público — para un anónimo (auth.uid()
-- null) siempre resuelven a false, no filtran datos de ninguna tienda.
grant EXECUTE on function public.is_store_admin to anon;
grant EXECUTE on function public.is_store_admin to authenticated;
grant EXECUTE on function public.is_store_member to anon;
grant EXECUTE on function public.is_store_member to authenticated;

-- bootstrap_new_store / handle_new_user / set_updated_at: son funciones
-- trigger (RETURNS trigger). Postgres ya bloquea su invocación directa fuera
-- de un trigger ("trigger functions can only be called as triggers"), así
-- que este REVOKE no cambia el comportamiento real — solo deja explícito en
-- el schema que estas tres son de uso interno, sin depender de que quien lo
-- lea sepa ese detalle de Postgres.
revoke execute on function public.bootstrap_new_store() from anon, authenticated;
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.set_updated_at() from anon, authenticated;

commit;
