import type { DashboardCard } from "../types/dashboard";

interface DashboardSettingsModalProps {
  cards: Pick<DashboardCard, "id" | "title" | "icon">[];
  visibleCards: string[];
  onToggleCard: (id: string) => void;
  onClose: () => void;
}

export function DashboardSettingsModal({
  cards,
  visibleCards,
  onToggleCard,
  onClose,
}: DashboardSettingsModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Personalizar dashboard</h2>

        {cards.map((card) => (
          <label key={card.id} className="checkbox-item">
            <input
              type="checkbox"
              checked={visibleCards.includes(card.id)}
              onChange={() => onToggleCard(card.id)}
            />
            {card.icon} {card.title}
          </label>
        ))}

        <button className="primary-button" onClick={onClose}>
          Listo
        </button>
      </div>
    </div>
  );
}