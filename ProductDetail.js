// src/pages/ProductDetail.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { CartContext } from '../contexts/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    getProductById(id)
      .then((data) => {
        if (isMounted) setProduct(data);
      })
      .catch(() => {
        if (isMounted) setError('Could not load this product. It may no longer exist.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity,
    });
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (loading) {
    return <div className="page-loading">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="page-error">
        <p>⚠️ {error || 'Product not found.'}</p>
        <Link to="/">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <Link to="/" className="back-link">
        ← Back to products
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.image} alt={product.title} />
        </div>

        <div className="product-detail-info">
          <p className="product-category">{product.category}</p>
          <h1>{product.title}</h1>

          <div className="product-rating">
            {'★'.repeat(Math.round(product.rating?.rate || 0))}
            {'☆'.repeat(5 - Math.round(product.rating?.rate || 0))}
            <span>
              {product.rating?.rate} ({product.rating?.count} reviews)
            </span>
          </div>

          <p className="product-detail-price">${product.price.toFixed(2)}</p>
          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-actions">
            <div className="quantity-selector">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>+</button>
            </div>

            <button
              className={`add-to-cart-btn large ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={adding}
            >
              {adding ? 'Adding...' : added ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
