import { DashboardSection } from "./DashboardSection";

const lowStockProducts = [
  { name: "God of War Ragnarok", stock: 3 },
  { name: "EA Sports FC 25", stock: 5 },
  { name: "Mortal Kombat 1", stock: 2 },
];

export function LowStockProducts() {
  return (
    <DashboardSection title="Productos con poco stock">

      {lowStockProducts.map((product) => (
        <div key={product.name} className="order-item">
          <div>
            <strong>{product.name}</strong>
            <p>Stock disponible</p>
          </div>

          <span>{product.stock} unidades</span>
        </div>
      ))}
    </DashboardSection>
  );
}