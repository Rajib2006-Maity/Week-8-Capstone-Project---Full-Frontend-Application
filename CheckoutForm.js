// src/components/Checkout/CheckoutForm.js
import React, { useState } from 'react';
import './Checkout.css';

const initialForm = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.address.trim()) errors.address = 'Address is required.';
  if (!form.city.trim()) errors.city = 'City is required.';

  if (!form.zip.trim()) {
    errors.zip = 'ZIP code is required.';
  } else if (!/^\d{4,10}$/.test(form.zip.trim())) {
    errors.zip = 'Enter a valid ZIP/postal code.';
  }

  if (!form.cardNumber.trim()) {
    errors.cardNumber = 'Card number is required.';
  } else if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s/g, ''))) {
    errors.cardNumber = 'Enter a valid card number (13-19 digits).';
  }

  if (!form.expiry.trim()) {
    errors.expiry = 'Expiry date is required.';
  } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry.trim())) {
    errors.expiry = 'Use MM/YY format.';
  }

  if (!form.cvv.trim()) {
    errors.cvv = 'CVV is required.';
  } else if (!/^\d{3,4}$/.test(form.cvv.trim())) {
    errors.cvv = 'Enter a valid CVV.';
  }

  return errors;
}

function CheckoutForm({ onSubmit, submitting }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate({ ...form }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    setTouched(
      Object.keys(initialForm).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(form);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <form className="checkout-form" onSubmit={handleSubmit} noValidate>
      <h3>Shipping Information</h3>

      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={showError('fullName') ? 'input-error' : ''}
        />
        {showError('fullName') && <span className="error-text">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={showError('email') ? 'input-error' : ''}
        />
        {showError('email') && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          onBlur={handleBlur}
          className={showError('address') ? 'input-error' : ''}
        />
        {showError('address') && <span className="error-text">{errors.address}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('city') ? 'input-error' : ''}
          />
          {showError('city') && <span className="error-text">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="zip">ZIP Code</label>
          <input
            id="zip"
            name="zip"
            value={form.zip}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('zip') ? 'input-error' : ''}
          />
          {showError('zip') && <span className="error-text">{errors.zip}</span>}
        </div>
      </div>

      <h3>Payment Details</h3>

      <div className="form-group">
        <label htmlFor="cardNumber">Card Number</label>
        <input
          id="cardNumber"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={form.cardNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          className={showError('cardNumber') ? 'input-error' : ''}
        />
        {showError('cardNumber') && <span className="error-text">{errors.cardNumber}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiry">Expiry (MM/YY)</label>
          <input
            id="expiry"
            name="expiry"
            placeholder="MM/YY"
            value={form.expiry}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('expiry') ? 'input-error' : ''}
          />
          {showError('expiry') && <span className="error-text">{errors.expiry}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            id="cvv"
            name="cvv"
            placeholder="123"
            value={form.cvv}
            onChange={handleChange}
            onBlur={handleBlur}
            className={showError('cvv') ? 'input-error' : ''}
          />
          {showError('cvv') && <span className="error-text">{errors.cvv}</span>}
        </div>
      </div>

      <button type="submit" className="place-order-btn" disabled={submitting}>
        {submitting ? 'Placing Order...' : 'Place Order'}
      </button>
    </form>
  );
}

export default CheckoutForm;
