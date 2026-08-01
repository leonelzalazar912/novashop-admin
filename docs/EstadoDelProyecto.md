# Estado del Proyecto — NovaShop

> **Foto fechada: 31/07/2026.** Este documento es un informe puntual generado en esa fecha, basado en `Architecture.md`, `ProductVision.md`, `NovaShop_Contexto.txt` y `bitacora-desarrollo.txt` vigentes en ese momento, más verificación directa del código. No se actualiza solo — es una instantánea, no una fuente de verdad viva. Para el estado técnico actual, siempre confiar primero en `Architecture.md` y la bitácora; volver a generar un informe como este si hace falta otra foto más adelante, no editar este archivo para que "seas cierto" en el futuro.

## 1. Resumen ejecutivo

NovaShop tiene un **núcleo transaccional real y sólido para una sola tienda**: catálogo, carrito, checkout atómico y pago con Mercado Pago funcionan de punta a punta contra datos reales en Supabase, con buena integridad (RLS, transacciones, validación server-side). Lo que falta no es "conectar mock a base real" — eso ya se hizo — sino profundidad funcional en varias áreas (post-venta, inventario avanzado, permisos), **cero automatización de calidad** (sin tests, sin CI) y, sobre todo, casi todo el trabajo de convertirlo de "una tienda funcionando" a "una plataforma que se vende a terceros".

## 2. Por área funcional

| Área | % |
|---|---|
| Catálogo público (storefront) | **60%** |
| Carrito y checkout | **70%** |
| Pagos (Mercado Pago) | **65%** |
| Panel de administración (productos/categorías/marcas/clientes/proveedores) | **80%** |
| Pedidos y gestión post-venta | **45%** |
| Compras e inventario | **60%** |
| Usuarios y roles/permisos | **55%** |
| Infraestructura y base de datos | **70%** |
| Calidad de código (tipos, build, testing) | **30%** |

### Catálogo público — 60%
Conectado a Supabase real (no mock desde el 29/07), resuelve tienda por `slug`, RLS pública correcta, `metadata jsonb` genérico por rubro (no atado a gaming). Funciona: home, categorías, buscador, filtros, detalle, destacados. Falta buena parte del backlog de ecommerce que un catálogo "vendible" necesita: favoritos, reseñas, cupones, gift cards, productos relacionados, recuperación de carrito abandonado, SEO, analytics, Pixel de Meta — ninguno existe. Tampoco hay "mi cuenta → mis pedidos" en el storefront (verificado: `ProfileScreen.tsx` no muestra historial de compras), a pesar de que Supabase Auth ya está integrado.

### Carrito y checkout — 70%
El corazón transaccional es lo mejor construido del proyecto: `checkout_create_order` es una función Postgres atómica con `SELECT FOR UPDATE` (evita sobreventa), recalcula precio server-side (nunca confía en el cliente), y todo o nada. Carrito con tope real de stock. Lo que falta es el "envoltorio comercial": costo de envío hardcodeado en "Gratis" (no hay integración con ningún correo/tarifa real), el carrito vive solo en memoria de React (se pierde al refrescar, no hay recuperación de abandonado), y el checkout es exclusivamente de invitado — no aprovecha que ya existe login de cliente.

### Pagos (Mercado Pago) — 65%
Validado de punta a punta esta semana: Payment Brick resuelve `payment_method_id`/`issuer_id` automáticamente, pago aprobado y rechazado con reintento sobre la misma orden sin duplicar nada, webhook con validación de firma real. Es un trabajo técnicamente bien hecho. Pero como "área de pagos" completa: no hay reembolsos/devoluciones de pago, el método "Mercado Pago" (QR) que se ve en la UI es decorativo y no está conectado a nada, y las credenciales son un secreto único de una sola tienda — no hay ningún mecanismo para que un segundo comercio use su propia cuenta de MP (bloqueante duro para el modelo SaaS, ver sección 4).

### Panel de administración (productos, categorías, marcas, clientes, proveedores) — 80%
La parte más madura del proyecto. Todos migrados a Supabase real con patrón consistente (hook → Supabase, mapeo DB↔dominio, estados de carga/error en español), multi-tenant por `store_id` en todas las queries, integridad de borrado con patrón híbrido (cascada vs. bloqueo), imágenes reales en Storage, activar/desactivar como alternativa al borrado, publicado/borrador editable. Categorías y Marcas son más simples pero funcionales. Lo que resta: la duplicación conocida entre `use<Feature>.ts` y `use<Feature>Data.ts`, y que solo `users`/`catalog`/`checkout` siguen la capa de servicios formal (el resto llama a Supabase directo desde el hook).

