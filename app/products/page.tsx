"use client";

import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories } from "@/libs/api";
import { Product } from "@/libs/product";
import { Category } from "@/libs/category";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    categoryIds: [] as number[],
    image: null as File | null,
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || form.categoryIds.length === 0) {
      alert("Name, Price, and at least one Category are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price.toString());
    form.categoryIds.forEach((id) => formData.append("categoryIds", id.toString()));
    if (form.image) formData.append("image", form.image);

    try {
      if (editId) {
        await updateProduct(editId, formData);
        alert("Product updated!");
      } else {
        await createProduct(formData);
        alert("Product added!");
      }
      setForm({ name: "", description: "", price: 0, categoryIds: [], image: null });
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
      categoryIds: p.categoryIds ?? [],
      image: null,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      await deleteProduct(id);
      loadProducts();
    }
  };

  const toggleCategoryFilter = (category: string) => {
    setFilteredCategory(filteredCategory === category ? null : category);
  };

  const filteredProducts = filteredCategory
    ? products.filter((p) => p.categoryNames?.includes(filteredCategory))
    : products;

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Products</h1>

      {/* Category Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilteredCategory(null)}
          className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
            !filteredCategory ? "bg-blue-600 text-white shadow-lg" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => toggleCategoryFilter(c.name)}
            className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
              filteredCategory === c.name
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-white rounded shadow p-3">
            {p.imageUrl && <img src={`https://localhost:7017${p.imageUrl}`} alt={p.name} className="w-full h-40 object-cover mb-2" />}
            <h2 className="font-bold text-gray-900">{p.name}</h2>
            <p className="text-gray-700">{p.description}</p>
            <p className="font-semibold text-gray-900">${p.price}</p>
            <p className="text-sm text-black">{p.categoryNames?.join(", ")}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => handleEdit(p)} className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500">
                Edit
              </button>
              <button onClick={() => handleDelete(p.id!)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form */}
      <div className="bg-white p-6 rounded shadow max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">{editId ? "Edit Product" : "Add Product"}</h2>
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

          {/* Multi-category selection */}
          <div>
            {categories.map((c) => (
              <label key={c.id} className="inline-flex items-center mr-3">
                <input
                  type="checkbox"
                  value={c.id}
                  checked={form.categoryIds.includes(c.id)}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      categoryIds: prev.categoryIds.includes(id)
                        ? prev.categoryIds.filter((cid) => cid !== id)
                        : [...prev.categoryIds, id],
                    }));
                  }}
                  className="mr-1"
                />
                <span className="text-black">{c.name}</span>
              </label>
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded text-black"
            onChange={(e) => setForm({ ...form, image: e.target.files![0] })}
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
