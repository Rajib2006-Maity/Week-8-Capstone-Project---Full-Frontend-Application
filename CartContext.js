// src/contexts/CartContext.js
// Global cart state via Context API + useReducer, persisted to Local Storage.

import React, { createContext, useReducer, useEffect, useMemo } from 'react';

export const CartContext = createContext(null);

const STORAGE_KEY = 'shopsphere_cart';

const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  HYDRATE: 'HYDRATE',
};

function loadInitialState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.HYDRATE:
      return action.payload;

    case ACTIONS.ADD_ITEM: {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }],
      };
    }

    case ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.payload.id),
      };

    case ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
          )
          .filter((i) => i.quantity > 0),
      };

    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('Failed to persist cart:', err);
    }
  }, [state]);

  // Simulate async add-to-cart (e.g. stock check) to match UI loading states
  const addToCart = (product) =>
    new Promise((resolve) => {
      dispatch({ type: ACTIONS.ADD_ITEM, payload: product });
      setTimeout(resolve, 300);
    });

  const removeFromCart = (id) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: { id } });

  const updateQuantity = (id, quantity) =>
    dispatch({ type: ACTIONS.UPDATE_QUANTITY, payload: { id, quantity } });

  const clearCart = () => dispatch({ type: ACTIONS.CLEAR_CART });

  const { totalItems, totalPrice } = useMemo(() => {
    return state.items.reduce(
      (acc, item) => ({
        totalItems: acc.totalItems + item.quantity,
        totalPrice: acc.totalPrice + item.price * item.quantity,
      }),
      { totalItems: 0, totalPrice: 0 }
    );
  }, [state.items]);

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
