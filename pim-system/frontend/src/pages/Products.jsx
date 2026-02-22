import React, { useState, useEffect } from 'react';
import { productsAPI, categoriesAPI } from '../api';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import '../styles/products.css';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchData();
  }, [search, selectedCategory, page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsAPI.getAll({ search, category: selectedCategory, page }),
        categoriesAPI.getAll()
      ]);
      setProducts(productsRes.data.products);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSaved = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchData();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsAPI.delete(productId);
        fetchData();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  return (
    <div className="products-container">
      <h1>Products</h1>

      <div className="controls">
        <button onClick={() => { setEditingProduct(null); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <ProductForm product={editingProduct} categories={categories} onSaved={handleProductSaved} />
      )}

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
