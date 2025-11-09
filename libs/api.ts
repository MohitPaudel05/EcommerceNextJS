import axios from "axios";
import { Product } from "./product";
import { Category } from "./category";

const PRODUCT_API_URL = "https://localhost:7017/api/products";
const CATEGORY_API_URL = "https://localhost:7017/api/categories";

// Products
export const getProducts = async (): Promise<Product[]> => {
  const res = await axios.get(PRODUCT_API_URL);
  return res.data;
};

export const createProduct = async (formData: FormData): Promise<Product> => {
  const res = await axios.post(PRODUCT_API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateProduct = async (id: number, formData: FormData): Promise<Product> => {
  const res = await axios.put(`${PRODUCT_API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteProduct = async (id: number) => {
  const res = await axios.delete(`${PRODUCT_API_URL}/${id}`);
  return res.data;
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const res = await axios.get(CATEGORY_API_URL);
  return res.data;
};
