import React from 'react';
import { Link } from 'react-router-dom';

const WorkGridItem = ({ work }) => {
  const hasImage = work && work.fileUrls && work.fileUrls.length > 0 && work.fileUrls[0];

  return (
    <Link to={`/work/${work._id}`} className="block group">
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-colors duration-300">
        {hasImage ? (
          <div className="relative aspect-square overflow-hidden">
            <img
              src={work.fileUrls[0]}
              alt={work.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
          </div>
        ) : (
          <div className="aspect-square bg-gray-700 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="text-3xl mb-2 text-gray-400">📝</div>
              <h3 className="text-white font-medium text-sm line-clamp-2">{work.title}</h3>
            </div>
          </div>
        )}
        
        {/* Tags in WorkGridItem */}
        {work.tags && work.tags.length > 0 && (
          <div className="px-4 pt-3">
            <div className="flex flex-wrap gap-1">
              {work.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50"
                >
                  #{tag}
                </span>
              ))}
              {work.tags.length > 2 && (
                <span className="px-1 py-1 text-gray-500 text-xs">+{work.tags.length - 2}</span>
              )}
            </div>
          </div>
        )}
        
        <div className="p-4">
          <h3 className="text-white font-medium text-sm line-clamp-1 mb-1">{work.title}</h3>
          <p className="text-gray-400 text-xs line-clamp-2 mb-2">{work.description}</p>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{work.category}</span>
            <div className="flex space-x-2">
              <span>❤️ {work.likes?.length || 0}</span>
              <span>💬 {work.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkGridItem;