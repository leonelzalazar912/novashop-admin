export type UserRole =
  | "Propietario"
  | "Administrador"
  | "Empleado"
  | "Vendedor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export const initialUsers: User[] = [];