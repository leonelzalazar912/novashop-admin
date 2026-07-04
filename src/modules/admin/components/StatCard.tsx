interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon" style={{ color }}>
        {icon}
      </div>

      <h3>{title}</h3>
      <strong>{value}</strong>
    </div>
  );
}