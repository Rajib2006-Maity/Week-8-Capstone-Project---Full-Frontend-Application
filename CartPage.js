// src/pages/CartPage.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import CartItem from '../components/Cart/CartItem';
import CartSummary from '../components/Cart/CartSummary';

function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useContext(CartContext);

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/" className="checkout-btn" style={{ display: 'inline-block', maxWidth: 220 }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h2>Your Cart ({totalItems} items)</h2>
        <button className="clear-cart-btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-page-grid">
        <div className="cart-items-list">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
      </div>
    </div>
  );
}

export default CartPage;
