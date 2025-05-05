// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://flask_model_service:5000', 
});

export default instance;
