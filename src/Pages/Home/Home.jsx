import { useState, useEffect, useRef } from 'react';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import { 
  Star, ShoppingCart, Truck, RotateCcw, Award, ExternalLink, Search, Filter, 
  Heart, Eye, Share2, Tag, TrendingUp, Zap, Gift, Shield, Clock, Users,
  ChevronRight, Sparkles, Crown, BadgePercent, X, Plus, Minus, Menu,
  Bell, User, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Grid3X3, List,
  Home as HomeIcon, Utensils, Sofa, Bed, PaintBucket, ShowerHead, Lock, Lightbulb,
  ChevronLeft, ChevronDown, ChevronUp
} from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [wishlist, setWishlist] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Color constants
  const colors = {
    primary: '#FF6F00',
    primaryDark: '#E65100',
    primaryLight: '#FFA040',
    accent: '#333333',
    white: '#FFFFFF',
    background: '#FAF3EB',
    textDark: '#333333',
    textLight: '#666666',
    border: '#E0E0E0',
    success: '#4CAF50',
    info: '#2196F3'
  };

  // Banner data for rotating banners
  const banners = [
    {
      id: 1,
      title: "Premium Home Essentials",
      subtitle: "Curated collection of top-quality products for your home",
      image: 'https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      icon: <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      partners: ["Best Quality", "Trusted Brands", "Premium Selection"],
      buttonText: "Shop Now",
      buttonColor: colors.primary
    },
    {
      id: 2,
      title: "Fast & Reliable Delivery",
      subtitle: "Get your products delivered quickly and safely",
      image: 'https://images.pexels.com/photos/1087727/pexels-photo-1087727.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      icon: <Truck className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      partners: ["Free Shipping", "Easy Returns", "24/7 Support"],
      buttonText: "Learn More",
      buttonColor: colors.accent
    },
    {
      id: 3,
      title: "Exclusive Deals",
      subtitle: "Special discounts for our valued customers",
      image: 'https://images.pexels.com/photos/4004127/pexels-photo-4004127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      partners: ["Limited Time", "Member Discounts", "Seasonal Offers"],
      buttonText: "View Offers",
      buttonColor: colors.primaryDark
    }
  ];

  // Categories with icons for main categories
  const categoryIcons = {
    'Home Appliances': HomeIcon,
    'Kitchen Tools': Utensils,
    'Furniture': Sofa,
    'Linen And Rugs': Bed,
    'Curtians And Accessories': PaintBucket,
    'Bathroom And Kitchen Fixtures': ShowerHead,
    'Safes And Security': Lock,
    'Door Locks And Hardware': Lock,
    'Outdoor Decor': Gift,
    'Lights': Lightbulb
  };

  const categoriesData = {
    "Home Appliances": {
      "Kitchen Appliances": [
        "Mixer Grinder",
        "Juicers",
        "Hand Blenders",
        "Food Processor",
        "Oven Toaster Grills",
        "Rice And Pasta Cookers",
        "Deep Fryers",
        "Hand Mixers",
        "Coffee Machines",
        "Wet Grinders",
        "Induction Cooktops",
        "Sandwich Makers",
        "Electric Kettles",
        "Refrigerator",
        "Chimney",
        "Dishwasher",
        "Microwave Oven"
      ],
      "Other Appliances": [
        "Air Conditioner",
        "Washing Machine",
        "Dishwasher",
        "Water Purifier",
        "Vacuum Cleaners",
        "Sewing Machines And Accessories",
        "Irons",
        "Inverters",
        "Fans",
        "Water Heaters",
        "Air Coolers",
        "Air Purifier",
        "Dehumidifiers",
        "Humidifier"
      ]
    },
    "Kitchen Tools": {
      "_uncategorized": [
        "Cookware sets",
        "Frying Pans",
        "Tawas",
        "Kadhai",
        "Pressure Cookers",
        "Water Bottle And Flasks",
        "Jars And Container",
        "Lunch Boxes",
        "Chopper and Chippers",
        "Graters And Slicers",
        "Knives",
        "Baking Tools",
        "Dinner Sets",
        "Dining Tables",
        "Kitchen Cabinet",
        "Crockery Unit",
        "Bar stool",
        "Bar cabinet",
        "Serving Trolley"
      ]
    },
    "Furniture": {
      "Living Room Furniture": [
        "Sofa Beds",
        "Sofa Sets",
        "L-Shaped Sofas",
        "Recliners",
        "Tv And Entertainment Units",
        "Centre Tables",
        "Nested Tables",
        "Chairs",
        "Shoe Rack",
        "Footstool",
        "Pouffes And Ottomans",
        "Bean Bags",
        "Wall Shelves",
        "Magazine Racks"
      ],
      "Bedroom Furniture": [
        "Beds",
        "Mattresses",
        "Wardrobes",
        "Bedside Tables",
        "Dressing Tables",
        "Chest Of Drawers"
      ],
      "Kitchen And Dining": [
        "Dining Table Sets",
        "Dining Chairs",
        "Kitchen Cabinets"
      ],
      "Study Room Furniture": [
        "Desks",
        "Office Chairs",
        "Bookcases"
      ],
      "Outdoor Furniture": [
        "Hammocks",
        "Swing Chairs",
        "Outdoor Furniture Sets",
        "Patio Umbrella"
      ]
    },
    "Linen And Rugs": {
      "Bedroom Linen": [
        "Bedsheets",
        "Bed Pillow",
        "Speciality Pillow",
        "Blankets And Quilts",
        "Mattresses Protectors",
        "Bedding Sets",
        "Duvet Covers",
        "Fitted Bedsheets",
        "Pillow Cases",
        "Cushion Covers",
        "Cushions",
        "Slipcovers",
        "Diwan Sets"
      ],
      "Bathroom Linen": [
        "Bath Mats",
        "Bath Pillow",
        "Bathrobes",
        "Shower Curtains",
        "Bath Towels"
      ]
    },
    "Curtians And Accessories": {
      "_uncategorized": [
        "Curtains",
        "Blinds",
        "Valances",
        "Tiers",
        "Swags",
        "Accessories",
        "Carpet And Rugs",
        "Carpets",
        "Rugs",
        "Doormats",
        "Stair Carpets",
        "Kitchen Linen",
        "Aprons",
        "Table Cloth",
        "Place Mats",
        "Table Runners",
        "Oven Gloves"
      ]
    },
    "Bathroom And Kitchen Fixtures": {
      "_uncategorized": [
        "Bathroom Basin Taps",
        "Bathroom Hardware",
        "Health Faucets",
        "Shower And Bath Taps",
        "Shower Heads",
        "Kitchen Fixtures"
      ]
    },
    "Safes And Security": {
      "_uncategorized": [
        "Safes",
        "Video Door Phone",
        "Alarms",
        "Home Security System"
      ]
    },
    "Door Locks And Hardware": {
      "_uncategorized": [
        "Ladders",
        "Door Locks",
        "Hooks",
        "Door Hardware",
        "Furniture Hardware",
        "Cabinet Hardware"
      ]
    },
    "Outdoor Decor": {
      "_uncategorized": [
        "Decorative Pots",
        "Sculptures",
        "Fountains",
        "Wind Chimes",
        "Birdbaths",
        "Solar Garden Lights"
      ]
    },
    "Lights": {
      "Functional Lighting": [
        "Light Bulbs",
        "LED Bulbs",
        "Emergency Lights",
        "Clip Lights",
        "Desk Lights",
        "Working Lights",
        "Wall Lights",
        "Reading Lights",
        "Wall Spotlights"
      ],
      "Decorative Lighting": [
        "Standing Lights",
        "Table lamps",
        "Floor lamps",
        "Lamp Shades"
      ],
      "Speciality Lighting": [
        "Book Lights",
        "Lava Lamps",
        "Night Lights",
        "Seasonal Lights",
        "Lamp Bases"
      ],
      "Fixtures": [
        "Bathroom Lights",
        "Ceiling Lights",
        "Chandeliers",
        "Picture And Display Lights",
        "Recessed lights",
        "Track, Rail And Cable Lighting System"
      ]
    }
  };

  // Create categories array for display
  const categories = Object.keys(categoriesData).map(categoryName => {
    const IconComponent = categoryIcons[categoryName] || Gift;
    return {
      name: categoryName,
      icon: <IconComponent className="w-6 h-6" />,
      color: getCategoryColor(categoryName),
      subcategories: categoriesData[categoryName]
    };
  });

  function getCategoryColor(categoryName) {
    const colorMap = {
      'Home Appliances': 'from-blue-400 to-blue-600',
      'Kitchen Tools': 'from-green-400 to-green-600',
      'Furniture': 'from-purple-400 to-purple-600',
      'Linen And Rugs': 'from-pink-400 to-pink-600',
      'Curtians And Accessories': 'from-yellow-400 to-orange-500',
      'Bathroom And Kitchen Fixtures': 'from-cyan-400 to-blue-500',
      'Safes And Security': 'from-red-400 to-red-600',
      'Door Locks And Hardware': 'from-gray-400 to-gray-600',
      'Outdoor Decor': 'from-teal-400 to-green-500',
      'Lights': 'from-amber-400 to-yellow-500'
    };
    return colorMap[categoryName] || 'from-gray-400 to-gray-500';
  }

  // Banner rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        setFilteredProducts(data);
      } else {
        setProducts({});
        setFilteredProducts({});
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = { ...products };

    if (searchTerm.trim() !== '') {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        const product = filtered[key];
        if (
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.details.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          acc[key] = product;
        }
        return acc;
      }, {});
    }

    if (selectedCategory !== '') {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        const product = filtered[key];
        if (product.category === selectedCategory) {
          acc[key] = product;
        }
        return acc;
      }, {});
    }

    if (selectedSubcategory !== '') {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        const product = filtered[key];
        if (product.subcategory === selectedSubcategory) {
          acc[key] = product;
        }
        return acc;
      }, {});
    }

    if (sortBy !== '') {
      const sortedEntries = Object.entries(filtered).sort(([, a], [, b]) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
      filtered = Object.fromEntries(sortedEntries);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, selectedSubcategory, sortBy, products]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-200 text-yellow-400" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSortBy('');
  };

  const getDiscountPercentage = (price) => {
    const originalPrice = price * (1 + Math.random() * 0.5);
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
    setSelectedQuantity(1);
    setSelectedImageIndex(0);
  };

  const toggleCategoryExpansion = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const QuickViewModal = ({ product }) => {
    if (!product) return null;

    const productImages = [
      product.imageUrl,
      product.imageUrl,
      product.imageUrl,
      product.imageUrl
    ];

    const originalPrice = Math.round(product.price * 1.3);
    const discount = getDiscountPercentage(product.price);

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
            <button
              onClick={closeQuickView}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)] overflow-y-auto">
            <div className="lg:w-1/2 p-6">
              <div className="relative mb-4">
                <img
                  src={productImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                  }}
                />
                {discount > 10 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {discount}% OFF
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(Object.keys(products).find(key => products[key] === product))}
                  className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm ${
                    wishlist.has(Object.keys(products).find(key => products[key] === product))
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/80 text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${wishlist.has(Object.keys(products).find(key => products[key] === product)) ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="flex gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 p-6 border-l border-gray-200">
              <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
                  categories.find(cat => cat.name === product.category)?.color || 'from-gray-400 to-gray-500'
                }`}>
                  {categories.find(cat => cat.name === product.category)?.icon} {product.category}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {product.rating} ({Math.floor(Math.random() * 500 + 50)} reviews)
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  {discount > 10 && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ${originalPrice}
                      </span>
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold">
                        Save ${originalPrice - product.price}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">Inclusive of all taxes • FREE delivery</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.details}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.freeDelivery && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Free Delivery
                  </span>
                )}
                {product.returnAvailable && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <RotateCcw className="w-4 h-4" />
                    Easy Returns
                  </span>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg font-medium min-w-[60px] text-center">
                    {selectedQuantity}
                  </span>
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <a
                  href={product.referralLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Now
                </a>
                <button className="px-6 py-3 border-2 border-orange-500 text-orange-500 rounded-xl font-bold hover:bg-orange-50 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-blue-500 to-purple-500 border-t-transparent mx-auto mb-4"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Hero Banner Section */}
      <div className="relative overflow-hidden h-[500px] md:h-[600px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
            </div>
            
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    {banner.icon}
                    <span className="text-white/80 font-medium">Emerge Home</span>
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {banner.title}
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-white/90 mb-6 leading-relaxed">
                    {banner.subtitle}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    {banner.partners.map((partner, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <span className="text-white font-medium">{partner}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    className="px-8 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-lg"
                    style={{ backgroundColor: banner.buttonColor }}
                  >
                    {banner.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Banner Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentBanner ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* Banner Navigation Arrows */}
        <button
          onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubcategory('');
                }}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Subcategories</option>
                  {Object.keys(categoriesData[selectedCategory]).map((subcat) => (
                    subcat === '_uncategorized' ? 
                      categoriesData[selectedCategory][subcat].map((item) => (
                        <option key={item} value={item}>{item}</option>
                      )) :
                      <option key={subcat} value={subcat}>{subcat}</option>
                  ))}
                </select>
              )}

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sort By</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid3X3 className="w-5 h-5" />}
                </button>
                
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Crown className="w-7 h-7 text-yellow-500" />
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSelectedSubcategory('');
                }}
                className={`p-4 rounded-2xl transition-all transform hover:scale-105 ${
                  selectedCategory === category.name
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white hover:shadow-lg border border-gray-200'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-3 rounded-full ${
                    selectedCategory === category.name 
                      ? 'bg-white/20' 
                      : `bg-gradient-to-r ${category.color} text-white`
                  }`}>
                    {category.icon}
                  </div>
                  <span className="font-medium text-sm text-center">
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-500" />
              Featured Products
              <span className="text-lg font-normal text-gray-600">
                ({Object.keys(filteredProducts).length} items)
              </span>
            </h2>
          </div>

          {Object.keys(filteredProducts).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {Object.entries(filteredProducts).map(([productId, product]) => {
                const discount = getDiscountPercentage(product.price);
                const originalPrice = Math.round(product.price * 1.3);
                
                return (
                  <div
                    key={productId}
                    className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-48' : ''}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className={`w-full object-cover ${
                          viewMode === 'list' ? 'h-48' : 'h-64'
                        }`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                        }}
                      />
                      
                      {discount > 10 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          {discount}% OFF
                        </div>
                      )}
                      
                      <button
                        onClick={() => toggleWishlist(productId)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
                          wishlist.has(productId)
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/80 text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${wishlist.has(productId) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="mb-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${
                          categories.find(cat => cat.name === product.category)?.color || 'from-gray-400 to-gray-500'
                        }`}>
                          {product.category}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer">
                        {product.name}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.details}
                      </p>

                      <div className="flex items-center gap-1 mb-3">
                        {renderStars(product.rating)}
                        <span className="text-sm font-medium text-gray-600 ml-1">
                          ({product.rating})
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl font-bold text-green-600">
                          ${product.price}
                        </span>
                        {discount > 10 && (
                          <span className="text-sm text-gray-400 line-through">
                            ${originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {product.freeDelivery && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            Free Delivery
                          </span>
                        )}
                        {product.returnAvailable && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                            Easy Returns
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Quick View
                        </button>
                        <a
                          href={product.referralLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-purple-600 text-white px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-1"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy Now
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal product={quickViewProduct} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Emerge Home</h3>
              <p className="text-gray-400 mb-4">
                Your trusted partner for premium home essentials and quality products.
              </p>
              <div className="flex gap-4">
                <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
                <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Track Your Order</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@emergehome.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>123 Home Street, City, State 12345</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Emerge Home. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;