### Pedidos y gestión post-venta — 45%
El admin puede ver pedidos y cambiar `status`/`fulfillment_status` (preparing/shipped/delivered/cancelled) — confirmado en el código. Pero el ciclo post-venta real está incompleto: **cancelar o borrar una orden no revierte el stock descontado** (bug conocido, documentado, no resuelto), no hay devoluciones/reembolsos, `shipments` tiene campos de texto libre (`carrier`, `tracking_number`) sin integración real con ningún correo, no hay notificaciones automáticas al cliente sobre el estado de su pedido, y el cliente no puede ver el estado de su propio pedido desde el storefront.

### Compras e inventario — 60%
Compras tiene buena profundidad: proveedor real por FK (ya no texto), numeración, ítems, costo, y **confirmado en el código que la exportación a PDF/impresión sigue existiendo** (`PurchaseDetailModal.tsx`, `window.print()`). El modelo de inventario soporta múltiples depósitos (`inventory_locations`) y auditoría (`stock_movements`), pero en la práctica el checkout siempre usa "el depósito activo" — no hay UI para transferencias entre depósitos, recepciones parciales, cuenta corriente de proveedor ni pagos parciales de compra (todo backlog sin empezar). Y el mismo bug de no revertir stock al cancelar aplica acá.

### Usuarios y roles/permisos — 55%
El módulo de usuarios en sí está muy bien hecho: Edge Function completa (`invite`/`update`/`remove`), protección del último Owner y último Admin, ocultamiento visual y de backend por rol, probado exhaustivamente (documentado sesión por sesión). Pero **"roles y permisos" como sistema configurable no existe** — verificado que no hay tablas `permissions`/`role_permissions` en el schema real, solo 4 roles fijos (`owner/admin/employee/seller`) hardcodeados en `bootstrap_new_store()`, con autorización binaria (admin-o-no) en el código de cada Edge Function/policy. No se puede crear un rol nuevo ni asignar permisos finos por módulo — el "modelo conceptual preliminar" original preveía esto y no se construyó.

### Infraestructura y base de datos — 70%
Modelo multi-tenant por `store_id` consistente desde el diseño, RLS activado en las 25 tablas, patrones de seguridad correctos (service role nunca en frontend, funciones `SECURITY DEFINER` bien acotadas). El schema completo está versionado (`schema_dump.sql`) y **recién auditado contra la base real esta semana — coincide al 100%** (120 constraints, 61 índices, 6 funciones, 19 triggers). El punto débil es el proceso operativo: no hay migraciones versionadas reales (todo se ejecuta a mano por SQL Editor, sin Docker para generar migraciones formales), no hay ambiente de staging separado del "desarrollo" (que en la práctica es el único ambiente que existe), y no hay backups documentados.

### Calidad de código (tipos, build, testing) — 30%
TypeScript `strict: true` recién desde el 29/07 (antes no había ni `tsconfig.json`), el build tipa limpio. Pero **verificado directamente que no existe ningún test** (ni unitario, ni de integración, ni end-to-end — cero archivos `.test.*`/`.spec.*`, ninguna librería de testing instalada), **no hay ESLint configurado**, y **no hay CI/CD** (no hay carpeta `.github/workflows`, ningún pipeline). Toda la verificación de features depende de pruebas manuales guiadas paso a paso en el navegador. Para un producto que se pretende vender a terceros, esta es la brecha más seria de las nueve áreas — no porque el código sea malo, sino porque no hay ninguna red que detecte una regresión antes de que la vea un cliente real.

## 3. Deuda técnica priorizada

**Impacto alto**
1. **Cero tests automatizados y sin CI.** Cualquier cambio se valida a mano, sesión por sesión. No escala y no da ninguna garantía antes de un release real.
2. **Cancelar o borrar una orden no revierte el stock descontado.** Corrompe el dato de inventario con el uso normal del día a día del admin, no es un caso extremo.
3. **Credenciales de Mercado Pago son un secreto único de una sola tienda.** Bloqueante duro para vender a un segundo cliente tal cual está hoy.
4. **No hay ambiente de staging.** Todo cambio de backend se prueba directo contra la única base que existe.

**Impacto medio**
5. Roles/permisos fijos y no configurables (4 roles hardcodeados, sin tabla de permisos).
6. Dashboard admin con `dashboardStats`/`recentOrders` mock (verificado en `dashboardData.ts`), no calculados desde Supabase.
7. No hay cálculo real de envío (shipping hardcodeado en "Gratis" en toda la UI).
8. Cliente storefront no ve el historial/estado de sus propios pedidos.
9. Duplicación de hooks admin (`use<Feature>.ts` vs `use<Feature>Data.ts`) y solo 3 de ~9 módulos siguen la capa de servicios formal.
10. Bundle >500kB sin `import()` dinámico.
11. Atomicidad del borrado de productos no garantizada del lado cliente (riesgo bajo, aceptado conscientemente).

