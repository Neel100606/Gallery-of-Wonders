import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-gray-900 to-gray-900"></div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Main Heading */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 font-serif">
            <span className="bg-gradient-to-r from-white via-gray-200 to-purple-200 bg-clip-text text-transparent">
              Gallery
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Wonders
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Where <span className="text-purple-400">digital dreams</span> become cosmic reality. 
            Join our constellation of creators sharing <span className="text-blue-400">stellar works</span> across the universe.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link 
            to="/register" 
            className="group relative bg-gradient-to-r from-purple-600 to-blue-500 text-white px-12 py-4 rounded-2xl font-semibold text-lg shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-500 overflow-hidden"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span className="text-xl">🚀</span>
              <span>Launch Your Journey</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </Link>
          <Link 
            to="/login" 
            className="group px-12 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-600 text-gray-300 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-500 backdrop-blur-sm"
          >
            <span className="flex items-center space-x-3">
              <span className="text-xl">🌌</span>
              <span>Explore Universe</span>
            </span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {[
            { number: '10K+', label: 'Cosmic Creations', emoji: '🎨' },
            { number: '5K+', label: 'Stellar Artists', emoji: '👨‍🎨' },
            { number: '50K+', label: 'Universal Likes', emoji: '❤️' },
            { number: '24/7', label: 'Active Galaxy', emoji: '🌍' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
              <div className="text-2xl mb-2">{stat.emoji}</div>
              <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;