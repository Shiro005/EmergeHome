import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import {
  Star, ShoppingCart, Truck, RotateCcw, Award, ExternalLink, Search,
  Filter, ChevronRight, Menu, Heart, User, MapPin, Gift, Zap,
  Home as HomeIcon, Smartphone, Shirt, Book, Gamepad2, Baby, Car, PaintBucket,
  Utensils, Sofa, Bed, ShowerHead, Lock, Lightbulb, ChevronLeft,
  TrendingUp, Clock, Shield, IndianRupee, X, Check
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [latestProducts, setLatestProducts] = useState([]);
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const searchRef = useRef(null);
  const [isSearchSticky, setIsSearchSticky] = useState(false);

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
  };

  // Handle scroll for sticky search
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSearchSticky(true);
      } else {
        setIsSearchSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search when shown on mobile
  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  // Rotate banners with fade animation
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

    if (selectedCategories.length > 0) {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        const product = filtered[key];
        if (selectedCategories.includes(product.category)) {
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
  }, [searchTerm, selectedCategories, sortBy, products]);

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
    setSelectedCategories([]);
    setSortBy('');
  };

  const getCategoryProducts = (categoryName) => {
    return Object.values(products).filter(product =>
      product.category === categoryName
    ).slice(0, 4);
  };

  const handleProductClick = (productId, category) => {
    navigate(`/product/${productId}`, {
      state: {
        product: products[productId],
        categoryName: category
      }
    });
  };

  const handleViewAll = (category) => {
    navigate(`/products`, {
      state: {
        products: Object.values(products).filter(p => p.category === category),
        categoryName: category
      }
    });
  };

  const handleViewNewArrivals = () => {
    navigate(`/products`, {
      state: {
        products: latestProducts,
        title: "New Arrivals"
      }
    });
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const toggleSubCategory = (category, subCategory) => {
    setExpandedCategories(prev => ({
      ...prev,
      [`${category}-${subCategory}`]: !prev[`${category}-${subCategory}`]
    }));
  };

  const handleCategorySelect = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const applyCategoryFilters = () => {
    setShowCategorySidebar(false);
    // The useEffect will automatically update filteredProducts based on selectedCategories
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold" style={{ color: colors.accent }}>Loading Premium Products...</h2>
          <p className="text-gray-600">Curating the best home essentials for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Sticky Search Bar (Desktop) */}
      <div className={`hidden lg:block ${isSearchSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md py-2' : ''}`}
        style={{ 
          backgroundColor: isSearchSticky ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Mobile Search Bar */}
      <div className={`lg:hidden fixed top-16 left-0 right-0 z-50 px-4 transition-all duration-300 ${showSearch ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="relative py-2">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            style={{ borderColor: colors.border }}
          />
          <button 
            onClick={() => setShowSearch(false)}
            className="absolute right-12 top-3.5 text-gray-400 w-5 h-5"
          >
            <X className="w-5 h-5" />
          </button>
          <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Mobile Search Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          style={{ backgroundColor: colors.primary, color: colors.white }}
        >
          <Search className="w-6 h-6" />
        </button>
      </div>

      {/* Rotating Banner with Fade Animation */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
          >
            <div 
              className="absolute inset-0 bg-black opacity-40"
              style={{
                background: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)`
              }}
            ></div>
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
              <div className="text-white max-w-md">
                <div className="flex items-center mb-4">
                  {banner.icon}
                  <h2 className="text-3xl md:text-4xl font-bold ml-3">{banner.title}</h2>
                </div>
                <p className="text-lg md:text-xl mb-6 opacity-90">{banner.subtitle}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {banner.partners.map((partner, idx) => (
                    <span
                      key={idx}
                      className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backdropFilter: 'blur(5px)' }}
                    >
                      {partner}
                    </span>
                  ))}
                </div>
                <button
                  className="px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                  style={{ backgroundColor: banner.buttonColor }}
                >
                  {banner.buttonText}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Banner navigation dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentBanner ? 'bg-white w-6' : 'bg-white bg-opacity-50'}`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" style={{ borderColor: colors.border }}>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Category Filter Button */}
              <button
                onClick={() => setShowCategorySidebar(true)}
                className="flex-1 px-4 py-3 bg-gray-50 rounded-lg flex items-center justify-between"
                style={{ border: `1px solid ${colors.border}` }}
              >
                <span className="text-sm font-medium" style={{ color: colors.textDark }}>
                  {selectedCategories.length > 0 ? 
                    `${selectedCategories.length} category selected` : 
                    'All Categories'}
                </span>
                <Filter className="w-5 h-5" style={{ color: colors.textLight }} />
              </button>

              {/* Sort By Dropdown */}
              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  style={{ borderColor: colors.border }}
                >
                  <option value="">Sort By: Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || selectedCategories.length > 0 || sortBy) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.background, color: colors.accent }}
                >
                  <X className="w-5 h-5" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Sidebar */}
        {showCategorySidebar && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setShowCategorySidebar(false)}
            ></div>
            <div className="absolute inset-y-0 right-0 max-w-full flex">
              <div className="relative w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-6 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium" style={{ color: colors.accent }}>
                          Filter by Category
                        </h2>
                        <button
                          onClick={() => setShowCategorySidebar(false)}
                          className="p-1 rounded-md hover:bg-gray-100"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>
                    </div>

                    <div className="px-4 py-4">
                      {Object.keys(categoriesData).map(category => (
                        <div key={category} className="mb-4">
                          <div 
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => toggleCategory(category)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategorySelect(category)}
                                onClick={(e) => e.stopPropagation()}
                                className="h-4 w-4 rounded border-gray-300 mr-3"
                                style={{ accentColor: colors.primary }}
                              />
                              <span className="font-medium">{category}</span>
                            </div>
                            <ChevronRight 
                              className={`w-5 h-5 transition-transform ${expandedCategories[category] ? 'transform rotate-90' : ''}`}
                            />
                          </div>

                          {expandedCategories[category] && (
                            <div className="ml-7 mt-2">
                              {Object.keys(categoriesData[category]).map(subCategory => (
                                <div key={subCategory} className="mb-3">
                                  {subCategory !== '_uncategorized' && (
                                    <div 
                                      className="flex justify-between items-center cursor-pointer mb-2"
                                      onClick={() => toggleSubCategory(category, subCategory)}
                                    >
                                      <span className="text-sm font-medium">{subCategory}</span>
                                      <ChevronRight 
                                        className={`w-4 h-4 transition-transform ${expandedCategories[`${category}-${subCategory}`] ? 'transform rotate-90' : ''}`}
                                      />
                                    </div>
                                  )}

                                  {(subCategory === '_uncategorized' || expandedCategories[`${category}-${subCategory}`]) && (
                                    <div className="ml-4 space-y-2">
                                      {categoriesData[category][subCategory].map(item => (
                                        <div key={item} className="flex items-center">
                                          <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(item)}
                                            onChange={() => handleCategorySelect(item)}
                                            className="h-4 w-4 rounded border-gray-300 mr-2"
                                            style={{ accentColor: colors.primary }}
                                          />
                                          <span className="text-sm">{item}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-4">
                    <button
                      onClick={applyCategoryFilters}
                      className="w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                      style={{ backgroundColor: colors.primary, color: colors.white }}
                    >
                      <Check className="w-5 h-5" />
                      Apply Filters ({selectedCategories.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Latest Products Section */}
        {latestProducts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: colors.accent }}>
                New Arrivals
              </h2>
              <button
                onClick={handleViewNewArrivals}
                className="flex items-center text-sm font-medium transition-colors hover:text-orange-600"
                style={{ color: colors.primary }}
              >
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {latestProducts.map((product, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
                  style={{ borderColor: colors.border }}
                  onClick={() => handleProductClick(product.id, product.category)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                    {product.topBrand && (
                      <div
                        className="absolute top-2 left-2 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{ backgroundColor: colors.primary }}
                      >
                        <Award className="w-3 h-3" />
                        Top Brand
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-4">
                    <h4 className="font-medium text-base mb-2 line-clamp-2" style={{ color: colors.accent }}>
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-0.5 mb-3">
                      {renderStars(product.rating)}
                      <span className="text-xs ml-1" style={{ color: colors.textLight }}>({product.rating})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold flex items-center" style={{ color: colors.primaryDark }}>
                        <IndianRupee className="w-4 h-4 mr-0.5" />
                        {product.price.toLocaleString()}
                      </div>
                      <button
                        className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-orange-600 transition-colors"
                        style={{ backgroundColor: colors.primary, color: colors.white }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle add to cart
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shop by Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>
            Shop by Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Object.keys(categoriesData).map(category => {
              const IconComponent = categoryIcons[category] || HomeIcon;
              const categoryCount = Object.values(products).filter(p => p.category === category).length;

              return (
                <div
                  key={category}
                  onClick={() => handleViewAll(category)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all duration-300 hover:shadow-md cursor-pointer group"
                  style={{ borderColor: colors.border }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all group-hover:bg-orange-100"
                      style={{ backgroundColor: colors.background }}
                    >
                      <IconComponent className="w-6 h-6" style={{ color: colors.primary }} />
                    </div>
                    <h3 className="font-medium text-sm mb-1" style={{ color: colors.accent }}>
                      {category}
                    </h3>
                    <p className="text-xs" style={{ color: colors.textLight }}>
                      {categoryCount} items
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Products by Category */}
        {Object.keys(categoriesData).map(categoryName => {
          const categoryProducts = getCategoryProducts(categoryName);
          if (categoryProducts.length === 0) return null;

          return (
            <div key={categoryName} className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.accent }}>
                  {categoryName}
                </h2>
                <button
                  onClick={() => handleViewAll(categoryName)}
                  className="flex items-center text-sm font-medium transition-colors hover:text-orange-600"
                  style={{ color: colors.primary }}
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categoryProducts.map((product, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
                    style={{ borderColor: colors.border }}
                    onClick={() => handleProductClick(product.id, product.category)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                        }}
                      />
                      {product.topBrand && (
                        <div
                          className="absolute top-2 left-2 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                          style={{ backgroundColor: colors.primary }}
                        >
                          <Award className="w-3 h-3" />
                          Top Brand
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-4">
                      <h4 className="font-medium text-base mb-2 line-clamp-2" style={{ color: colors.accent }}>
                        {product.name}
                      </h4>

                      <div className="flex items-center gap-0.5 mb-3">
                        {renderStars(product.rating)}
                        <span className="text-xs ml-1" style={{ color: colors.textLight }}>({product.rating})</span>
                      </div>

                                           <div className="flex items-center justify-between">
                        <div className="text-lg font-bold flex items-center" style={{ color: colors.primaryDark }}>
                          <IndianRupee className="w-4 h-4 mr-0.5" />
                          {product.price.toLocaleString()}
                        </div>
                        <button
                          className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-orange-600 transition-colors"
                          style={{ backgroundColor: colors.primary, color: colors.white }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle add to cart
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Product Search Results */}
        {searchTerm && Object.keys(filteredProducts).length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center" style={{ borderColor: colors.border }}>
            <Search className="w-12 h-12 mx-auto mb-4" style={{ color: colors.textLight }} />
            <h3 className="text-xl font-medium mb-2" style={{ color: colors.accent }}>No products found</h3>
            <p className="mb-4" style={{ color: colors.textLight }}>
              We couldn't find any products matching "{searchTerm}"
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 rounded-lg font-medium"
              style={{ backgroundColor: colors.primary, color: colors.white }}
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Features Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-12" style={{ borderColor: colors.border }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Truck className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: colors.accent }}>Free Shipping</h4>
                <p className="text-sm" style={{ color: colors.textLight }}>On orders over ₹999</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <RotateCcw className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: colors.accent }}>Easy Returns</h4>
                <p className="text-sm" style={{ color: colors.textLight }}>30-day return policy</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Shield className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: colors.accent }}>Secure Payment</h4>
                <p className="text-sm" style={{ color: colors.textLight }}>100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-orange-100 p-3 rounded-full mr-4">
                <Award className="w-6 h-6" style={{ color: colors.primary }} />
              </div>
              <div>
                <h4 className="font-medium mb-1" style={{ color: colors.accent }}>Quality Products</h4>
                <p className="text-sm" style={{ color: colors.textLight }}>Premium brands</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;