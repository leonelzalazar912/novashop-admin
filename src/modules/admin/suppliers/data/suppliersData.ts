export type SupplierType =
  | "Mayorista"
  | "Distribuidor"
  | "Fabricante"
  | "Importador";

export type Supplier = {
  id: number;
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

export const initialSuppliers: Supplier[] = [
  {
    id: 1,
    company: "Distribuidora Norte",
    contact: "Ana López",
    email: "ana@distribuidoranorte.com",
    phone: "3815551111",
    address: "Av. Sarmiento 123",
    city: "San Miguel de Tucumán",
    province: "Tucumán",
    cuit: "30-71234567-8",
    website: "https://www.distribuidoranorte.com",
    notes: "Proveedor principal de electrónica.",
    type: "Mayorista",
    active: true,
  },
  {
    id: 2,
    company: "TecnoMayorista",
    contact: "Luis Gómez",
    email: "luis@tecnomayorista.com",
    phone: "3815552222",
    address: "San Martín 850",
    city: "Yerba Buena",
    province: "Tucumán",
    cuit: "30-74567891-2",
    website: "https://www.tecnomayorista.com",
    notes: "Especializado en accesorios.",
    type: "Distribuidor",
    active: true,
  },
  {
    id: 3,
    company: "Importadora del Sur",
    contact: "Carla Medina",
    email: "carla@importsur.com",
    phone: "3815553333",
    address: "Belgrano 450",
    city: "Córdoba",
    province: "Córdoba",
    cuit: "30-70123456-9",
    website: "https://www.importsur.com",
    notes: "Importación de productos tecnológicos.",
    type: "Importador",
    active: false,
  },
];