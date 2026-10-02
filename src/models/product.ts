// Product data structure
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
}

// Temporary in-memory product storage
export const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 55000,
    category: "Electronics",
    stock: 10,
    description: "High-performance laptop",
  },
];

// ID generator
let nextId = 2;

export const generateProductId = (): number => {
  return nextId++;
};
