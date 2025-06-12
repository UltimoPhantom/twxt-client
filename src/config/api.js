// API configuration utility
const API_BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  TEXTS: `${API_BASE_URL}/api/texts`,
};

export default API_BASE_URL;
