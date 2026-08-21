// src/pages/CheckoutPage.js
import React, { useContext, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import CheckoutForm from '../components/Checkout/CheckoutForm';
import OrderReview from '../components/Checkout/OrderReview';
import { createOrder } from '../services/api';

function CheckoutPage() {
  const { items, totalPrice, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState(null);

  if (items.length === 0 && !orderComplete) {
    return <Navigate to="/cart" replace />;
  }

  const handlePlaceOrder = async (formData) => {
    setSubmitting(true);
    setOrderError(null);
    try {
      // Simulated order creation against FakeStoreAPI's carts endpoint.
      await createOrder(
        user?.username || 'guest',
        items.map((i) => ({ productId: i.id, quantity: i.quantity }))
      );
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      setOrderError('Something went wrong placing your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="order-success">
        <div className="checkmark">✓</div>
        <h2>Order Placed!</h2>
        <p>Thanks for shopping with ShopSphere. A confirmation has been logged to your account.</p>
        <Link to="/">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div>
        {orderError && <p className="checkout-error">⚠️ {orderError}</p>}
        <CheckoutForm onSubmit={handlePlaceOrder} submitting={submitting} />
      </div>
      <OrderReview items={items} totalPrice={totalPrice} />
    </div>
  );
}

export default CheckoutPage;
