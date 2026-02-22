import React, { useState } from 'react';
import { productsAPI } from '../api';
import '../styles/form.css';

export default function ProductForm({ product, categories, onSaved }) {
  const [formData, setFormData] = useState(product || {
    sku: '',
    name: '',
    description: '',
    category_id: '',
    price: '',
    startup_price: '',
    weight: '',
    best_before_date: '',
    image_url: '',
    specs: {}
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [key]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (product?.id) {
        await productsAPI.update(product.id, formData);
      } else {
        await productsAPI.create(formData);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{product ? 'Edit Product' : 'New Product'}</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label>SKU *</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select name="category_id" value={formData.category_id} onChange={handleInputChange}>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" />
        </div>
        <div className="form-group">
          <label>Startup Price</label>
          <input type="number" name="startup_price" value={formData.startup_price} onChange={handleInputChange} step="0.01" />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Weight</label>
          <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} step="0.01" />
        </div>
        <div className="form-group">
          <label>Best Before Date</label>
          <input type="date" name="best_before_date" value={formData.best_before_date} onChange={handleInputChange} />
        </div>
      </div>

      <div className="form-group">
        <label>Image URL</label>
        <input type="url" name="image_url" value={formData.image_url} onChange={handleInputChange} />
      </div>

      <div className="form-group">
        <label>Additional Specs (Key-Value pairs)</label>
        <input
          type="text"
          placeholder="Spec name"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const key = e.target.value;
              if (key) handleSpecChange(key, '');
              e.target.value = '';
            }
          }}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}
