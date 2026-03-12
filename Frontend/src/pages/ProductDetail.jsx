import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productApi } from '../api/productApi';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productApi.getProductById(id);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={product.image || 'https://via.placeholder.com/500x400'} 
              alt={product.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="mb-4">
              <span className="text-2xl font-bold text-primary-600">
                ${product.price}
              </span>
              <span className="ml-4 text-sm text-gray-500">
                Stock: {product.stock}
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Vendor</h3>
              <div className="flex items-center">
                <img 
                  src={product.vendorid?.profile || 'https://via.placeholder.com/40'} 
                  alt={product.vendorid?.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <p className="font-medium">{product.vendorid?.name}</p>
                  <p className="text-sm text-gray-500">{product.vendorid?.email}</p>
                </div>
              </div>
            </div>
            
            <button className="btn-primary w-full">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;