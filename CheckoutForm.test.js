// src/components/Checkout/CheckoutForm.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CheckoutForm from './CheckoutForm';

test('shows validation errors when submitting an empty form', () => {
  const handleSubmit = jest.fn();
  render(<CheckoutForm onSubmit={handleSubmit} submitting={false} />);

  fireEvent.click(screen.getByText('Place Order'));

  expect(screen.getByText('Full name is required.')).toBeInTheDocument();
  expect(screen.getByText('Email is required.')).toBeInTheDocument();
  expect(handleSubmit).not.toHaveBeenCalled();
});

test('flags an invalid email format', () => {
  const handleSubmit = jest.fn();
  render(<CheckoutForm onSubmit={handleSubmit} submitting={false} />);

  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'not-an-email' },
  });
  fireEvent.click(screen.getByText('Place Order'));

  expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
  expect(handleSubmit).not.toHaveBeenCalled();
});

test('calls onSubmit with form data when all fields are valid', () => {
  const handleSubmit = jest.fn();
  render(<CheckoutForm onSubmit={handleSubmit} submitting={false} />);

  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Jane Doe' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jane@example.com' } });
  fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
  fireEvent.change(screen.getByLabelText('City'), { target: { value: 'Springfield' } });
  fireEvent.change(screen.getByLabelText('ZIP Code'), { target: { value: '12345' } });
  fireEvent.change(screen.getByLabelText('Card Number'), {
    target: { value: '4111111111111111' },
  });
  fireEvent.change(screen.getByLabelText('Expiry (MM/YY)'), { target: { value: '12/28' } });
  fireEvent.change(screen.getByLabelText('CVV'), { target: { value: '123' } });

  fireEvent.click(screen.getByText('Place Order'));

  expect(handleSubmit).toHaveBeenCalledTimes(1);
  expect(handleSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ fullName: 'Jane Doe', email: 'jane@example.com' })
  );
});
