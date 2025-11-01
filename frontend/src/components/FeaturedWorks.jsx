import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedWorks = ({ works }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-800 to-gray-900 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4 font-serif">
            Featured Cosmic Creations
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover stellar works loved by the entire universe
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {works.map((work, index) => (
            <div key={work._id} className="group transform hover:scale-105 transition-all duration-500">
              <Link to={`/work/${work._id}`}>
                <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/50 hover:border-purple-500/50 shadow-2xl shadow-black/30 hover:shadow-purple-500/10 transition-all duration-500">
                  
                  {/* Work Image/Content */}
                  {work.fileUrls && work.fileUrls.length > 0 ? (
                    <div className="relative overflow-hidden">
                      <img 
                        src={work.fileUrls[0]} 
                        alt={work.title}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    </div>
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:from-purple-900/20 group-hover:to-blue-900/20 transition-all duration-500">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                          <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="font-bold text-white text-lg mb-2">{work.title}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{work.description}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white text-xl mb-1 line-clamp-1">{work.title}</h3>
                        <p className="text-gray-300 text-sm">
                          by {work.user?.name || 'Cosmic Creator'}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 bg-gray-700/80 backdrop-blur-sm text-gray-300 text-xs font-medium rounded-full border border-gray-600/50">
                        {work.category}
                      </span>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <span>❤️</span>
                        <span>{work.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>💬</span>
                        <span>{work.comments?.length || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>⭐</span>
                        <span>Featured</span>
                      </div>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <Link 
            to="/register" 
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-12 py-4 rounded-2xl font-semibold text-lg shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-500"
          >
            <span className="text-xl">🌠</span>
            <span>Join the Cosmic Community</span>
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Create, share, and explore across the universe
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWorks;