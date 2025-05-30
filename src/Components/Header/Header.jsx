import { Menu, X, MapPin, ChevronDown, Home, Utensils, Sofa, Bed, PaintBucket, ShowerHead, Lock, Gift, Lightbulb } from "lucide-react";
import { useState } from "react";

const Header = ({ onCategorySelect }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Category configuration
  const categoryIcons = {
    'Home Appliances': Home,
    'Kitchen Tools': Utensils,
    'Furniture': Sofa,
    'Linen And Rugs': Bed,
    'Curtains & Decor': PaintBucket,
    'Bathroom Fixtures': ShowerHead,
    'Security': Lock,
    'Outdoor Decor': Gift,
    'Lights': Lightbulb
  };

  const categories = ["All", ...Object.keys(categoryIcons)];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsMobileMenuOpen(false);
    onCategorySelect && onCategorySelect(category);
  };

  const renderCategoryIcon = (category) => {
    const IconComponent = categoryIcons[category];
    return IconComponent ? <IconComponent size={20} className="text-orange-400" /> : <Home size={20} className="text-orange-400" />;
  };

  return (
    <div className="">
      {/* Gradient Background with Animation */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 animate-pulse"></div> */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-orange-600/20"></div> */}
      
      <header className="relative bg-gray-900/95 backdrop-blur-sm shadow-2xl">
        {/* Top Promotional Bar */}
        {/* <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white overflow-hidden">
          <div className="animate-marquee whitespace-nowrap py-2 px-4">
            <span className="text-sm font-medium inline-block">
              🎉 Grand Opening Sale! Free Delivery on All Orders Above ₹999 | Use Code: EMERGE50 for Extra Discount! ✨
            </span>
          </div>
        </div> */}

        {/* Main Header */}
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-3 text-white hover:text-orange-400 hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110"
            >
              <div className="relative">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                {!isMobileMenuOpen && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                )}
              </div>
            </button>

            {/* Logo - Redesigned with Animation */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <div className="group cursor-pointer">
                <div className="text-xl sm:text-3xl lg:text-3xl font-bold tracking-tight transform transition-all duration-300 hover:scale-105">
                  <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent animate-gradient-x">
                    Emerge
                  </span>
                  <span className="text-white ml-2 relative">
                    Home
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600 group-hover:w-full transition-all duration-500"></div>
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-orange-300 font-medium mt-1 opacity-90">
                  Transform Your Living Space
                </div>
              </div>
            </div>

            {/* Location - Desktop Only */}
            <div className="hidden lg:flex items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-white/20 transition-all duration-300 cursor-pointer group border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg group-hover:bg-orange-400 transition-colors">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-orange-300 font-medium">Deliver to</div>
                    <div className="text-white font-semibold text-sm flex items-center gap-1">
                      Nagpur 440001
                      <ChevronDown size={14} className="text-orange-300 group-hover:rotate-180 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Categories Navigation - Desktop */}
        <nav className="hidden lg:block bg-black/20 backdrop-blur-sm border-t border-white/10">
          <div className="px-8 py-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`group relative whitespace-nowrap px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                    category === selectedCategory 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {category !== 'All' && renderCategoryIcon(category)}
                  <span className="text-sm font-medium">{category}</span>
                  {category === selectedCategory && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gray-900/98 backdrop-blur-md shadow-2xl border-t border-white/10 animate-slide-down">
            <div className="p-6">
              
              {/* Location for Mobile */}
              <div className="mb-6 p-4 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-xl border border-orange-500/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-orange-300 font-medium">Deliver to</div>
                    <div className="text-white font-semibold">Nagpur 440001</div>
                  </div>
                </div>
              </div>

              {/* Categories for Mobile */}
              <div className="space-y-2">
                <div className="text-orange-300 font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                  Categories
                </div>
                {categories.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={`w-full flex items-center gap-4 px-4 py-4 text-left rounded-xl transition-all duration-300 transform hover:scale-102 ${
                      category === selectedCategory 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                    style={{ animationDelay: `${index * 75}ms` }}
                  >
                    {category !== 'All' && renderCategoryIcon(category)}
                    <span className="font-medium">{category}</span>
                    {category === selectedCategory && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-center text-white/60 text-sm">
                  <div className="font-medium text-orange-300 mb-1">Need Help?</div>
                  <div>Call us: 1800-123-4567</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Header;