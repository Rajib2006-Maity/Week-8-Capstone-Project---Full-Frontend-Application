// src/contexts/CartContext.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartProvider, CartContext } from './CartContext';

// Small test harness that exposes cart state/actions via the DOM so we can
// assert on them without reaching into implementation details.
function TestHarness() {
  return (
    <CartContext.Consumer>
      {({ items, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity }) => (
        <div>
          <span data-testid="total-items">{totalItems}</span>
          <span data-testid="total-price">{totalPrice.toFixed(2)}</span>
          <span data-testid="item-count">{items.length}</span>
          <button onClick={() => addToCart({ id: 1, title: 'Mug', price: 10, image: 'x.jpg' })}>
            Add Mug
          </button>
          <button onClick={() => removeFromCart(1)}>Remove Mug</button>
          <button
            onClick={() =>
              updateQuantity(1, (items.find((i) => i.id === 1)?.quantity || 0) + 1)
            }
          >
            Increase Mug
          </button>
        </div>
      )}
    </CartContext.Consumer>
  );
}

function renderWithCart() {
  return render(
    <CartProvider>
      <TestHarness />
    </CartProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

test('starts with an empty cart', () => {
  renderWithCart();
  expect(screen.getByTestId('total-items')).toHaveTextContent('0');
  expect(screen.getByTestId('total-price')).toHaveTextContent('0.00');
});

test('adding an item increases total items and total price', async () => {
  renderWithCart();
  fireEvent.click(screen.getByText('Add Mug'));

  await waitFor(() => {
    expect(screen.getByTestId('total-items')).toHaveTextContent('1');
  });
  expect(screen.getByTestId('total-price')).toHaveTextContent('10.00');
});

test('adding the same item twice increments quantity instead of duplicating', async () => {
  renderWithCart();
  fireEvent.click(screen.getByText('Add Mug'));
  fireEvent.click(screen.getByText('Add Mug'));

  await waitFor(() => {
    expect(screen.getByTestId('total-items')).toHaveTextContent('2');
  });
  expect(screen.getByTestId('item-count')).toHaveTextContent('1');
  expect(screen.getByTestId('total-price')).toHaveTextContent('20.00');
});

test('removing an item clears it from the cart', async () => {
  renderWithCart();
  fireEvent.click(screen.getByText('Add Mug'));
  await waitFor(() => expect(screen.getByTestId('total-items')).toHaveTextContent('1'));

  fireEvent.click(screen.getByText('Remove Mug'));
  expect(screen.getByTestId('total-items')).toHaveTextContent('0');
  expect(screen.getByTestId('item-count')).toHaveTextContent('0');
});

test('cart persists to localStorage', async () => {
  renderWithCart();
  fireEvent.click(screen.getByText('Add Mug'));

  await waitFor(() => {
    const stored = JSON.parse(window.localStorage.getItem('shopsphere_cart'));
    expect(stored.items).toHaveLength(1);
    expect(stored.items[0].title).toBe('Mug');
  });
});
