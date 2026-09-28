export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    price: 55000,
    category: "Electronics",
    stock: 10,
    description: "Laptop for students",
  },
  {
    id: 2,
    name: "Headphones",
    price: 2000,
    category: "Electronics",
    stock: 25,
    description: "Wireless headphones",
  },
];