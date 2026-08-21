// src/services/api.js
// Centralized service layer for all external API calls.
// Uses FakeStoreAPI (https://fakestoreapi.com) as the product data source.

const BASE_URL = 'https://fakestoreapi.com';

/**
 * Generic fetch wrapper with error handling.
 */
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Request failed for ${endpoint}:`, error);
    throw error;
  }
}

// ---- Products ----

export function getAllProducts() {
  return request('/products');
}

export function getProductById(id) {
  return request(`/products/${id}`);
}

export function getProductsByCategory(category) {
  return request(`/products/category/${encodeURIComponent(category)}`);
}

export function getAllCategories() {
  return request('/products/categories');
}

export function getLimitedProducts(limit = 10) {
  return request(`/products?limit=${limit}`);
}

export function getSortedProducts(sortOrder = 'asc') {
  return request(`/products?sort=${sortOrder}`);
}

// ---- Simulated Auth (FakeStoreAPI supports a login endpoint) ----

export function loginUser(username, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ---- Simulated Orders (FakeStoreAPI "carts" endpoint stands in for orders) ----

export function createOrder(userId, products) {
  return request('/carts', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      date: new Date().toISOString(),
      products,
    }),
  });
}

const api = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  getAllCategories,
  getLimitedProducts,
  getSortedProducts,
  loginUser,
  createOrder,
};

export default api;
