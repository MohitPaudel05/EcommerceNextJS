export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryIds: number[];       // for filtering
  categoryNames?: string[];
}