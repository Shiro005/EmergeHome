import React, { useState, useEffect } from 'react';
import { Clock, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';

const App = () => {
  const [hours, setHours] = useState(10);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else if (hours > 0) {
        setHours(hours - 1);
        setMinutes(59);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [hours, minutes, seconds]);

  const formatTime = (value) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-orange-500 h-2 w-full"></div>
        
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="flex items-center mb-6">
              <ShoppingBag className="text-orange-500 mr-3" size={32} />
              <h1 className="text-4xl md:text-5xl font-bold">Emerge Home</h1>
            </div>
            
            <div className="bg-orange-500/10 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
              E-Commerce & Affiliate Marketing Platform
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Website Under Development</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl">
              We're putting the finishing touches on something amazing. 
              Please check back in:
            </p>
            
            <div className="flex justify-center gap-4 mb-8">
              <div className="bg-gray-900 p-4 rounded-lg w-24 text-center">
                <div className="text-3xl font-bold text-orange-500">{formatTime(hours)}</div>
                <div className="text-xs text-gray-400 uppercase mt-1">Hours</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg w-24 text-center">
                <div className="text-3xl font-bold text-orange-500">{formatTime(minutes)}</div>
                <div className="text-xs text-gray-400 uppercase mt-1">Minutes</div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg w-24 text-center">
                <div className="text-3xl font-bold text-orange-500">{formatTime(seconds)}</div>
                <div className="text-xs text-gray-400 uppercase mt-1">Seconds</div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
              <Clock className="text-orange-500" size={24} />
              <p className="text-gray-300">
                Expected launch in <span className="text-orange-400 font-semibold">10-13 hours</span>
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-850 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <Sparkles className="text-orange-500 mr-2" size={20} />
                  Coming Soon
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <ArrowRight className="text-orange-500 mr-2" size={16} />
                    Curated home decor collections
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="text-orange-500 mr-2" size={16} />
                    Exclusive affiliate partnerships
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="text-orange-500 mr-2" size={16} />
                    Personalized shopping experience
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-850 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Stay Connected</h3>
                <div className="flex gap-4 mb-4">
                  <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white font-medium w-full transition-colors">
                    Get Notified
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  We'll let you know when we launch!
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              Designed & Developed by 
              <span className="text-orange-400 font-medium"> WebReich Technologies</span>
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2025 Emerge Home. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;