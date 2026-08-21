// src/pages/Home.js
import React from 'react';
import ProductList from '../components/ProductList/ProductList';
import useProducts from '../hooks/useProducts';

function Home() {
  const {
    products,
    categories,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    searchTerm,
    setSearchTerm,
    refetch,
  } = useProducts();

  return (
    <div>
      <header className="hero">
        <h1>Discover Products You'll Love</h1>
        <p>Curated goods across electronics, fashion, and more.</p>
      </header>

      <ProductList
        products={products}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
}

export default Home;
