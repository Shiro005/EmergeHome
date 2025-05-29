import { Search, MapPin, ChevronDown, Menu, X, Clock, TrendingUp, ChevronRight, Star, Filter, ShoppingCart, Heart, User, Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    "LED ceiling lights",
    "Dining table set",
    "Sofa cushions",
    "Coffee table",
    "Wall art"
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  
  const searchInputRef = useRef(null);
  const headerRef = useRef(null);

  const categories = [
    "All", "Furniture", "Lighting", "Décor", "Outdoor", "Kitchen", 
    "Bedroom", "Living Room", "Bathroom", "Office", "Storage"
  ];

  // Sample product data for search functionality
  const products = [
    { id: 1, name: "LED Ceiling Light Modern", category: "Lighting", price: "₹2,999", rating: 4.5, image: "💡" },
    { id: 2, name: "Dining Table Set 4 Seater", category: "Furniture", price: "₹15,999", rating: 4.2, image: "🪑" },
    { id: 3, name: "Velvet Sofa Cushions", category: "Décor", price: "₹899", rating: 4.7, image: "🛋️" },
    { id: 4, name: "Coffee Table Glass Top", category: "Furniture", price: "₹8,999", rating: 4.3, image: "☕" },
    { id: 5, name: "Wall Art Canvas Print", category: "Décor", price: "₹1,299", rating: 4.6, image: "🖼️" },
    { id: 6, name: "Kitchen Storage Organizer", category: "Kitchen", price: "₹599", rating: 4.4, image: "🧰" },
    { id: 7, name: "Bed Sheet Cotton Set", category: "Bedroom", price: "₹1,499", rating: 4.5, image: "🛏️" },
    { id: 8, name: "Table Lamp Adjustable", category: "Lighting", price: "₹1,799", rating: 4.1, image: "🔦" },
    { id: 9, name: "Storage Box Plastic", category: "Storage", price: "₹299", rating: 4.0, image: "📦" },
    { id: 10, name: "Curtains Blackout Thermal", category: "Décor", price: "₹999", rating: 4.3, image: "🪟" },
    { id: 11, name: "Plant Pot Ceramic", category: "Décor", price: "₹449", rating: 4.8, image: "🪴" },
    { id: 12, name: "Floor Lamp Arc Design", category: "Lighting", price: "₹3,499", rating: 4.4, image: "💡" },
    { id: 13, name: "Bookshelf Wooden 5 Tier", category: "Furniture", price: "₹4,999", rating: 4.2, image: "📚" },
    { id: 14, name: "Office Chair Ergonomic", category: "Office", price: "₹7,999", rating: 4.6, image: "💺" },
    { id: 15, name: "Outdoor Dining Set", category: "Outdoor", price: "₹19,999", rating: 4.5, image: "🌿" }
  ];

  const searchSuggestions = {
    "All": [
      "LED ceiling lights", "Dining table set", "Sofa cushions", "Wall art", "Kitchen organizer",
      "Bed sheets", "Table lamps", "Storage boxes", "Curtains", "Plant pots"
    ],
    "Furniture": [
      "Dining table", "Sofa set", "Coffee table", "Wardrobe", "Bed frame",
      "Bookshelf", "Office chair", "Side table", "TV stand", "Dresser"
    ],
    "Lighting": [
      "LED ceiling lights", "Table lamps", "Floor lamps", "Pendant lights", "Wall sconces",
      "Chandelier", "Desk lamp", "Night light", "String lights", "Track lighting"
    ],
    "Décor": [
      "Wall art", "Vases", "Picture frames", "Mirrors", "Candles",
      "Decorative pillows", "Wall stickers", "Sculptures", "Clocks", "Rugs"
    ],
    "Kitchen": [
      "Kitchen organizer", "Spice rack", "Cutting board", "Storage containers", "Dish rack",
      "Kitchen towels", "Cookware set", "Utensil holder", "Garbage bin", "Bar stools"
    ]
  };

  const trendingSearches = [
    "Smart home devices", "Minimalist furniture", "Boho décor", "LED strip lights", "Storage solutions"
  ];

  // Enhanced search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      // Filter products based on search query and category
      let filtered = products.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesQuery && matchesCategory;
      });

      // Also include suggestion matches
      const categoryData = searchSuggestions[selectedCategory] || searchSuggestions["All"];
      const suggestionMatches = categoryData.filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);

      setFilteredSuggestions(suggestionMatches);
      setSearchResults(filtered.slice(0, 6)); // Limit to 6 results
    } else {
      setFilteredSuggestions([]);
      setSearchResults([]);
    }
  }, [searchQuery, selectedCategory]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        closeDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      console.log(`Searching for "${query}" in category "${selectedCategory}"`);
      
      // Add to search history if not already present
      if (!searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev.slice(0, 4)]);
      }
      
      // Hide suggestions
      setShowSearchSuggestions(false);
      
      // Keep search query for results
      if (query !== searchQuery) {
        setSearchQuery(query);
      }
      
      // Simulate search action with better feedback
      const matchingProducts = products.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
        return matchesQuery && matchesCategory;
      });
      
      alert(`Found ${matchingProducts.length} results for "${query}" in ${selectedCategory} category`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSearchSuggestions(false);
    }
  };

  const handleSearchFocus = () => {
    setShowSearchSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleProductClick = (product) => {
    console.log(`Viewing product: ${product.name}`);
    setShowSearchSuggestions(false);
    alert(`Viewing ${product.name} - ${product.price}`);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const removeFromHistory = (item, e) => {
    e.stopPropagation();
    setSearchHistory(prev => prev.filter(historyItem => historyItem !== item));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const handleLocationSelect = (location) => {
    setIsLocationDropdownOpen(false);
    console.log(`Location changed to: ${location}`);
  };

  const closeDropdowns = () => {
    setIsLocationDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
    setShowSearchSuggestions(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    closeDropdowns();
  };

  return (
    <div className="sticky top-0 z-50" ref={headerRef}>
      {/* Top Announcement Bar with Animation */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 px-4 text-sm font-medium relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
        <div className="relative z-10">
          🎉 Free shipping on orders over ₹999 | Use code: <span className="font-bold bg-white/20 px-2 py-1 rounded">HOME10</span> for 10% off
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl backdrop-blur-sm">
        <div className="container mx-auto px-4">
          {/* Mobile Top Bar */}
          <div className="flex items-center justify-between py-4 md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 active:scale-95"
            >
              <Menu size={24} />
            </button>
            
            <div className="text-2xl font-bold">
              <span className="text-orange-400 drop-shadow-lg">Emerge</span>
              <span className="text-white">Home</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200">
                <Heart size={20} />
              </button>
              <button className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 relative">
                <ShoppingCart size={20} />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </button>
            </div>
          </div>

          {/* Main Header Content */}
          <div className="hidden md:flex items-center justify-between py-4">
            {/* Logo with Glow Effect */}
            <div className="flex-shrink-0 mr-8">
              <div className="text-3xl font-bold tracking-tight cursor-pointer hover:scale-105 transition-all duration-300 group">
                <span className="text-orange-400 drop-shadow-lg group-hover:text-orange-300">Emerge</span>
                <span className="text-white group-hover:text-gray-200">Home</span>
              </div>
            </div>

            {/* Enhanced Delivery Location */}
            <div className="hidden lg:flex items-center text-sm cursor-pointer hover:bg-white/10 px-4 py-3 rounded-xl relative transition-all duration-200 mr-4 group">
              <div onClick={(e) => {
                e.stopPropagation();
                setIsLocationDropdownOpen(!isLocationDropdownOpen);
                setIsCategoryDropdownOpen(false);
                setShowSearchSuggestions(false);
              }}>
                <MapPin size={18} className="text-orange-400 mr-3 group-hover:text-orange-300" />
                <div>
                  <div className="text-xs text-gray-300 group-hover:text-gray-200">Deliver to</div>
                  <div className="font-semibold text-white flex items-center gap-1">
                    Nagpur 440001 <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                  </div>
                </div>
              </div>
              
              {isLocationDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 bg-white text-black rounded-xl shadow-2xl p-6 z-50 w-72 border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                  <div className="font-bold mb-2 text-gray-800 text-lg">Choose your location</div>
                  <div className="text-sm text-gray-600 mb-4">Delivery options and fees may vary</div>
                  <div className="space-y-2">
                    {["Nagpur, Maharashtra", "Mumbai, Maharashtra", "Pune, Maharashtra", "Delhi, India", "Bangalore, Karnataka"].map((location) => (
                      <div 
                        key={location}
                        className="hover:bg-orange-50 p-3 rounded-lg cursor-pointer transition-all duration-200 text-sm flex items-center gap-3 group/item"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <MapPin size={16} className="text-orange-400 group-hover/item:text-orange-500" />
                        {location}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Search Bar */}
            <div className="flex-1 max-w-3xl mx-6 relative">
              <div className="flex rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-2 border-transparent hover:border-orange-200">
                {/* Category Dropdown with Enhanced Styling */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                      setIsLocationDropdownOpen(false);
                      setShowSearchSuggestions(false);
                    }}
                    className="bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-800 px-5 py-4 border-r border-gray-300 flex items-center gap-3 text-sm font-semibold min-w-[140px] transition-all duration-200 group"
                  >
                    <Filter size={16} className="text-orange-500 group-hover:text-orange-600" />
                    <span className="truncate">{selectedCategory}</span>
                    <ChevronDown size={16} className={`transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-white text-black rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50 w-56 border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                      {categories.map((category) => (
                        <div
                          key={category}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategorySelect(category);
                          }}
                          className={`px-5 py-4 hover:bg-orange-50 cursor-pointer text-sm transition-all duration-200 flex items-center gap-3 ${
                            category === selectedCategory ? 'bg-orange-100 text-orange-700 font-semibold border-r-4 border-orange-400' : ''
                          }`}
                        >
                          <span className="text-lg">
                            {category === "All" ? "🏠" : 
                             category === "Furniture" ? "🪑" :
                             category === "Lighting" ? "💡" :
                             category === "Décor" ? "🎨" :
                             category === "Outdoor" ? "🌿" :
                             category === "Kitchen" ? "🍳" :
                             category === "Bedroom" ? "🛏️" :
                             category === "Living Room" ? "🛋️" :
                             category === "Bathroom" ? "🚿" :
                             category === "Office" ? "💼" : "📦"}
                          </span>
                          {category}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Enhanced Search Input */}
                <div className="flex-1 relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onFocus={handleSearchFocus}
                    placeholder={`Search ${selectedCategory !== 'All' ? selectedCategory.toLowerCase() : 'products'}... Try "LED lights" or "dining table"`}
                    className="w-full px-6 py-4 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-inset placeholder-gray-500 text-base"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Enhanced Clear Search Button */}
                  {searchQuery && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Enhanced Search Button */}
                <button
                  onClick={() => handleSearch()}
                  className="bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 px-8 py-4 transition-all duration-200 flex items-center justify-center group active:scale-95"
                >
                  <Search className="text-white group-hover:scale-110 transition-transform duration-200" size={22} />
                </button>
              </div>

              {/* Enhanced Search Suggestions Dropdown */}
              {showSearchSuggestions && (
                <div 
                  className="absolute top-full left-0 right-0 mt-3 bg-white text-black rounded-xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto border border-gray-200 animate-in slide-in-from-top-4 duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="border-b border-gray-200">
                      <div className="px-6 py-4 text-sm font-bold text-gray-700 bg-orange-50 rounded-t-xl flex items-center gap-2">
                        <Search size={16} className="text-orange-500" />
                        Products matching "{searchQuery}"
                      </div>
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className="px-6 py-4 hover:bg-orange-50 cursor-pointer flex items-center gap-4 transition-all duration-200 group border-b border-gray-100 last:border-b-0"
                        >
                          <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                            {product.image}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-200">
                              {product.name}
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-lg font-bold text-green-600">{product.price}</span>
                              <div className="flex items-center gap-1">
                                <Star size={14} className="text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{product.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors duration-200" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Suggestions */}
                  {filteredSuggestions.length > 0 && (
                    <div className="border-b border-gray-200">
                      <div className="px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-50 flex items-center gap-2">
                        <TrendingUp size={16} className="text-blue-500" />
                        Quick suggestions
                      </div>
                      {filteredSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-6 py-3 hover:bg-blue-50 cursor-pointer flex items-center gap-3 transition-all duration-200 group"
                        >
                          <Search size={16} className="text-blue-400 group-hover:text-blue-500" />
                          <span className="group-hover:text-blue-600 transition-colors duration-200">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search History */}
                  {searchHistory.length > 0 && !searchQuery && (
                    <div className="border-b border-gray-200">
                      <div className="px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-50 flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Clock size={16} className="text-purple-500" />
                          Recent Searches
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearSearchHistory();
                          }}
                          className="text-xs text-orange-600 hover:text-orange-700 font-semibold transition-colors duration-200 px-2 py-1 rounded hover:bg-orange-100"
                        >
                          Clear All
                        </button>
                      </div>
                      {searchHistory.map((item, index) => (
                        <div
                          key={index}
                          className="px-6 py-3 hover:bg-purple-50 cursor-pointer flex items-center justify-between group transition-all duration-200"
                        >
                          <div 
                            onClick={() => handleSuggestionClick(item)}
                            className="flex items-center gap-3 flex-1 group-hover:text-purple-600 transition-colors duration-200"
                          >
                            <Clock size={16} className="text-purple-400" />
                            <span>{item}</span>
                          </div>
                          <button
                            onClick={(e) => removeFromHistory(item, e)}
                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-purple-200 rounded-full transition-all duration-200"
                          >
                            <X size={14} className="text-purple-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Trending Searches */}
                  {!searchQuery && (
                    <div>
                      <div className="px-6 py-3 text-sm font-semibold text-gray-600 bg-gray-50 flex items-center gap-2">
                        <TrendingUp size={16} className="text-green-500" />
                        Trending Now
                      </div>
                      {trendingSearches.map((trend, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(trend)}
                          className="px-6 py-3 hover:bg-green-50 cursor-pointer flex items-center gap-3 transition-all duration-200 group"
                        >
                          <TrendingUp size={16} className="text-green-400 group-hover:text-green-500" />
                          <span className="group-hover:text-green-600 transition-colors duration-200">{trend}</span>
                          <span className="ml-auto text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full group-hover:bg-green-200 transition-colors duration-200">
                            🔥 Hot
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Enhanced User Actions */}
            {/* <div className="flex items-center gap-3 ml-6">
              <button className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 relative group">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
              <button className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                <Heart size={20} className="group-hover:text-red-400 transition-colors duration-200" />
              </button>
              <button className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 relative group">
                <ShoppingCart size={20} className="group-hover:text-orange-400 transition-colors duration-200" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </button>
              <button className="p-3 rounded-xl hover:bg-white/10 transition-all duration-200 group">
                <User size={20} className="group-hover:text-blue-400 transition-colors duration-200" />
              </button>
            </div> */}

            {/* Language Selector */}
            <div className="hidden lg:flex items-center text-sm cursor-pointer hover:bg-white/10 px-4 py-3 rounded-xl transition-all duration-200 ml-4 group">
              <span className="mr-2 text-lg group-hover:scale-110 transition-transform duration-200">🇮🇳</span>
              <span className="font-semibold">EN</span>
              <ChevronDown size={14} className="ml-2 group-hover:rotate-180 transition-transform duration-200" />
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setShowSearchSuggestions(true)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pr-12 rounded-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-lg"
              />
              <button
                onClick={() => handleSearch()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-all duration-200"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Mobile Search Suggestions */}
            {showSearchSuggestions && (
              <div className="absolute left-4 right-4 mt-2 bg-white text-black rounded-xl shadow-xl z-50 max-h-[60vh] overflow-y-auto border">
                {searchResults.length > 0 && (
                  <div className="border-b border-gray-200">
                    <div className="px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50">
                      Products
                    </div>
                    {searchResults.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                      >
                        <span className="text-xl">{product.image}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-green-600 font-semibold">{product.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredSuggestions.length > 0 && (
                  <div className="border-b border-gray-200">
                    <div className="px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50">
                      Suggestions
                    </div>
                    {filteredSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                      >
                        <Search size={16} className="text-gray-400" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}

                {searchHistory.length > 0 && !searchQuery && (
                  <div className="border-b border-gray-200">
                    <div className="px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50 flex justify-between">
                      <span>Recent</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearSearchHistory();
                        }}
                        className="text-xs text-orange-600"
                      >
                        Clear All
                      </button>
                    </div>
                    {searchHistory.map((item, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                      >
                        <div 
                          onClick={() => handleSuggestionClick(item)}
                          className="flex items-center gap-3"
                        >
                          <Clock size={16} className="text-gray-400" />
                          <span>{item}</span>
                        </div>
                        <button
                          onClick={(e) => removeFromHistory(item, e)}
                          className="p-1"
                        >
                          <X size={14} className="text-gray-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!searchQuery && (
                  <div>
                    <div className="px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50">
                      Trending
                    </div>
                    {trendingSearches.map((trend, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(trend)}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                      >
                        <TrendingUp size={16} className="text-orange-400" />
                        <span>{trend}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Navigation Bar */}
        <nav className="bg-gradient-to-r from-gray-800 to-gray-700 hidden md:block border-t border-gray-600">
          <div className="container mx-auto px-4">
            <div className="flex items-center overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap group mr-2">
                <Menu size={16} className="group-hover:text-orange-400 transition-colors duration-200" />
                <span className="font-semibold group-hover:text-orange-400 transition-colors duration-200">All Departments</span>
              </div>
              
              {[
                { name: "Today's Deals", icon: "🔥", badge: "Hot" },
                { name: "Best Sellers", icon: "⭐", badge: "Top" },
                { name: "New Arrivals", icon: "✨", badge: "New" },
                { name: "Furniture", icon: "🪑", badge: null },
                { name: "Lighting", icon: "💡", badge: null },
                { name: "Home Décor", icon: "🎨", badge: null },
                { name: "Kitchen & Dining", icon: "🍽️", badge: null },
                { name: "Outdoor Living", icon: "🌿", badge: null },
                { name: "Customer Service", icon: "📞", badge: null }
              ].map((item) => (
                <button
                  key={item.name}
                  className="whitespace-nowrap hover:bg-white/10 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer text-sm flex items-center gap-2 group relative"
                  onClick={() => {
                    console.log(`Navigating to ${item.name}`);
                    alert(`Navigating to ${item.name} section`);
                  }}
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                  <span className="group-hover:text-orange-400 transition-colors duration-200">{item.name}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-xs rounded-full px-2 py-0.5 text-white font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-gray-800 to-gray-900 absolute top-full left-0 right-0 z-50 shadow-2xl max-h-[calc(100vh-120px)] overflow-y-auto animate-in slide-in-from-top-4 duration-300">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 px-4 py-4 rounded-xl transition-all duration-200 group">
                  <Menu size={18} className="text-orange-400 group-hover:text-orange-300" />
                  <span className="font-semibold text-lg group-hover:text-orange-400 transition-colors duration-200">All Departments</span>
                </div>
                
                {[
                  { name: "Today's Deals", icon: "🔥" },
                  { name: "Best Sellers", icon: "⭐" },
                  { name: "New Arrivals", icon: "✨" },
                  { name: "Furniture", icon: "🪑" },
                  { name: "Lighting", icon: "💡" },
                  { name: "Home Décor", icon: "🎨" },
                  { name: "Kitchen & Dining", icon: "🍽️" },
                  { name: "Outdoor Living", icon: "🌿" },
                  { name: "Customer Service", icon: "📞" }
                ].map((item) => (
                  <button
                    key={item.name}
                    className="text-left hover:bg-white/10 px-4 py-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between group"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      console.log(`Navigating to ${item.name}`);
                      alert(`Navigating to ${item.name} section`);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                      <span className="group-hover:text-orange-400 transition-colors duration-200">{item.name}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-orange-400 transition-colors duration-200" />
                  </button>
                ))}

                <div className="border-t border-gray-600 mt-4 pt-4 space-y-2">
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 px-4 py-4 rounded-xl transition-all duration-200 group">
                    <MapPin size={18} className="text-orange-400 group-hover:text-orange-300" />
                    <div>
                      <div className="font-semibold group-hover:text-orange-400 transition-colors duration-200">Delivery Location</div>
                      <div className="text-sm text-gray-400">Nagpur 440001</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 px-4 py-4 rounded-xl transition-all duration-200 group">
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">🇮🇳</span>
                    <div>
                      <div className="font-semibold group-hover:text-orange-400 transition-colors duration-200">Language</div>
                      <div className="text-sm text-gray-400">English</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Results Overlay for Desktop */}
      {searchQuery && searchResults.length > 0 && !showSearchSuggestions && (
        <div className="hidden md:block absolute top-full left-0 right-0 bg-white shadow-xl border-t-2 border-orange-400 z-40">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Search Results for "{searchQuery}" ({searchResults.length} found)
              </h3>
              <button 
                onClick={() => setSearchQuery("")}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
              >
                <X size={20} />
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-orange-300 transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                      {product.image}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-200 mb-1">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-green-600">{product.price}</span>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{product.rating}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-2 inline-block">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;