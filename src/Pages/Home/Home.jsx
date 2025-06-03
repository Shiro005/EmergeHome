import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import { Star, ExternalLink, ArrowRight, Package } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [categorizedProducts, setCategorizedProducts] = useState({});

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        organizeByCategoryForHome(data);
      } else {
        setProducts({});
        setCategorizedProducts({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Organize products by category and get latest 5 for home page
  const organizeByCategoryForHome = (productsData) => {
    const organized = {};
    
    Object.entries(productsData).forEach(([productId, product]) => {
      const category = product.category || 'Uncategorized';
      
      if (!organized[category]) {
        organized[category] = [];
      }
      
      organized[category].push({ id: productId, ...product });
    });

    // Sort each category by creation date (newest first) and take only 5
    Object.keys(organized).forEach(category => {
      organized[category] = organized[category]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);
    });

    setCategorizedProducts(organized);
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-orange-200 text-orange-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  // Product Card Component
  const ProductCard = ({ product }) => (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
          }}
        />
        {product.topBrand && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Top Brand
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
          <div className="flex gap-1">
            {product.freeDelivery && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Free Delivery
              </span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.details}
        </p>
        
        <div className="flex gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 bg-gray-900 text-white text-center py-2 px-3 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            View Details
          </Link>
          <a
            href={product.referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-orange-600 transition-colors flex items-center"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to <span className="text-orange-500">ShopHub</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Discover amazing products across all categories
          </p>
          <Link
            to="/products"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {Object.keys(categorizedProducts).length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Products Available</h2>
            <p className="text-gray-600">Check back later for amazing products!</p>
          </div>
        ) : (
          Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="mb-12">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {category}
                </h2>
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 text-sm md:text-base"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to find your perfect product?
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Browse through our extensive collection of quality products
          </p>
          <Link
            to="/products"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center gap-2"
          >
            Explore All Products
            <Package className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;