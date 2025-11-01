import React from 'react';
import { Link } from 'react-router-dom';

const RecentActivity = ({ works }) => {
  if (!works || works.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">📝</div>
        <h3 className="text-lg font-semibold text-white mb-2">No recent works</h3>
        <p className="text-gray-400">Start creating to see your activity here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {works.map((work) => (
        <Link 
          key={work._id}
          to={`/work/${work._id}`}
          className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors group"
        >
          {work.fileUrls && work.fileUrls.length > 0 ? (
            <img 
              src={work.fileUrls[0]} 
              alt={work.title}
              className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-lg">📝</span>
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">
              {work.title}
            </h3>
            <p className="text-gray-400 text-sm capitalize">{work.category}</p>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-red-400">
                <span>❤️</span>
                <span>{work.likes?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-400">
                <span>💬</span>
                <span>{work.comments?.length || 0}</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              {new Date(work.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RecentActivity;