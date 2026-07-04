interface DashboardToolbarProps {
  onCustomize: () => void;
}

export function DashboardToolbar({ onCustomize }: DashboardToolbarProps) {
  return (
    <button className="primary-button" onClick={onCustomize}>
      ⚙️ Personalizar dashboard
    </button>
  );
}