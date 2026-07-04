import type { DashboardAlert } from "../types/dashboard";
interface NotificationPanelProps {
  alerts: DashboardAlert[];
  onActionClick?: () => void;
}

export function NotificationPanel({
  alerts,
  onActionClick,
}: NotificationPanelProps) {
  if (alerts.length === 0) {
    return null;
  }

const icons = {
  success: "🟢",
  warning: "🟡",
  danger: "🔴",
};

  return (
    <div className="notification-panel">
      {alerts.map((alert, index) => (
        <div
          key={index}
          className={`notification-card notification-${alert.type}`}
        >
          <h4>
            {icons[alert.type]} {alert.title}
          </h4>

            <p>{alert.description}</p>

            {alert.action && (
            <button
  className="notification-action"
  onClick={onActionClick}
>
  {alert.action}
</button>
        )}
        </div>
      ))}
    </div>
  );
}