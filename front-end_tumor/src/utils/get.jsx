// src/utils/api.js
import axios from './axios';

export const fetchData = async () => {
  try {
    const response = await axios.get('/api/data'); // Replace with your Flask backend endpoint
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
