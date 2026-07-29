# Product Vision

## Nombre del producto

NovaShop

## Misión

Permitir que cualquier pequeño o mediano comercio pueda tener una tienda online moderna, profesional y fácil de administrar.

## Visión

Convertir NovaShop en una plataforma adaptable para distintos rubros, con un panel de administración intuitivo y funcionalidades comerciales reales.

## Público objetivo

- Comercios locales
- Emprendedores
- Pymes
- Negocios familiares

## Filosofía

No desarrollar una tienda para un solo cliente.

Desarrollar una plataforma que pueda adaptarse a cientos de clientes.

## Objetivos

- Ser simple.
- Ser rápido.
- Ser escalable.
- Ser fácil de personalizar.
- Tener un diseño moderno.

## Visión de plataforma comercial (multiempresa / SaaS)

NovaShop debe evolucionar hacia una plataforma que soporte:

- Múltiples comercios y múltiples usuarios por comercio (ver modelo multiempresa en [Architecture.md](Architecture.md)).
- Diferentes planes comerciales, con límites por plan.
- Personalización por comercio: nombre, logo, colores, contacto.
- Storage de imágenes propio por comercio.
- Integraciones de pago y envío configurables.
- Seguridad y aislamiento de datos por comercio.
- Despliegue y mantenimiento pensados para operación comercial (no solo demo).
- Panel interno de NovaShop para gestionar comercios, dominios personalizados, white label, multimoneda, multiidioma y múltiples sucursales, y facturación del servicio.

Esta visión todavía no está implementada — hoy existe un único comercio configurado a mano en `src/config/*.ts`. Es el horizonte a largo plazo detrás de decisiones como el modelo `store_id` (ver Architecture.md § Decisiones de arquitectura).

**Progreso relevante (29/07/2026)**: el catálogo público de la tienda ya lee de Supabase en vez de datos mock, y ya resuelve la tienda por `slug` en vez de por un ID pisado a mano — es la pieza que faltaba para que, el día que exista más de una tienda, el storefront pueda apuntar a cualquiera de ellas sin tocar código. Detalle técnico completo en [Architecture.md](Architecture.md).

## Backlog de funcionalidades futuras

Relevado de `docs/NovaShop_Contexto.txt`. No es un compromiso de corto plazo — es la lista de referencia para no perder de vista el alcance completo del producto al priorizar. Antes de iniciar cualquier ítem, confirmar que sigue vigente (este backlog puede haber quedado desactualizado respecto a decisiones más recientes).

**Catálogo**: SKU, código de barras, costo, margen, precio de oferta, variantes, talles, colores, imágenes múltiples, productos relacionados, combos, kits, listas de precios, productos digitales, productos por peso.

**Inventario**: movimientos de stock, ajustes, reservas por pedidos, stock disponible vs. comprometido, stock mínimo, múltiples depósitos, transferencias entre depósitos, auditoría de movimientos.

**Compras**: recepciones parciales, cuenta corriente del proveedor, pagos parciales, comprobantes, impuestos, descuentos, costos adicionales, devoluciones a proveedores.

**Ecommerce**: favoritos, reseñas, cupones, gift cards, productos relacionados, recuperación de carrito abandonado, WhatsApp, Mercado Pago, transferencia, pago al retirar, seguimiento de pedido, emails automáticos, SEO, analytics, Pixel de Meta.

**ERP**: ventas, clientes, caja, reportes, presupuestos, remitos, devoluciones, cuentas corrientes, roles, permisos, auditoría, importaciones masivas, backups.

**Plataforma SaaS**: planes, suscripciones, límites por plan, panel interno de NovaShop, gestión de comercios, dominio personalizado, white label, multimoneda, multiidioma, múltiples sucursales, facturación del servicio.

Nota: **Ventas, Caja y Reportes están explícitamente congelados** hasta terminar de migrar la infraestructura de los módulos existentes a Supabase (ver Architecture.md § Decisiones de arquitectura, punto 2).