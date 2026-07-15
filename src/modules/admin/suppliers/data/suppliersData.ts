export type SupplierType =
  | "Mayorista"
  | "Distribuidor"
  | "Fabricante"
  | "Importador";

export type Supplier = {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  cuit: string;
  website: string;
  notes: string;
  type: SupplierType;
  active: boolean;
};

export const initialSuppliers: Supplier[] = [];