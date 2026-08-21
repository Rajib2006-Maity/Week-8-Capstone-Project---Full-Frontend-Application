// src/contexts/AuthContext.js
// Simulated authentication using Local Storage (no real backend auth server).
// Attempts a real call to FakeStoreAPI's /auth/login for realism, but falls
// back gracefully so the flow always works for demo purposes.

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginUser } from '../services/api';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'shopsphere_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to restore session:', err);
    } finally {
      setInitializing(false);
    }
  }, []);

  const persistUser = (userObj) => {
    setUser(userObj);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
  };

  const login = useCallback(async (username, password) => {
    setAuthError(null);
    try {
      // Try a real token from FakeStoreAPI (demo creds: mor_2314 / 83r5^_
      const data = await loginUser(username, password);
      const userObj = { username, token: data.token };
      persistUser(userObj);
      return { success: true };
    } catch (err) {
      // Fallback: simulate a successful login locally so the flow is
      // testable without needing FakeStoreAPI's exact seeded credentials.
      if (username.trim().length >= 3 && password.trim().length >= 4) {
        const userObj = { username, token: `simulated-${Date.now()}` };
        persistUser(userObj);
        return { success: true };
      }
      const message = 'Invalid username or password.';
      setAuthError(message);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback((username, email, password) => {
    setAuthError(null);
    if (!username || !email || !password) {
      const message = 'All fields are required.';
      setAuthError(message);
      return { success: false, error: message };
    }
    // Simulated registration — persists locally as a "logged in" user.
    const userObj = { username, email, token: `simulated-${Date.now()}` };
    persistUser(userObj);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    initializing,
    authError,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
