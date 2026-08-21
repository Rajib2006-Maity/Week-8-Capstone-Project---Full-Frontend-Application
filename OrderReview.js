// src/components/Checkout/OrderReview.js
import React from 'react';
import './Checkout.css';

function OrderReview({ items, totalPrice }) {
  const shipping = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const grandTotal = totalPrice + shipping + tax;

  return (
    <div className="checkout-order-review">
      <h3>Order Review</h3>
      {items.map((item) => (
        <div className="review-item" key={item.id}>
          <span>
            {item.title.length > 30 ? `${item.title.slice(0, 30)}…` : item.title} ×{' '}
            {item.quantity}
          </span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="review-item">
        <span>Shipping</span>
        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
      </div>
      <div className="review-item">
        <span>Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="review-item" style={{ fontWeight: 700, color: '#1a1a2e', fontSize: '1rem' }}>
        <span>Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default OrderReview;
