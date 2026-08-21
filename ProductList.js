// src/components/ProductList/ProductList.js
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

function ProductList({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  searchTerm,
  setSearchTerm,
  loading,
  error,
  onRetry,
}) {
  if (error) {
    return (
      <div className="product-list-error">
        <p>⚠️ {error}</p>
        <button onClick={onRetry}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="product-list-wrapper">
      <div className="product-controls">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-skeleton" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="no-results">No products match your search.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
