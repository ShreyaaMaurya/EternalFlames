// API Configuration
// Automatically detect the API base URL based on environment

const getAPIBaseURL = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:4000';
  }

  // In production (Vercel), use relative paths
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '';  // Use relative path for same-origin requests
  }

  // In development, use localhost
  return 'http://localhost:4000';
};

const API_BASE_URL = getAPIBaseURL();

export { API_BASE_URL };
