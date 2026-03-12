import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../api/productApi';
import toast from 'react-hot-toast';
import { 
  FiPackage, 
  FiDollarSign, 
  FiHash, 
  FiFileText, 
  FiImage, 
  FiUpload, 
  FiX, 
  FiCheckCircle,
  FiAlertCircle,
  FiArrowLeft,
  FiSave,
  FiTrendingUp,
  FiShoppingBag
} from 'react-icons/fi';
import { MdOutlineInventory, MdOutlineDescription } from 'react-icons/md';
import { BsCurrencyDollar } from 'react-icons/bs';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    image: null
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [charCount, setCharCount] = useState(0);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Character limit for description
  const MAX_DESCRIPTION_LENGTH = 500;

  // Update character count when description changes
  useEffect(() => {
    setCharCount(formData.description.length);
  }, [formData.description]);

  // Validate form fields
  const validateField = (name, value) => {
    switch(name) {
      case 'name':
        if (!value) return 'Product name is required';
        if (value.length < 3) return 'Product name must be at least 3 characters';
        if (value.length > 100) return 'Product name must be less than 100 characters';
        return '';
      
      case 'price':
        if (!value) return 'Price is required';
        if (isNaN(value) || Number(value) <= 0) return 'Price must be greater than 0';
        if (Number(value) > 999999) return 'Price is too high';
        return '';
      
      case 'stock':
        if (!value && value !== 0) return 'Stock is required';
        if (isNaN(value) || Number(value) < 0) return 'Stock must be 0 or greater';
        if (!Number.isInteger(Number(value))) return 'Stock must be a whole number';
        if (Number(value) > 999999) return 'Stock is too high';
        return '';
      
      case 'description':
        if (!value) return 'Description is required';
        if (value.length < 20) return 'Description must be at least 20 characters';
        if (value.length > MAX_DESCRIPTION_LENGTH) return `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
        return '';
      
      case 'image':
        if (!value) return 'Product image is required';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for numeric fields
    if (name === 'price' || name === 'stock') {
      // Allow empty or valid numbers
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Validate on change if field has been touched
    if (touched[name]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value)
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, WEBP, GIF)');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
      
      // Clear image error if it exists
      setErrors({
        ...errors,
        image: ''
      });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name),
      price: validateField('price', formData.price),
      stock: validateField('stock', formData.stock),
      description: validateField('description', formData.description),
      image: validateField('image', formData.image)
    };
    
    setErrors(newErrors);
    setTouched({
      name: true,
      price: true,
      stock: true,
      description: true,
      image: true
    });
    
    // Check if there are any errors
    if (Object.values(newErrors).some(error => error)) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    
    setLoading(true);

    const productData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        productData.append(key, formData[key]);
      }
    });

    try {
      const response = await productApi.createProduct(productData);
      if (response.success) {
        toast.success('Product created successfully!');
        navigate('/products');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = ['name', 'price', 'stock', 'description', 'image'];
    const filled = fields.filter(field => {
      if (field === 'image') return formData.image !== null;
      return formData[field] && !errors[field];
    }).length;
    return (filled / fields.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors group"
          >
            <FiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center space-x-2">
            <FiShoppingBag className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Create New Product</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Form Completion</span>
            <span className="text-sm font-semibold text-indigo-600">{Math.round(calculateCompletion())}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              style={{ width: `${calculateCompletion()}%` }}
            ></div>
          </div>
        </div>

        {/* Main form card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Form header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FiPackage className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Product</h1>
                <p className="text-indigo-100 text-sm mt-1">Fill in the details below to list your product</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Product Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Product Name <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPackage className={`w-5 h-5 transition-colors duration-200 ${
                    errors.name && touched.name 
                      ? 'text-red-400' 
                      : formData.name && !errors.name 
                        ? 'text-green-500' 
                        : 'text-gray-400 group-focus-within:text-indigo-500'
                  }`} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g., Premium Wireless Headphones"
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none ${
                    errors.name && touched.name
                      ? 'border-red-300 bg-red-50'
                      : formData.name && !errors.name
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                  }`}
                />
                {formData.name && !errors.name && touched.name && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.name && touched.name && (
                <p className="text-sm text-red-600 mt-1 animate-slideDown flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Price and Stock - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BsCurrencyDollar className={`w-5 h-5 transition-colors duration-200 ${
                      errors.price && touched.price 
                        ? 'text-red-400' 
                        : formData.price && !errors.price 
                          ? 'text-green-500' 
                          : 'text-gray-400 group-focus-within:text-indigo-500'
                    }`} />
                  </div>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0.00"
                    className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none ${
                      errors.price && touched.price
                        ? 'border-red-300 bg-red-50'
                        : formData.price && !errors.price
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                    }`}
                  />
                  {formData.price && !errors.price && touched.price && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.price && touched.price && (
                  <p className="text-sm text-red-600 mt-1 animate-slideDown flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdOutlineInventory className={`w-5 h-5 transition-colors duration-200 ${
                      errors.stock && touched.stock 
                        ? 'text-red-400' 
                        : formData.stock && !errors.stock 
                          ? 'text-green-500' 
                          : 'text-gray-400 group-focus-within:text-indigo-500'
                    }`} />
                  </div>
                  <input
                    type="text"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="100"
                    className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none ${
                      errors.stock && touched.stock
                        ? 'border-red-300 bg-red-50'
                        : formData.stock && !errors.stock
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                    }`}
                  />
                  {formData.stock && !errors.stock && touched.stock && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <FiCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.stock && touched.stock && (
                  <p className="text-sm text-red-600 mt-1 animate-slideDown flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    {errors.stock}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <MdOutlineDescription className={`w-5 h-5 transition-colors duration-200 ${
                    errors.description && touched.description 
                      ? 'text-red-400' 
                      : formData.description && !errors.description 
                        ? 'text-green-500' 
                        : 'text-gray-400 group-focus-within:text-indigo-500'
                  }`} />
                </div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Describe your product in detail... Include features, specifications, and benefits."
                  rows="5"
                  className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none resize-none ${
                    errors.description && touched.description
                      ? 'border-red-300 bg-red-50'
                      : formData.description && !errors.description
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-200 bg-gray-50 hover:bg-white focus:bg-white'
                  }`}
                />
                {formData.description && !errors.description && touched.description && (
                  <div className="absolute top-3 right-0 pr-3">
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between">
                {errors.description && touched.description ? (
                  <p className="text-sm text-red-600 animate-slideDown flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Minimum 20 characters
                  </p>
                )}
                <span className={`text-sm ${
                  charCount > MAX_DESCRIPTION_LENGTH 
                    ? 'text-red-600 font-semibold' 
                    : charCount >= MAX_DESCRIPTION_LENGTH - 50 
                      ? 'text-orange-500' 
                      : 'text-gray-500'
                }`}>
                  {charCount}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Product Image <span className="text-red-500">*</span>
              </label>
              
              {!preview ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : errors.image && touched.image
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      <div className={`p-4 rounded-full ${
                        dragActive ? 'bg-indigo-100' : 'bg-gray-100'
                      } transition-colors duration-200`}>
                        <FiUpload className={`w-8 h-8 ${
                          dragActive ? 'text-indigo-600' : 'text-gray-500'
                        }`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">
                        {dragActive ? 'Drop your image here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPEG, WEBP or GIF (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Product preview"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors transform hover:scale-110"
                    >
                      <FiImage className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 bg-white rounded-full hover:bg-red-100 transition-colors transform hover:scale-110"
                    >
                      <FiX className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              )}
              
              {errors.image && touched.image && !preview && (
                <p className="text-sm text-red-600 mt-1 animate-slideDown flex items-center">
                  <FiAlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                  {errors.image}
                </p>
              )}
            </div>

            {/* Tips section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center">
                <FiTrendingUp className="w-4 h-4 mr-2" />
                Tips for better product listings
              </h3>
              <ul className="space-y-2 text-sm text-indigo-700">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Use high-quality images that show your product clearly
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Write detailed descriptions highlighting key features
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Set competitive prices based on market research
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Keep accurate stock levels to avoid overselling
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Product...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview card (optional) */}
        {preview && formData.name && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <FiPackage className="w-4 h-4 mr-2" />
              Live Preview
            </h3>
            <div className="flex items-center space-x-4">
              <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <h4 className="font-medium text-gray-900">{formData.name || 'Product Name'}</h4>
                <p className="text-sm text-gray-500">${formData.price || '0.00'} • Stock: {formData.stock || '0'}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{formData.description || 'Description will appear here'}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default CreateProduct;