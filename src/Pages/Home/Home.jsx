import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import { 
  Star, 
  ExternalLink, 
  ArrowRight, 
  Heart, 
  ShoppingBag,
  Zap,
  Award,
  Shield,
  Truck,
  ChevronRight,
  Sparkles,
  BadgeCheck,
  ThumbsUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [categorizedProducts, setCategorizedProducts] = useState({});
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const featuresRef = useRef(null);
  const categoryRefs = useRef({});

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        organizeByCategoryForHome(data);
        extractFavoriteProducts(data);
      } else {
        setProducts({});
        setCategorizedProducts({});
        setFavoriteProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Banner rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
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

  // Extract favorite products
  const extractFavoriteProducts = (productsData) => {
    const favorites = Object.entries(productsData)
      .filter(([_, product]) => product.favorite)
      .map(([productId, product]) => ({ id: productId, ...product }));
    
    setFavoriteProducts(favorites);
  };

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 fill-amber-200 text-amber-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
    }
    return stars;
  };

  // Banner data
 const banners = [
  {
    id: 1,
    title: "Expert-Curated Products",
    subtitle: "Our team of experts handpicks the best products from Amazon, Flipkart & Meesho",
    bgColor: "bg-gradient-to-r from-amber-500 to-amber-600",
    buttonText: "Shop Now",
    buttonColor: "bg-white text-amber-600 hover:bg-gray-100",
    icon: <BadgeCheck className="w-8 h-8 text-white" />,
    overlay: "bg-gradient-to-br from-amber-600/90 to-amber-700/90",
    textColor: "text-white",
    partners: [
      { name: "Amazon", logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png" },
      { name: "Flipkart", logo: "https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png" },
      { name: "Meesho", logo: "https://images.seeklogo.com/logo-png/43/1/meesho-logo-png_seeklogo-438533.png" }
    ]
  },
  {
    id: 2,
    title: "100% Affiliate Marketplace",
    subtitle: "We don't sell products, we help you find the best deals from trusted partners",
    bgColor: "bg-gradient-to-r from-amber-400 to-amber-500",
    buttonText: "Explore Deals",
    buttonColor: "bg-gray-900 text-white hover:bg-gray-800",
    icon: <ThumbsUp className="w-8 h-8 text-gray-900" />,
    overlay: "bg-gradient-to-bl from-amber-400/20 to-amber-600/30",
    textColor: "text-gray-900",
    highlight: "No Middlemen - Direct from Retailers",
    highlightColor: "bg-white text-amber-600"
  },
  {
    id: 3,
    title: "Premium Selections",
    subtitle: "Only the highest rated products that meet our strict quality standards",
    bgColor: "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500",
    buttonText: "View Premium",
    buttonColor: "bg-gray-900 text-white hover:bg-gray-800",
    icon: <Sparkles className="w-8 h-8 text-gray-900" />,
    overlay: "bg-gradient-to-tr from-amber-500/30 via-amber-600/40 to-amber-700/50",
    textColor: "text-gray-900",
    badge: "Quality Guaranteed",
    badgeColor: "bg-gray-900 text-white"
  }
];

  // Features data
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-amber-500" />,
      title: "Secure Payments",
      description: "Direct checkout with trusted partners"
    },
    {
      icon: <Truck className="w-8 h-8 text-amber-500" />,
      title: "Fast Delivery",
      description: "Free delivery on eligible orders"
    },
    {
      icon: <Award className="w-8 h-8 text-amber-500" />,
      title: "Expert Verified",
      description: "Products selected by specialists"
    },
    {
      icon: <Star className="w-8 h-8 text-amber-500" />,
      title: "Top Rated",
      description: "Only highly reviewed products"
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-500" />,
      title: "Best Prices",
      description: "We find you the best deals"
    },
    {
      icon: <Heart className="w-8 h-8 text-amber-500" />,
      title: "Customer Love",
      description: "1000+ happy customers"
    }
  ];

  // Product Card Component
  const ProductCard = ({ product }) => (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 w-64 flex-shrink-0 overflow-hidden border border-gray-200 relative glass-effect"
    >
      <div className="relative">
        <div className="aspect-square bg-gray-50 flex items-center justify-center p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
            }}
          />
        </div>
        
        {product.topBrand && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center glass-effect">
            <Award className="w-3 h-3 mr-1" />
            Top Brand
          </div>
        )}
        
        {product.favorite && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white p-1.5 rounded-full shadow-sm glass-effect">
            <Heart className="w-3 h-3 fill-current" />
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {renderStars(product.rating)}
            <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-base font-bold text-gray-900">₹{product.price}</span>
          {product.freeDelivery && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded flex items-center glass-effect">
              <Truck className="w-3 h-3 mr-1" />
              Free
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 bg-gray-900 text-white text-center py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center glass-effect"
          >
            View Details
          </Link>
          <a
            href={product.referralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors flex items-center justify-center glass-effect"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Banner with Glass Effect */}
      <div className="relative h-96 md:h-[32rem] overflow-hidden">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentBanner === index ? 1 : 0,
              transition: { duration: 1 }
            }}
            className={`absolute inset-0 ${banner.bgColor} flex items-center`}
          >
            {/* Background overlay with glass effect */}
            <div className={`absolute inset-0 ${banner.overlay} backdrop-blur-sm`}></div>
            
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
              <div className="max-w-2xl text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 mb-4"
                >
                  {banner.icon}
                  <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">
                    {banner.title}
                  </h1>
                </motion.div>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl mb-8"
                >
                  {banner.subtitle}
                </motion.p>
                
                {banner.highlight && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="inline-block bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 mb-6 text-amber-200 text-sm font-medium glass-effect"
                  >
                    {banner.highlight}
                  </motion.div>
                )}
                
                {banner.partners && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mb-8"
                  >
                    <p className="text-sm text-gray-300 mb-3">Trusted Partners:</p>
                    <div className="flex items-center gap-4 flex-wrap">
                      {banner.partners.map((partner, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm p-2 rounded-lg glass-effect">
                          <img 
                            src={partner.logo} 
                            alt={partner.name} 
                            className="h-6 object-contain max-w-[100px]"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x30?text='+partner.name;
                              e.target.className = 'h-6 object-contain max-w-[100px] bg-white p-1';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <Link
                    to="/products"
                    className="bg-amber-500 text-gray-900 hover:bg-amber-600 px-6 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center gap-2 glass-effect hover:shadow-lg"
                  >
                    {banner.buttonText}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Banner Indicators */}
        {/* <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentBanner === index ? 'bg-amber-500 w-6' : 'bg-white/50'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div> */}
      </div>

      {/* Features Section - Horizontal Scrolling */}
      {/* <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
          
          <div 
            ref={featuresRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide"
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-64 bg-white rounded-xl p-6 shadow-sm border border-gray-200 glass-effect"
              >
                <div className="bg-amber-100/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Favorites Section */}
      {favoriteProducts.length > 0 && (
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                <Heart className="inline w-6 h-6 text-amber-500 fill-current mr-2" />
                Expert's Top Picks
              </h2>
              <Link
                to="/products?favorites=true"
                className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 text-sm md:text-base glass-effect px-4 py-2 rounded-lg"
              >
                View All Favorites
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 bg-gray-50">
        {Object.keys(categorizedProducts).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Products Available</h2>
            <p className="text-gray-600">Our experts are curating the best products for you</p>
          </div>
        ) : (
          Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
            <div key={category} className="mb-16">
              {/* Category Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {category}
                </h2>
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 text-sm md:text-base glass-effect px-4 py-2 rounded-lg"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Products Grid - Horizontal Scrolling */}
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
                
                {/* View All Card */}
                <Link
                  to={`/products?category=${encodeURIComponent(category)}`}
                  className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col items-center justify-center glass-effect p-6 text-center"
                >
                  <div className="bg-amber-100/50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <ChevronRight className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">View All {category}</h3>
                  <p className="text-sm text-gray-600">See all products in this category</p>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Call to Action Section */}
      <div className="bg-gray-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find your perfect product?
          </h2>
          <p className="text-amber-100 mb-8 text-lg">
            Our experts have curated the best products from trusted partners
          </p>
          <Link
            to="/products"
            className="bg-amber-500 text-white hover:bg-amber-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-flex items-center gap-2 glass-effect hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
            Explore All Products
          </Link>
          
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl glass-effect">
              <p className="text-amber-300 text-sm mb-1">Trusted By</p>
              <p className="text-white font-bold text-xl">10,000+</p>
              <p className="text-gray-300 text-sm">Happy Customers</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl glass-effect">
              <p className="text-amber-300 text-sm mb-1">Products From</p>
              <p className="text-white font-bold text-xl">50+</p>
              <p className="text-gray-300 text-sm">Top Brands</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl glass-effect">
              <p className="text-amber-300 text-sm mb-1">Average Rating</p>
              <p className="text-white font-bold text-xl">4.8/5</p>
              <p className="text-gray-300 text-sm">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global Styles for Glass Effect */}
      <style jsx global>{`
        .glass-effect {
          backdrop-filter: blur(8px);
          background-color: rgba(255, 255, 255, 0.8);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;