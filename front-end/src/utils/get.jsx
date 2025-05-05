// src/utils/api.js
import { getAuth } from 'firebase/auth';

export const apiCall = async (endpoint, options = {}) => {
  const auth = getAuth();
  const user = auth.currentUser;
  const backendUrl = import.meta.env.VITE_JAVA_BACKEND_URL;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const token = await user.getIdToken();
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(`${backendUrl}/api/${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error('API call failed');
  }

  return response.json();
};
