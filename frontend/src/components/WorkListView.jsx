import React from 'react';
import { Link } from 'react-router-dom';

const WorkListView = ({ works }) => {
  return (
    <div className="space-y-6">
      {works.map((work) => (
        <div 
          key={work._id} 
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
        >
          <div className="flex items-start space-x-4">
            {/* Work Image */}
            <div className="flex-shrink-0 w-24 h-24">
              {work.fileUrls && work.fileUrls.length > 0 ? (
                <img 
                  src={work.fileUrls[0]} 
                  alt={work.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-2xl text-gray-400">📝</span>
                </div>
              )}
            </div>

            {/* Work Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {work.title}
                </h3>
                <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full ml-2 flex-shrink-0">
                  {work.category}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {work.category === 'Writing' && work.summary ? work.summary : work.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span>{work.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{work.comments?.length || 0}</span>
                  </div>
                  <span>by {work.user?.username || 'Unknown'}</span>
                </div>

                <Link
                  to={`/work/${work._id}`}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkListView;