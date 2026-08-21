// src/components/ProductCard/ProductCard.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
    });

    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image">
          <img src={product.image} alt={product.title} loading="lazy" />
        </div>

        <div className="product-info">
          <p className="product-category">{product.category}</p>
          <h3 className="product-title">{product.title}</h3>
          <div className="product-rating">
            {'★'.repeat(Math.round(product.rating?.rate || 0))}
            {'☆'.repeat(5 - Math.round(product.rating?.rate || 0))}
            <span>({product.rating?.count || 0})</span>
          </div>
        </div>
      </Link>

      <div className="product-footer">
        <span className="product-price">${product.price.toFixed(2)}</span>
        <button
          className={`add-to-cart-btn ${isAdding ? 'adding' : ''} ${justAdded ? 'added' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? 'Adding...' : justAdded ? 'Added ✓' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
