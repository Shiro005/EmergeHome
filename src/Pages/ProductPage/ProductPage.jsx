import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { database } from '../../Firebase/Firebase';
import { ref, onValue } from 'firebase/database';
import {
  Star, ShoppingCart, Filter, ChevronRight, ChevronLeft, 
  X, Check, Search, IndianRupee, Award, Heart
} from 'lucide-react';

const ProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [showCategorySidebar, setShowCategorySidebar] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const searchRef = useRef(null);
  const [isSearchSticky, setIsSearchSticky] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  // Get initial filters from navigation state
  const { state } = location;
  const initialCategory = state?.categoryName || '';
  const initialProducts = state?.products || [];
  const initialSearchTerm = state?.searchTerm || '';
  const pageTitle = state?.title || 'All Products';

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

  // Categories data (same as in Home)
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

  // Fetch products from Firebase if not passed from Home
  useEffect(() => {
    if (initialProducts.length === 0) {
      const productsRef = ref(database, 'products');
      const unsubscribe = onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProducts(data);
          setFilteredProducts(Object.values(data));
        } else {
          setProducts({});
          setFilteredProducts([]);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      const productsMap = {};
      initialProducts.forEach(p => {
        productsMap[p.id] = p;
      });
      setProducts(productsMap);
      setFilteredProducts(initialProducts);
      setLoading(false);
    }
  }, [initialProducts]);

  // Set initial filters from navigation state
  useEffect(() => {
    if (initialCategory) {
      // Find all subcategories and items under the initial category
      const allCategoryItems = [];
      const category = categoriesData[initialCategory];
      
      if (category) {
        Object.keys(category).forEach(subCategory => {
          allCategoryItems.push(...category[subCategory]);
        });
      }
      
      setSelectedCategories([initialCategory, ...allCategoryItems]);
    }
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialCategory, initialSearchTerm]);

  // Filter and sort products
  useEffect(() => {
    let filtered = Object.values(products);

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product => 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.details?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category) ||
        selectedCategories.some(cat => 
          Object.values(categoriesData).some(categoryData => 
            Object.values(categoryData).some(subCategories => 
              subCategories.includes(product.category)
            )
          )
        )
      );
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply rating filter
    if (ratingFilter > 0) {
      filtered = filtered.filter(product => product.rating >= ratingFilter);
    }

    if (sortBy !== '') {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low': return a.price - b.price;
          case 'price-high': return b.price - a.price;
          case 'rating': return b.rating - a.rating;
          case 'name': return a.name?.localeCompare(b.name) || 0;
          default: return 0;
        }
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedCategories, sortBy, products, priceRange, ratingFilter]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-[#FFB74D] text-[#FFB74D]" />);
    }
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-[#FFE0B2] text-[#FFB74D]" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setSortBy('');
    setPriceRange([0, 50000]);
    setRatingFilter(0);
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

  const handleSubCategorySelect = (subCategoryItems, isSelected) => {
    if (isSelected) {
      setSelectedCategories(selectedCategories.filter(c => !subCategoryItems.includes(c)));
    } else {
      setSelectedCategories([...new Set([...selectedCategories, ...subCategoryItems])]);
    }
  };

  const applyCategoryFilters = () => {
    setShowCategorySidebar(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`, {
      state: {
        product: products[productId],
        categoryName: products[productId].category
      }
    });
  };

  // Get random related products (excluding current filtered products)
  const getRelatedProducts = () => {
    const allProducts = Object.values(products);
    const filteredIds = filteredProducts.map(p => p.id);
    const availableProducts = allProducts.filter(p => !filteredIds.includes(p.id));
    
    // Shuffle array and get first 10
    return [...availableProducts].sort(() => 0.5 - Math.random()).slice(0, 10);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold" style={{ color: colors.accent }}>Loading Products...</h2>
          <p className="text-gray-600">Getting the best products for you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Sticky Search Bar */}
      <div className={`${isSearchSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md py-2' : ''}`}
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
              ref={searchRef}
            />
            <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Title and Results Count */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0" style={{ color: colors.accent }}>
            {pageTitle}
          </h1>
          <p className="text-sm" style={{ color: colors.textLight }}>
            Showing {filteredProducts.length} products
          </p>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-4" style={{ borderColor: colors.border }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium" style={{ color: colors.accent }}>Filters</h3>
                {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000 || ratingFilter > 0) && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm flex items-center gap-1"
                    style={{ color: colors.primary }}
                  >
                    <X className="w-4 h-4" />
                    Clear all
                  </button>
                )}
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3" style={{ color: colors.accent }}>Price Range</h4>
                <div className="px-1">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full mb-2 accent-orange-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full mb-3 accent-orange-500"
                  />
                  <div className="flex justify-between text-sm">
                    <span>₹{priceRange[0].toLocaleString()}</span>
                    <span>₹{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Ratings Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-3" style={{ color: colors.accent }}>Customer Ratings</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={ratingFilter === rating}
                        onChange={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                        className="h-4 w-4 rounded-full border-gray-300 mr-2"
                        style={{ accentColor: colors.primary }}
                      />
                      <div className="flex items-center">
                        {renderStars(rating)}
                        <span className="text-sm ml-1">& Up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories Filter */}
              <div>
                <h4 className="font-medium mb-3" style={{ color: colors.accent }}>Categories</h4>
                <div className="space-y-4">
                  {Object.keys(categoriesData).map(category => (
                    <div key={category}>
                      <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggleCategory(category)}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">{category}</span>
                        </div>
                        <ChevronRight 
                          className={`w-5 h-5 transition-transform ${expandedCategories[category] ? 'transform rotate-90' : ''}`}
                        />
                      </div>

                      {expandedCategories[category] && (
                        <div className="ml-2 mt-2 pl-2 border-l-2" style={{ borderColor: colors.border }}>
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
                                <div className="ml-2 space-y-2">
                                  {categoriesData[category][subCategory].map(item => (
                                    <label key={item} className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(item)}
                                        onChange={() => handleCategorySelect(item)}
                                        className="h-4 w-4 rounded border-gray-300 mr-2"
                                        style={{ accentColor: colors.primary }}
                                      />
                                      <span className="text-sm">{item}</span>
                                    </label>
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
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filters Section - Mobile */}
            <div className="md:hidden mb-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" style={{ borderColor: colors.border }}>
                <div className="flex gap-4">
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
                </div>

                {/* Active Filters */}
                {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 50000 || ratingFilter > 0) && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCategories.length > 0 && (
                      <div className="text-xs px-3 py-1.5 rounded-full bg-gray-100 flex items-center gap-1">
                        <span>{selectedCategories.length} categories</span>
                        <button onClick={() => setSelectedCategories([])}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                      <div className="text-xs px-3 py-1.5 rounded-full bg-gray-100 flex items-center gap-1">
                        <span>₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}</span>
                        <button onClick={() => setPriceRange([0, 50000])}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    {ratingFilter > 0 && (
                      <div className="text-xs px-3 py-1.5 rounded-full bg-gray-100 flex items-center gap-1">
                        <span>{ratingFilter}+ stars</span>
                        <button onClick={() => setRatingFilter(0)}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
                      style={{ borderColor: colors.border }}
                      onClick={() => handleProductClick(product.id)}
                    >
                      {/* Product Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                          }}
                        />
                        <button 
                          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle wishlist
                          }}
                        >
                          <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                        </button>
                        {product.discount && (
                          <div className="absolute top-2 left-2 px-2 py-1 rounded bg-red-500 text-white text-xs font-bold">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        <h3 className="text-md font-medium mb-1 line-clamp-2" style={{ color: colors.accent }}>
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-0.5 mb-2">
                          {renderStars(product.rating)}
                          <span className="text-xs ml-1" style={{ color: colors.textLight }}>
                            ({product.ratingCount || 0})
                          </span>
                        </div>

                        <div className="mb-2">
                          <div className="text-lg font-bold flex items-center" style={{ color: colors.primaryDark }}>
                            <IndianRupee className="w-4 h-4 mr-0.5" />
                            {product.price.toLocaleString()}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="flex items-center text-xs" style={{ color: colors.textLight }}>
                              <span className="line-through mr-1">
                                <IndianRupee className="inline w-3 h-3" />
                                {product.originalPrice.toLocaleString()}
                              </span>
                              {product.discount && (
                                <span className="text-green-600">{product.discount}% off</span>
                              )}
                            </div>
                          )}
                        </div>

                        {product.topBrand && (
                          <div className="text-xs px-2 py-1 rounded-full bg-orange-100 inline-flex items-center gap-1 mb-2"
                            style={{ color: colors.primaryDark }}
                          >
                            <Award className="w-3 h-3" />
                            Top Brand
                          </div>
                        )}

                        <button
                          className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-orange-600 transition-colors"
                          style={{ backgroundColor: colors.primary, color: colors.white }}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle add to cart
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 flex items-center"
                        style={{ 
                          borderColor: colors.border,
                          color: currentPage === 1 ? colors.textLight : colors.textDark
                        }}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${currentPage === page ? 'bg-orange-100' : 'bg-white hover:bg-gray-50'}`}
                          style={{ 
                            borderColor: colors.border,
                            color: currentPage === page ? colors.primaryDark : colors.textDark
                          }}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 flex items-center"
                        style={{ 
                          borderColor: colors.border,
                          color: currentPage === totalPages ? colors.textLight : colors.textDark
                        }}
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </nav>
                  </div>
                )}

                {/* Related Products (shown after every 10 products) */}
                {currentPage === totalPages && getRelatedProducts().length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-xl font-bold mb-4" style={{ color: colors.accent }}>
                      You Might Also Like
                    </h2>
                    <div className="relative">
                      <div className="overflow-x-auto pb-4">
                        <div className="flex space-x-4">
                          {getRelatedProducts().map(product => (
                            <div
                              key={product.id}
                              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex-shrink-0 w-48"
                              style={{ borderColor: colors.border }}
                              onClick={() => handleProductClick(product.id)}
                            >
                              <div className="h-32 overflow-hidden">
                                <img
                                  src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Product+Image'}
                                  alt={product.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                  }}
                                />
                              </div>
                              <div className="p-3">
                                <h3 className="text-sm font-medium mb-1 line-clamp-2" style={{ color: colors.accent }}>
                                  {product.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm font-bold flex items-center" style={{ color: colors.primaryDark }}>
                                    <IndianRupee className="w-3 h-3 mr-0.5" />
                                    {product.price.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center" style={{ borderColor: colors.border }}>
                <Search className="w-12 h-12 mx-auto mb-4" style={{ color: colors.textLight }} />
                <h3 className="text-xl font-medium mb-2" style={{ color: colors.accent }}>No products found</h3>
                <p className="mb-4" style={{ color: colors.textLight }}>
                  {searchTerm ? `We couldn't find any products matching "${searchTerm}"` : 'No products match your filters'}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: colors.primary, color: colors.white }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Sidebar - Mobile */}
      {showCategorySidebar && (
        <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
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
                    {/* Price Range Filter */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3" style={{ color: colors.accent }}>Price Range</h4>
                      <div className="px-1">
                        <input
                          type="range"
                          min="0"
                          max="50000"
                          step="1000"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="w-full mb-2 accent-orange-500"
                        />
                        <input
                          type="range"
                          min="0"
                          max="50000"
                          step="1000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-full mb-3 accent-orange-500"
                        />
                        <div className="flex justify-between text-sm">
                                                   <span>₹{priceRange[0].toLocaleString()}</span>
                          <span>₹{priceRange[1].toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Ratings Filter */}
                    <div className="mb-6">
                      <h4 className="font-medium mb-3" style={{ color: colors.accent }}>Customer Ratings</h4>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map(rating => (
                          <label key={rating} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="rating"
                              checked={ratingFilter === rating}
                              onChange={() => setRatingFilter(ratingFilter === rating ? 0 : rating)}
                              className="h-4 w-4 rounded-full border-gray-300 mr-2"
                              style={{ accentColor: colors.primary }}
                            />
                            <div className="flex items-center">
                              {renderStars(rating)}
                              <span className="text-sm ml-1">& Up</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Categories Filter */}
                    <div>
                      <h4 className="font-medium mb-3" style={{ color: colors.accent }}>Categories</h4>
                      <div className="space-y-4">
                        {Object.keys(categoriesData).map(category => (
                          <div key={category}>
                            <div 
                              className="flex justify-between items-center cursor-pointer"
                              onClick={() => toggleCategory(category)}
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(category)}
                                  onChange={() => handleCategorySelect(category)}
                                  className="h-4 w-4 rounded border-gray-300 mr-2"
                                  style={{ accentColor: colors.primary }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="font-medium">{category}</span>
                              </div>
                              <ChevronRight 
                                className={`w-5 h-5 transition-transform ${expandedCategories[category] ? 'transform rotate-90' : ''}`}
                              />
                            </div>

                            {expandedCategories[category] && (
                              <div className="ml-6 mt-2 space-y-3">
                                {Object.keys(categoriesData[category]).map(subCategory => (
                                  <div key={subCategory}>
                                    {subCategory !== '_uncategorized' && (
                                      <div 
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleSubCategory(category, subCategory)}
                                      >
                                        <div className="flex items-center">
                                          <input
                                            type="checkbox"
                                            checked={categoriesData[category][subCategory].every(item => 
                                              selectedCategories.includes(item)
                                            )}
                                            onChange={(e) => handleSubCategorySelect(
                                              categoriesData[category][subCategory],
                                              e.target.checked
                                            )}
                                            className="h-4 w-4 rounded border-gray-300 mr-2"
                                            style={{ accentColor: colors.primary }}
                                            onClick={(e) => e.stopPropagation()}
                                          />
                                          <span className="text-sm font-medium">{subCategory}</span>
                                        </div>
                                        <ChevronRight 
                                          className={`w-4 h-4 transition-transform ${expandedCategories[`${category}-${subCategory}`] ? 'transform rotate-90' : ''}`}
                                        />
                                      </div>
                                    )}

                                    {(subCategory === '_uncategorized' || expandedCategories[`${category}-${subCategory}`]) && (
                                      <div className="ml-6 space-y-2">
                                        {categoriesData[category][subCategory].map(item => (
                                          <label key={item} className="flex items-center">
                                            <input
                                              type="checkbox"
                                              checked={selectedCategories.includes(item)}
                                              onChange={() => handleCategorySelect(item)}
                                              className="h-4 w-4 rounded border-gray-300 mr-2"
                                              style={{ accentColor: colors.primary }}
                                            />
                                            <span className="text-sm">{item}</span>
                                          </label>
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
                  </div>
                </div>

                <div className="border-t border-gray-200 p-4" style={{ borderColor: colors.border }}>
                  <div className="flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 text-sm font-medium"
                      style={{ borderColor: colors.border }}
                    >
                      Clear All
                    </button>
                    <button
                      onClick={applyCategoryFilters}
                      className="flex-1 px-4 py-3 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: colors.primary, color: colors.white }}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;