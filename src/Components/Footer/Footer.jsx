import { 
  Facebook, Twitter, Instagram, Youtube, Linkedin,
  Mail, Phone, MapPin, CreditCard, Truck, Shield, 
  RefreshCw, Award, ChevronUp, ExternalLink
} from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(true);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: "Get to Know Us",
      links: [
        "About EmergeHome",
        "Careers",
        "Press Releases",
        "EmergeHome Cares",
        "Gift a Smile",
        "EmergeHome Science"
      ]
    },
    {
      title: "Make Money with Us",
      links: [
        "Sell products on EmergeHome",
        "Sell on EmergeHome Business",
        "Sell apps on EmergeHome",
        "Become an Affiliate",
        "Advertise Your Products",
        "Self-Publish with Us"
      ]
    },
    {
      title: "EmergeHome Payment Products",
      links: [
        "EmergeHome Business Card",
        "Shop with Points",
        "Reload Your Balance",
        "EmergeHome Currency Converter",
        "Payment Methods",
        "EmergeHome Wallet"
      ]
    },
    {
      title: "Let Us Help You",
      links: [
        "Your Account",
        "Your Orders",
        "Shipping Rates & Policies",
        "Returns & Replacements",
        "Manage Your Content",
        "EmergeHome Assistant",
        "Help & Customer Service"
      ]
    }
  ];

  const serviceFeatures = [
    {
      icon: <Truck size={24} />,
      title: "Fast Delivery",
      description: "Free shipping on orders over ₹999"
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: <Shield size={24} />,
      title: "Secure Payment",
      description: "Your payment information is safe"
    },
    {
      icon: <Award size={24} />,
      title: "Quality Guarantee",
      description: "Premium quality products"
    }
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, name: "Facebook", url: "#" },
    { icon: <Twitter size={20} />, name: "Twitter", url: "#" },
    { icon: <Instagram size={20} />, name: "Instagram", url: "#" },
    { icon: <Youtube size={20} />, name: "YouTube", url: "#" },
    { icon: <Linkedin size={20} />, name: "LinkedIn", url: "#" }
  ];

  const paymentMethods = [
    "Visa", "Mastercard", "UPI", "Paytm", "GPay", "PhonePe", "Net Banking"
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="bg-gray-800 hover:bg-gray-700 transition-colors">
          <div className="max-w-7xl mx-auto px-4">
            <button
              onClick={scrollToTop}
              className="w-full py-3 text-sm font-medium flex items-center justify-center gap-2 hover:text-orange-400 transition-colors"
            >
              <ChevronUp size={16} />
              Back to top
            </button>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-300">Get the latest deals and home décor inspiration delivered to your inbox</p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="flex gap-2 max-w-md">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 bg-white text-black rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleNewsletterSubmit(e);
                      }
                    }}
                  />
                </div>
                <button
                  onClick={handleNewsletterSubmit}
                  className="bg-orange-400 hover:bg-orange-500 px-6 py-2.5 rounded-r-md font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>
              {isSubscribed && (
                <p className="text-green-400 text-sm mt-2">✓ Successfully subscribed!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Features */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div className="text-orange-400 flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-4 text-orange-400">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-white text-sm transition-colors hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(`Navigating to: ${link}`);
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Phone size={16} className="text-orange-400" />
                  Customer Service
                </h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>📞 1800-123-4567 (Toll Free)</p>
                  <p>🕒 Mon-Sun: 8AM - 10PM</p>
                  <p>📧 support@emergehome.com</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin size={16} className="text-orange-400" />
                  Our Office
                </h4>
                <div className="text-sm text-gray-300">
                  <p>EmergeHome India Pvt. Ltd.</p>
                  <p>123 Business District,</p>
                  <p>Nagpur, Maharashtra 440001</p>
                  <p>India</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Connect With Us</h4>
                <div className="flex gap-3 mb-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className="bg-gray-800 hover:bg-orange-400 p-2 rounded-full transition-colors"
                      title={social.name}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(`Opening ${social.name}`);
                      }}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-gray-300 hover:text-orange-400 transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Opening mobile app");
                    }}
                  >
                    <ExternalLink size={14} />
                    Download Mobile App
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Payment Methods */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-orange-400" />
              <span className="text-sm font-medium">We Accept:</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white text-black px-3 py-1 rounded text-xs font-medium"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-600">
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-orange-400 font-bold text-lg">Emerge</span>
                <span className="font-bold">Home</span>
              </div>
              <span>© 2024 EmergeHome. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;