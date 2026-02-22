import React from 'react';
import '../styles/list.css';

export default function ProductList({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return <p className="empty-message">No products found.</p>;
  }

  return (
    <div className="products-list">
      {products.map(product => (
        <div key={product.id} className="product-card">
          {product.image_url && <img src={product.image_url} alt={product.name} />}
          <div className="product-info">
            <h3>{product.name}</h3>
            <p className="sku">SKU: {product.sku}</p>
            {product.description && <p>{product.description.substring(0, 100)}...</p>}
            {product.price && <p className="price">Price: ${parseFloat(product.price).toFixed(2)}</p>}
            {product.weight && <p>Weight: {product.weight}g</p>}
            {product.best_before_date && <p>Best Before: {product.best_before_date}</p>}
          </div>
          <div className="product-actions">
            <button className="edit-btn" onClick={() => onEdit(product)}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete(product.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
