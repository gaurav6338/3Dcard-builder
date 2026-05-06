// src/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const formatNetworkError = (err) => {
  const msg = err?.message || '';
  if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
    return new Error(`Unable to reach backend at ${API_BASE_URL}. Please start the backend server and retry.`);
  }
  return err;
};

// Helper to get auth headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  } catch (err) {
    throw formatNetworkError(err);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    return response.json();
  } catch (err) {
    throw formatNetworkError(err);
  }
};

export const saveCardToCloud = async (cardData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cardData)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save card');
    }
    return response.json();
  } catch (err) {
    throw formatNetworkError(err);
  }
};

export const fetchMyCard = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/me`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch card');
    }
    return response.json();
  } catch (err) {
    throw formatNetworkError(err);
  }
};

export const fetchSharedCard = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards/shared/${id}`);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch shared card');
    }
    return response.json();
  } catch (err) {
    throw formatNetworkError(err);
  }
};
