import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="chart-card">
      <h3>{title}</h3>

      <div className="chart-content">
        {children}
      </div>
    </div>
  );
}