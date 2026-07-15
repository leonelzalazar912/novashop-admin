export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  active: boolean;
};

export const initialClients: Client[] = [];