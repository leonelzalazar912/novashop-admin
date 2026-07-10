export type UserRole =
  | "Administrador"
  | "Empleado"
  | "Vendedor";

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  active: boolean;
}

export const initialUsers: User[] = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@novashop.com",
    username: "admin",
    role: "Administrador",
    active: true,
  },
  {
    id: 2,
    name: "Juan Pérez",
    email: "juan@novashop.com",
    username: "jperez",
    role: "Vendedor",
    active: true,
  },
  {
    id: 3,
    name: "María Gómez",
    email: "maria@novashop.com",
    username: "mgomez",
    role: "Empleado",
    active: false,
  },
];