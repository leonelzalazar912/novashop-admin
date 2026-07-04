import { StatCard } from "./StatCard";

type DashboardCard = {
  id: string;
  title: string;
  value: string;
  icon: string;
  color: string;
};

interface DashboardStatsProps {
  cards: DashboardCard[];
  visibleCards: string[];
}

export function DashboardStats({ cards, visibleCards }: DashboardStatsProps) {
  return (
    <div className="stats-grid">
      {cards
        .filter((card) => visibleCards.includes(card.id))
        .map((card) => (
          <StatCard
            key={card.id}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
          />
        ))}
    </div>
  );
}