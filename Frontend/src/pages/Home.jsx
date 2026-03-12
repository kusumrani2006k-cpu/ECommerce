import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to DevConnect
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Connect with developers and discover amazing products
        </p>
        <div className="space-x-4">
          <Link to="/products" className="btn-primary text-lg">
            Browse Products
          </Link>
          {!user && (
            <Link to="/register" className="btn-secondary text-lg">
              Get Started
            </Link>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-3xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
          <p className="text-gray-600">Discover amazing products created by developers</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-3xl mb-4">💼</div>
          <h3 className="text-xl font-semibold mb-2">Sell Your Products</h3>
          <p className="text-gray-600">List and sell your digital products easily</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 text-3xl mb-4">🤝</div>
          <h3 className="text-xl font-semibold mb-2">Connect</h3>
          <p className="text-gray-600">Join a community of developers and creators</p>
        </div>
      </div>
    </div>
  );
};

export default Home;