**Impacto bajo**
12. No hay ESLint configurado.
13. Alias `@/` configurado pero no usado en ningún import.
14. Export huérfano en `src/config/categories.ts`.
15. Método "Mercado Pago" (QR) en el checkout es decorativo, no funcional — puede confundir a un usuario final que lo elija creyendo que va a pagar.

## 4. Qué falta para ser vendible a terceros (visión SaaS)

Acá la brecha es la más grande de todo el informe. El modelo de datos **sí** se diseñó pensando en esto desde el día 1 (`store_id` en cada tabla, RLS por tienda, `bootstrap_new_store()` ya crea roles/settings para una tienda nueva) — eso es una base genuinamente buena. Pero casi ninguna pieza de la *experiencia* multi-tenant existe todavía:

- **Sin onboarding self-service**: la policy `stores_insert_owner` existe a nivel de base, pero no hay ninguna pantalla donde un comercio nuevo se registre y cree su propia tienda. Hoy la única tienda (`novashop-demo`) se configuró a mano.
- **Sin resolución por dominio**: el storefront resuelve la tienda por un `storeConfig.storeSlug` fijo en el código — cambiar de tienda hoy significa editar y redeployar, no elegir un dominio.
- **Credenciales de pago por tienda**: no existe ningún mecanismo para que cada comercio cargue su propio Access Token de Mercado Pago (hoy es un secreto global de Supabase).
- **Sin planes/suscripciones/límites**: no hay tablas, lógica ni facturación del servicio a los comercios — toda la sección "Plataforma SaaS" del backlog (`ProductVision.md`) está sin empezar.
- **Sin panel interno de NovaShop**: nada para que el dueño de NovaShop administre los comercios clientes, vea qué tienda está en qué plan, o gestione dominios/white-label.
- **Personalización es "config as code", no self-service**: `config/*.ts` centraliza branding/colores/textos, pero cambiarlos requiere tocar código y redeployar, no un panel de configuración por comercio (aunque `store_settings` ya existe en la base con varias de esas columnas, listo para ese uso).
- **Sin multi-idioma/multi-moneda**: `ARS` está hardcodeado en varios lugares.
- **Sin tests/CI**: mencionado arriba, pero pesa doble acá — vender a terceros implica que un bug afecta la reputación comercial de NovaShop, no solo un experimento propio.

En síntesis: la **arquitectura de datos** está preparada para multi-tenant, pero el **producto** multi-tenant (onboarding, billing, panel interno, credenciales por tienda, dominio propio) prácticamente no existe todavía.

## 5. Completitud global estimada: ~55%

Cálculo con pesos explícitos (reflejan importancia relativa para tener *una tienda funcionando de verdad*, no la visión SaaS — esa se evalúa aparte en la sección 4, a propósito, porque son preguntas distintas):

| Área | Peso | % | Aporte |
|---|---|---|---|
| Catálogo público | 15% | 60% | 9.0 |
| Carrito y checkout | 10% | 70% | 7.0 |
| Pagos | 10% | 65% | 6.5 |
| Panel de administración | 15% | 80% | 12.0 |
| Pedidos y post-venta | 10% | 45% | 4.5 |
| Compras e inventario | 10% | 60% | 6.0 |
| Usuarios y roles/permisos | 10% | 55% | 5.5 |
| Infraestructura y BD | 10% | 70% | 7.0 |
| Calidad de código | 10% | 30% | 3.0 |
| **Total** | **100%** | | **60.5% ≈ 60%** |

Ajustado a la baja, a **~55%**, por dos motivos que la tabla no captura bien por sí sola: (1) la ausencia total de tests/CI es un riesgo estructural que no se refleja proporcionalmente en un solo 10% de peso — afecta la confiabilidad de *todas* las demás áreas; (2) el peso de "Panel de administración" (80%, el más alto) está midiendo CRUDs bien hechos, no necesariamente las partes más críticas para vender el producto como servicio.

**Importante**: este ~55% mide "¿funciona como tienda online real para un solo comercio?" — en esa pregunta puntual, NovaShop está bastante más avanzado que en la pregunta "¿es un producto SaaS vendible a terceros hoy?", que ronda el **15-20%** (solo el modelo de datos multi-tenant existe; el producto multi-tenant, no).
