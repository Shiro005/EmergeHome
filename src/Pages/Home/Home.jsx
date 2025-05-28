import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import {
  Star, ShoppingCart, Truck, RotateCcw, Award, ExternalLink, Search,
  Filter, ChevronRight, Menu, Heart, User, MapPin, Gift, Zap,
  Home as HomeIcon, Smartphone, Shirt, Book, Gamepad2, Baby, Car, PaintBucket,
  Utensils, Sofa, Bed, ShowerHead, Lock, Lightbulb, ChevronLeft,
  TrendingUp, Clock, Shield, IndianRupee
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [latestProducts, setLatestProducts] = useState([]);

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
    border: '#E0E0E0'
  };

  // Banner data for rotating banners
  const banners = [
    {
      id: 1,
      title: "Premium Home Essentials",
      subtitle: "Curated collection of top-quality products for your home",
      gradient: `from-[${colors.primary}] via-[${colors.primaryLight}] to-[${colors.accent}]`,
      icon: <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      partners: ["Best Quality", "Trusted Brands", "Premium Selection"],
      bgColor: `bg-gradient-to-r from-[${colors.primary}] to-[${colors.accent}]`
    },
    {
      id: 2,
      title: "Fast & Reliable Delivery",
      subtitle: "Get your products delivered quickly and safely",
      gradient: `from-[${colors.accent}] via-[${colors.primary}] to-[${colors.primaryLight}]`,
      icon: <Truck className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      partners: ["Free Shipping", "Easy Returns", "24/7 Support"],
      bgColor: `bg-gradient-to-r from-[${colors.accent}] to-[${colors.primary}]`
    },
    {
      id: 3,
      title: "Exclusive Deals",
      subtitle: "Special discounts for our valued customers",
      gradient: `from-[${colors.primaryDark}] via-[${colors.primary}] to-[${colors.accent}]`,
      icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />,
      partners: ["Limited Time", "Member Discounts", "Seasonal Offers"],
      bgColor: `bg-gradient-to-r from-[${colors.primaryDark}] to-[${colors.accent}]`
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
        "Oven Toaster Grilss",
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
        "Kitchen Cabintes"
      ],
      "Study Room Furniture": [
        "Desks",
        "Office Chiars",
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
        "Health Fausets",
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
  }

  // Rotate banners every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch products from Firebase and get latest 5 products
  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(data);
        setFilteredProducts(data);

        // Get latest 5 products by timestamp or order in database
        const productsArray = Object.values(data);
        const sortedProducts = productsArray.sort((a, b) =>
          new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
        );
        setLatestProducts(sortedProducts.slice(0, 4));
      } else {
        setProducts({});
        setFilteredProducts({});
        setLatestProducts([]);
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
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.details?.toLowerCase().includes(searchTerm.toLowerCase())
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
            return a.name?.localeCompare(b.name) || 0;
          default:
            return 0;
        }
      });
      filtered = Object.fromEntries(sortedEntries);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-[#FFB74D] text-[#FFB74D]" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 fill-[#FFE0B2] text-[#FFB74D]" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
    }
    return stars;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
  };

  const getCategoryProducts = (categoryName) => {
    return Object.values(products).filter(product =>
      product.category === categoryName
    ).slice(0, 4);
  };

  const handleProductClick = (productId, category) => {
    navigate(`/product/${encodeURIComponent(category)}`, {
      state: {
        product: products[productId],
        categoryName: category
      }
    });
  };

  const handleViewAll = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`, {
      state: {
        products: Object.values(products).filter(p => p.category === category),
        categoryName: category
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
        <div className="text-center pt-32">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold" style={{ color: colors.accent }}>Loading Premium Products...</h2>
          <p className="text-gray-600">Curating the best home essentials for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>

      {/* Search Bar (Mobile) */}
      <div className={`lg:hidden fixed top-16 left-0 right-0 z-20 px-4 transition-all duration-300 ${showSearch ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="relative bg-white shadow-md rounded-lg">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            style={{ borderColor: colors.border }}
          />
          <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Rotating Banner */}
      <div className="relative h-56 md:h-64 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${index === currentBanner ? 'transform translate-x-0' :
                index < currentBanner ? 'transform -translate-x-full' : 'transform translate-x-full'
              }`}
            style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
          >
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="text-white">
                <div className="flex items-center mb-3">
                  {banner.icon}
                  <h2 className="text-2xl md:text-3xl font-bold ml-3">{banner.title}</h2>
                </div>
                <p className="text-sm md:text-base mb-4 opacity-90">{banner.subtitle}</p>
                <div className="flex flex-wrap gap-2">
                  {banner.partners.map((partner, idx) => (
                    <span
                      key={idx}
                      className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backdropFilter: 'blur(5px)' }}
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 right-20 w-24 h-24 bg-white opacity-10 rounded-full hidden md:block"></div>
            <div className="absolute bottom-10 right-40 w-16 h-16 bg-white opacity-10 rounded-full hidden md:block"></div>
          </div>
        ))}

        {/* Banner navigation dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentBanner ? 'bg-white w-4' : 'bg-white bg-opacity-50'
                }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" style={{ borderColor: colors.border }}>
            {/* Search Bar (Desktop) */}
            <div className="hidden lg:block mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: colors.border }}
                />
                <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Mobile Search Toggle */}
            <div className="lg:hidden flex justify-center mb-4">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center justify-center w-full py-2 px-4 rounded-lg font-medium"
                style={{ backgroundColor: colors.primary, color: colors.white }}
              >
                <Search className="w-5 h-5 mr-2" />
                Search Products
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: colors.border }}
                >
                  <option value="">All Categories</option>
                  {Object.keys(categoriesData).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: colors.border }}
                >
                  <option value="">Sort By</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              {(searchTerm || selectedCategory || sortBy) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.background, color: colors.accent }}
                >
                  <Filter className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Latest Products Section */}
        {latestProducts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-bold" style={{ color: colors.accent }}>
                New Arrivals
              </h3>
              <button
                className="flex items-center text-sm font-medium transition-colors"
                style={{ color: colors.primary }}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {latestProducts.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                  style={{ borderColor: colors.border }}
                  onClick={() => handleProductClick(product.id, product.category)}
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                    {product.topBrand && (
                      <div
                        className="absolute top-2 left-2 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Award className="w-3 h-3" />
                        Top Brand
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2" style={{ color: colors.accent }}>
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-0.5 mb-1">
                      {renderStars(product.rating)}
                      <span className="text-xs ml-1" style={{ color: colors.textLight }}>({product.rating})</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="text-base font-bold flex items-center" style={{ color: colors.primaryDark }}>
                        <IndianRupee className="w-3 h-3 mr-0.5" />
                        {product.price}
                      </div>
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                        style={{ backgroundColor: colors.primary, color: colors.white }}
                      >
                        <ShoppingCart className="w-3 h-3" />
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 px-2" style={{ color: colors.accent }}>
            Shop by Categories
          </h2>
          <div className="relative">
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 w-max">
                {Object.keys(categoriesData).map(category => {
                  const IconComponent = categoryIcons[category] || Home;
                  const categoryCount = Object.values(products).filter(p => p.category === category).length;

                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSearchTerm('');
                        setSortBy('');
                      }}
                      className={`group flex-shrink-0 w-36 bg-white rounded-xl shadow-sm hover:shadow-md border p-4 transition-all duration-200 ${selectedCategory === category ? 'border-orange-500' : 'border-gray-200'
                        }`}
                      style={{
                        borderColor: selectedCategory === category ? colors.primary : colors.border
                      }}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${selectedCategory === category ? 'bg-orange-500' : 'bg-gray-800'
                            } group-hover:bg-orange-500`}
                        >
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h3
                          className="font-medium text-sm mb-1 transition-colors"
                          style={{
                            color: selectedCategory === category ? colors.primary : colors.accent
                          }}
                        >
                          {category.split(' ')[0]}
                        </h3>
                        <p className="text-xs" style={{ color: colors.textLight }}>
                          {categoryCount} items
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products by Category */}
        {Object.keys(categoriesData).map(categoryName => {
          const categoryProducts = getCategoryProducts(categoryName);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={categoryName} className="mb-8">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-lg font-bold" style={{ color: colors.accent }}>
                  {categoryName}
                </h3>
                <button
                  onClick={() => handleViewAll(categoryName)}
                  className="flex items-center text-sm font-medium transition-colors"
                  style={{ color: colors.primary }}
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="relative">
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4 w-max">
                    {categoryProducts.map((product, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-64 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                        style={{ borderColor: colors.border }}
                        onClick={() => handleProductClick(product.id, product.category)}
                      >
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                            }}
                          />
                          {product.topBrand && (
                            <div
                              className="absolute top-2 left-2 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                              style={{ backgroundColor: colors.primary }}
                            >
                              <Award className="w-3 h-3" />
                              Top Brand
                            </div>
                          )}
                        </div>

                        <div className="p-3">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2" style={{ color: colors.accent }}>
                            {product.name}
                          </h4>

                          <div className="flex items-center gap-0.5 mb-1">
                            {renderStars(product.rating)}
                            <span className="text-xs ml-1" style={{ color: colors.textLight }}>({product.rating})</span>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="text-base font-bold flex items-center" style={{ color: colors.primaryDark }}>
                              <IndianRupee className="w-3 h-3 mr-0.5" />
                              {product.price}
                            </div>
                            <button
                              className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                              style={{ backgroundColor: colors.primary, color: colors.white }}
                            >
                              <ShoppingCart className="w-3 h-3" />
                              Buy
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* All Products Section */}
        {selectedCategory && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 px-2" style={{ color: colors.accent }}>
              {selectedCategory} Products ({Object.keys(filteredProducts).length})
            </h3>

            {Object.keys(filteredProducts).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100" style={{ borderColor: colors.border }}>
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-1" style={{ color: colors.accent }}>No products found</h3>
                <p className="text-sm" style={{ color: colors.textLight }}>Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: colors.primary, color: colors.white }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(filteredProducts).map(([productId, product]) => (
                  <div
                    key={productId}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                    style={{ borderColor: colors.border }}
                    onClick={() => handleProductClick(productId, product.category)}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                      {product.topBrand && (
                        <div
                          className="absolute top-2 left-2 text-white px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Award className="w-3 h-3" />
                          Top Brand
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <div className="mb-1">
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: colors.background, color: colors.primary }}
                        >
                          {product.category}
                        </span>
                      </div>

                      <h4 className="font-medium text-sm mb-1 line-clamp-2" style={{ color: colors.accent }}>
                        {product.name}
                      </h4>

                      <div className="flex items-center gap-0.5 mb-1">
                        {renderStars(product.rating)}
                        <span className="text-xs ml-1" style={{ color: colors.textLight }}>({product.rating})</span>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="text-base font-bold flex items-center" style={{ color: colors.primaryDark }}>
                          <IndianRupee className="w-3 h-3 mr-0.5" />
                          {product.price}
                        </div>
                        <button
                          className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1"
                          style={{ backgroundColor: colors.primary, color: colors.white }}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4 px-2 text-center" style={{ color: colors.accent }}>
            Why Choose Us?
          </h2>

          <div className="relative">
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 w-max px-4 mx-auto">
                {/* Feature 1 */}
                <div
                  className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-center mb-1" style={{ color: colors.accent }}>Trusted Partners</h3>
                  <p className="text-xs text-center" style={{ color: colors.textLight }}>Amazon, Flipkart & Myntra</p>
                </div>

                {/* Feature 2 */}
                <div
                  className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-center mb-1" style={{ color: colors.accent }}>Fast Delivery</h3>
                  <p className="text-xs text-center" style={{ color: colors.textLight }}>Free delivery on most products</p>
                </div>

                {/* Feature 3 */}
                <div
                  className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto"
                    style={{ backgroundColor: colors.accent }}
                  >
                    <RotateCcw className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-center mb-1" style={{ color: colors.accent }}>Easy Returns</h3>
                  <p className="text-xs text-center" style={{ color: colors.textLight }}>Hassle-free returns</p>
                </div>

                {/* Feature 4 */}
                <div
                  className="flex-shrink-0 w-40 bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                  style={{ borderColor: colors.border }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm text-center mb-1" style={{ color: colors.accent }}>Quality Products</h3>
                  <p className="text-xs text-center" style={{ color: colors.textLight }}>Top brands only</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small Feature Icons */}
        <div
          className="mt-8 rounded-xl p-4"
          style={{ backgroundColor: colors.accent }}
        >
          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <IndianRupee className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-xs text-center">Affordable</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-xs text-center">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-xs text-center">Secure</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-xs text-center">24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;