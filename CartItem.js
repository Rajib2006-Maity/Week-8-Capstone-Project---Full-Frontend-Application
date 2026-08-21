// src/components/Cart/CartItem.js
import React, { useContext } from 'react';
import { CartContext } from '../../contexts/CartContext';
import './Cart.css';

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} className="cart-item-image" />

      <div className="cart-item-details">
        <h4>{item.title}</h4>
        <p className="cart-item-price">${item.price.toFixed(2)} each</p>
      </div>

      <div className="cart-item-quantity">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)}</div>

      <button
        className="cart-item-remove"
        onClick={() => removeFromCart(item.id)}
        aria-label="Remove item"
      >
        🗑
      </button>
    </div>
  );
}

export default CartItem;
