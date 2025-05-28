import { User, Search, MapPin, ChevronDown, Menu, X, Clock, TrendingUp } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([
    "LED ceiling lights",
    "Dining table set",
    "Sofa cushions"
  ]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  
  const searchInputRef = useRef(null);

  const categories = [
    "All", "Furniture", "Lighting", "Décor", "Outdoor", "Kitchen", 
    "Bedroom", "Living Room", "Bathroom", "Office", "Storage"
  ];

  // Sample search suggestions based on categories
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

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const categoryData = searchSuggestions[selectedCategory] || searchSuggestions["All"];
      const filtered = categoryData.filter(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [searchQuery, selectedCategory]);

  const handleSearch = (query = searchQuery) => {
    if (query.trim()) {
      console.log(`Searching for "${query}" in category "${selectedCategory}"`);
      
      // Add to search history if not already present
      if (!searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev.slice(0, 4)]);
      }
      
      // Hide suggestions
      setShowSearchSuggestions(false);
      
      // Simulate search action
      alert(`Searching for "${query}" in ${selectedCategory} category`);
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

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  const removeFromHistory = (item) => {
    setSearchHistory(prev => prev.filter(historyItem => historyItem !== item));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownOpen(false);
    // Refocus search input after category change
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const handleLocationSelect = (location) => {
    setIsLocationDropdownOpen(false);
    console.log(`Location changed to: ${location}`);
  };

  // Close dropdowns when clicking outside
  const closeDropdowns = () => {
    setIsLocationDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
    setIsAccountDropdownOpen(false);
    setShowSearchSuggestions(false);
  };

  return (
    <div onClick={closeDropdowns}>
      <header className="bg-gray-900 text-white shadow-lg" onClick={(e) => e.stopPropagation()}>
        {/* Main header section */}
        <div className="bg-gray-900 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center gap-4">
              
              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="text-2xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-orange-400">Emerge</span>
                  <span className="text-white text-xl">Home</span>
                </div>
              </div>

              {/* Delivery Location */}
              <div className="hidden md:flex items-center text-sm cursor-pointer hover:bg-gray-800 px-2 py-1 rounded relative">
                <div onClick={(e) => {
                  e.stopPropagation();
                  setIsLocationDropdownOpen(!isLocationDropdownOpen);
                  setIsCategoryDropdownOpen(false);
                  setIsAccountDropdownOpen(false);
                  setShowSearchSuggestions(false);
                }}>
                  <MapPin size={16} className="text-orange-400 mr-1" />
                  <div className="text-xs text-gray-300">Deliver to</div>
                  <div className="font-semibold text-white">Nagpur 440001</div>
                </div>
                
                {isLocationDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white text-black rounded shadow-lg p-4 z-50 w-64">
                    <div className="font-semibold mb-2">Choose your location</div>
                    <div className="text-sm text-gray-600 mb-3">Delivery options and fees may vary</div>
                    <div className="space-y-2">
                      <div 
                        className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                        onClick={() => handleLocationSelect("Nagpur, Maharashtra")}
                      >
                        Nagpur, Maharashtra
                      </div>
                      <div 
                        className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                        onClick={() => handleLocationSelect("Mumbai, Maharashtra")}
                      >
                        Mumbai, Maharashtra
                      </div>
                      <div 
                        className="hover:bg-gray-100 p-2 rounded cursor-pointer"
                        onClick={() => handleLocationSelect("Pune, Maharashtra")}
                      >
                        Pune, Maharashtra
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Search Section */}
              <div className="flex-1 max-w-2xl mx-4 relative">
                <div className="flex">
                  {/* Category Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                        setIsLocationDropdownOpen(false);
                        setIsAccountDropdownOpen(false);
                        setShowSearchSuggestions(false);
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-2.5 rounded-l-md border-r border-gray-400 flex items-center gap-1 text-sm font-medium min-w-[80px]"
                    >
                      <span className="truncate">{selectedCategory}</span>
                      <ChevronDown size={14} />
                    </button>
                    
                    {isCategoryDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white text-black rounded shadow-lg max-h-64 overflow-y-auto z-50 w-48">
                        {categories.map((category) => (
                          <div
                            key={category}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategorySelect(category);
                            }}
                            className={`px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm ${
                              category === selectedCategory ? 'bg-orange-50 text-orange-600 font-medium' : ''
                            }`}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Search Input */}
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={handleSearchFocus}
                    placeholder={`Search EmergeHome ${selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}...`}
                    className="flex-1 px-4 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Clear Search Button */}
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                      className="px-2 py-2.5 text-gray-500 hover:text-gray-700 bg-white"
                    >
                      <X size={16} />
                    </button>
                  )}

                  {/* Search Button */}
                  <button
                    onClick={() => handleSearch()}
                    className="bg-orange-400 hover:bg-orange-500 px-4 py-2.5 rounded-r-md transition-colors"
                  >
                    <Search className="text-gray-900" size={20} />
                  </button>
                </div>

                {/* Search Suggestions Dropdown */}
                {showSearchSuggestions && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-1 bg-white text-black rounded shadow-lg z-50 max-h-96 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Current query suggestions */}
                    {filteredSuggestions.length > 0 && (
                      <div className="border-b border-gray-200">
                        <div className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50">
                          Suggestions for "{searchQuery}"
                        </div>
                        {filteredSuggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          >
                            <Search size={14} className="text-gray-400" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Search History */}
                    {searchHistory.length > 0 && !searchQuery && (
                      <div className="border-b border-gray-200">
                        <div className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 flex justify-between items-center">
                          <span>Recent Searches</span>
                          <button
                            onClick={clearSearchHistory}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Clear All
                          </button>
                        </div>
                        {searchHistory.map((item, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between group"
                          >
                            <div 
                              onClick={() => handleSuggestionClick(item)}
                              className="flex items-center gap-2 flex-1"
                            >
                              <Clock size={14} className="text-gray-400" />
                              <span className="text-sm">{item}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromHistory(item);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded"
                            >
                              <X size={12} className="text-gray-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Trending Searches */}
                    {!searchQuery && (
                      <div>
                        <div className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50">
                          Trending Searches
                        </div>
                        {trendingSearches.map((trend, index) => (
                          <div
                            key={index}
                            onClick={() => handleSuggestionClick(trend)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                          >
                            <TrendingUp size={14} className="text-orange-400" />
                            <span className="text-sm">{trend}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Account & Language */}
              <div className="flex items-center gap-4">
                
                {/* Language Selector */}
                <div className="hidden md:flex items-center text-sm cursor-pointer hover:bg-gray-800 px-2 py-1 rounded">
                  <span className="mr-1">🇮🇳</span>
                  <span>EN</span>
                  <ChevronDown size={14} className="ml-1" />
                </div>

                {/* Account */}
                <div className="relative">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAccountDropdownOpen(!isAccountDropdownOpen);
                      setIsLocationDropdownOpen(false);
                      setIsCategoryDropdownOpen(false);
                      setShowSearchSuggestions(false);
                    }}
                    className="flex items-center text-sm cursor-pointer hover:bg-gray-800 px-2 py-1 rounded"
                  >
                    <User size={20} className="mr-2" />
                    <div className="hidden md:block">
                      <div className="text-xs text-gray-300">Hello, Sign in</div>
                      <div className="font-semibold">Account & Lists</div>
                    </div>
                    <ChevronDown size={14} className="ml-1" />
                  </div>

                  {isAccountDropdownOpen && (
                    <div className="absolute top-full right-0 mt-1 bg-white text-black rounded shadow-lg w-64 z-50">
                      <div className="p-4 border-b">
                        <button className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded mb-2 transition-colors">
                          Sign In
                        </button>
                        <div className="text-sm">
                          New customer? <span className="text-blue-600 cursor-pointer hover:underline">Start here.</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="hover:bg-gray-100 p-2 rounded cursor-pointer text-sm transition-colors">Your Account</div>
                        <div className="hover:bg-gray-100 p-2 rounded cursor-pointer text-sm transition-colors">Your Orders</div>
                        <div className="hover:bg-gray-100 p-2 rounded cursor-pointer text-sm transition-colors">Your Wish List</div>
                        <div className="hover:bg-gray-100 p-2 rounded cursor-pointer text-sm transition-colors">Your Recommendations</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center gap-6 text-sm overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-1 cursor-pointer hover:bg-gray-700 px-2 py-1 rounded transition-colors">
                <Menu size={16} />
                <span className="font-medium">All</span>
              </div>
              
              {["Today's Deals", "Best Sellers", "New Arrivals", "Furniture", "Lighting", "Home Décor", "Kitchen & Dining", "Outdoor Living", "Customer Service"].map((item) => (
                <button
                  key={item}
                  className="whitespace-nowrap hover:bg-gray-700 px-2 py-1 rounded transition-colors cursor-pointer"
                  onClick={() => {
                    console.log(`Navigating to ${item}`);
                    alert(`Navigating to ${item} section`);
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;