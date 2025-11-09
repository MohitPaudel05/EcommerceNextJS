"use client";

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "@/libs/api";
import { Product } from "@/libs/product";
import { Category } from "@/libs/category";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    image: null as File | null,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Load products
  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  // Load categories
  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || (!form.image && !editId)) {
      alert("Name and Image are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price.toString());
    formData.append("categoryId", form.categoryId);
    if (form.image) formData.append("image", form.image);

    try {
      if (editId) {
        await updateProduct(editId, formData);
        alert("Product updated!");
      } else {
        await createProduct(formData);
        alert("Product added!");
      }

      setForm({ name: "", description: "", price: 0, categoryId: "", image: null });
      setEditId(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Error saving product");
    }
  };

  const handleEdit = (p: Product) => {
    setEditId(p.id!);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      categoryId: p.categoryId.toString(),
      image: null,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Products</h1>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded shadow p-3">
            {p.imageUrl && (
              <img
                src={`https://localhost:7017${p.imageUrl}`}
                alt={p.name}
                className="w-full h-40 object-cover mb-2"
              />
            )}
            <h2 className="font-bold text-gray-900">{p.name}</h2>
            <p className="text-gray-700">{p.description}</p>
            <p className="font-semibold text-gray-900">${p.price}</p>
            <p className="text-sm text-gray-500">{p.categoryName}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id!)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          {editId ? "Edit Product" : "Add Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border rounded text-black"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full p-2 border rounded text-black"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 border rounded text-black"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <select
            className="w-full p-2 border rounded text-black"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={(e) => setForm({ ...form, image: e.target.files![0] })}
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
