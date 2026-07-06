export type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  active: boolean;
};

export const initialClients: Client[] = [
  {
    id: 1,
    name: "María González",
    email: "maria@email.com",
    phone: "3815551234",
    city: "San Miguel de Tucumán",
    active: true,
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos@email.com",
    phone: "3815555678",
    city: "Yerba Buena",
    active: true,
  },
  {
    id: 3,
    name: "Lucía Fernández",
    email: "lucia@email.com",
    phone: "3815559012",
    city: "Tafí Viejo",
    active: false,
  },
];