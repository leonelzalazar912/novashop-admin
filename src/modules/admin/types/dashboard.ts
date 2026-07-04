export type DashboardCard = {
  id: string;
  title: string;
  value: string;
  icon: string;
  color: string;
};

export type DashboardAlert = {
  type: "success" | "warning" | "danger";
  title: string;
  description: string;
  action?: string;
};