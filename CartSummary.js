// src/components/Cart/CartSummary.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Cart.css';

function CartSummary({ totalItems, totalPrice, showCheckoutButton = true }) {
  const shipping = totalPrice > 50 || totalPrice === 0 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>
      <div className="summary-row">
        <span>Items ({totalItems})</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <div className="summary-row">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
      </div>
      <div className="summary-row">
        <span>Estimated Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="summary-row summary-total">
        <span>Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>

      {showCheckoutButton && (
        <Link to="/checkout" className="checkout-btn">
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
}

export default CartSummary;
