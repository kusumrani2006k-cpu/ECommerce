import axiosInstance from './axios.interceptors';

export const productApi = {
  getAllProducts: async () => {
    const response = await axiosInstance.get('/product');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axiosInstance.get(`/product/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await axiosInstance.post('/product/create', productData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};