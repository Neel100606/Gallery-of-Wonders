import React from 'react';
import { Link } from 'react-router-dom';

const CategoryGrid = () => {
  const categories = [
    {
      name: "Digital Art",
      description: "Explore digital masterpieces from cosmic creators",
      icon: "🎨",
      count: "1.2K",
      color: "from-purple-600/20 to-pink-600/20",
      borderColor: "border-purple-500/30",
      gradient: "bg-gradient-to-br from-purple-600 to-pink-600"
    },
    {
      name: "Photography",
      description: "Capture moments across the universe",
      icon: "📸",
      count: "2.4K",
      color: "from-blue-600/20 to-cyan-600/20",
      borderColor: "border-blue-500/30",
      gradient: "bg-gradient-to-br from-blue-600 to-cyan-600"
    },
    {
      name: "Writing",
      description: "Stories that traverse galaxies",
      icon: "✍️",
      count: "856",
      color: "from-green-600/20 to-emerald-600/20",
      borderColor: "border-green-500/30",
      gradient: "bg-gradient-to-br from-green-600 to-emerald-600"
    },
    {
      name: "Sculpture",
      description: "Three-dimensional cosmic art",
      icon: "🗿",
      count: "432",
      color: "from-orange-600/20 to-red-600/20",
      borderColor: "border-orange-500/30",
      gradient: "bg-gradient-to-br from-orange-600 to-red-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4 font-serif">
            Explore Cosmic Categories
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Journey through different creative galaxies and discover stellar works
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              to="/register"
              className="group block transform hover:scale-105 transition-all duration-500"
            >
              <div className={`relative bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border ${category.borderColor} hover:border-opacity-60 transition-all duration-500 shadow-2xl shadow-black/30 hover:shadow-purple-500/10 h-full`}>
                {/* Background Gradient Effect */}
                <div className={`absolute inset-0 ${category.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className="relative z-10">
                  <div className={`w-20 h-20 ${category.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                    {category.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
                    {category.name}
                  </h3>
                  <p className="text-gray-400 text-sm text-center mb-4 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {category.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex justify-center items-center space-x-2 text-sm">
                    <span className="text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
                      {category.count} works
                    </span>
                    <div className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-gray-500 transition-colors duration-300"></div>
                    <span className="text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                      Explore →
                    </span>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Link 
            to="/register" 
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-12 py-4 rounded-2xl font-semibold text-lg shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-500"
          >
            <span className="text-xl">🚀</span>
            <span>Start Your Cosmic Journey</span>
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Join thousands of creators across the universe
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;