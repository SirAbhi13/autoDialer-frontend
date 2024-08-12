// utils/auth.js

// Function to store the auth token
export const setAuthToken = (token) => {
    localStorage.setItem('accessToken', token);
  };
  
  // Function to get the auth token
  export const getAuthToken = () => {
    return localStorage.getItem('accessToken');
  };
  
  // Function to remove the auth token (for logout)
  export const removeAuthToken = () => {
    localStorage.removeItem('accessToken');
  };
  
  // Function to make authenticated API calls
  export const authenticatedFetch = async (url, options = {}) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No access token found');
    }
  
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
  
    const response = await fetch(url, { ...options, headers });
  
    if (response.status === 401) {
      // Token might be expired. You could implement token refresh here.
      removeAuthToken();
      throw new Error('Session expired');
    }
  
    return response;
  };