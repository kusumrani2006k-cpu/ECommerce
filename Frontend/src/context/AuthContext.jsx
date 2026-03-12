import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:4000/api/v1';

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = API_URL;

  useEffect(() => {
    // Only check user if there might be a token (don't show error for initial load)
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await axios.get('/user/get', {
        withCredentials: true
      });
      if (response.data?.success && response.data?.data) {
        setUser(response.data.data);
      }
    } catch (error) {
      // Don't show error for 401 as it's expected when not logged in
      if (error.response?.status !== 401) {
        console.error('Auth check failed:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/user/login', {
        email,
        password
      }, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data?.success) {
        // The response structure from your backend
        const userData = response.data.data.user || response.data.data;
        setUser(userData);
        toast.success('Login successful!');
        return { success: true, data: userData };
      }
    } catch (error) {
      console.error('Login error:', error.response?.data);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const formData = new FormData();
      
      // Append all fields to FormData
      Object.keys(userData).forEach(key => {
        if (key === 'profile' && userData[key]) {
          formData.append('profile', userData[key]);
        } else if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });

      const response = await axios.post('/user/register', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data?.success) {
        toast.success('Registration successful! Please login.');
        return { success: true, data: response.data.data };
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/user/logout', {}, { 
        withCredentials: true 
      });
      setUser(null);
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
      return { success: false };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};