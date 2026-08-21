// src/components/ProductCard/ProductCard.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';
import { CartProvider } from '../../contexts/CartContext';

const mockProduct = {
  id: 1,
  title: 'Wireless Headphones',
  price: 49.99,
  category: 'electronics',
  image: 'headphones.jpg',
  rating: { rate: 4.2, count: 87 },
};

function renderCard() {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

test('renders product title, price, and category', () => {
  renderCard();
  expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  expect(screen.getByText('$49.99')).toBeInTheDocument();
  expect(screen.getByText('electronics')).toBeInTheDocument();
});

test('clicking Add to Cart shows a brief adding state, then confirms', async () => {
  renderCard();
  const button = screen.getByText('Add to Cart');
  fireEvent.click(button);

  expect(screen.getByText('Adding...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Added ✓')).toBeInTheDocument();
  });
});

test('links to the correct product detail route', () => {
  renderCard();
  const link = screen.getByText('Wireless Headphones').closest('a');
  expect(link).toHaveAttribute('href', '/product/1');
});
