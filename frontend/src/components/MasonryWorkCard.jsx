import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MasonryWorkCard = ({ work }) => {
  const navigate = useNavigate();

  const handleUserClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (work.user?._id) {
      navigate(`/profile/${work.user._id}`);
    }
  };

  const handleWorkClick = (e) => {
    // If the click was on the user link, don't navigate to work
    if (e.target.closest('.user-link')) {
      return;
    }
  };

  const userName = work.user?.name || 'Unknown Artist';
  const userProfileImage = work.user?.profileImage || '/default-avatar.png';

  return (
    <div 
      className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer group"
      onClick={handleWorkClick}
    >
      <Link to={`/work/${work._id}`} className="block">
        {/* Work Image/Content */}
        {work.category === 'Writing' ? (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
              {work.title}
            </h3>
            {work.summary && (
              <p className="text-gray-400 text-sm line-clamp-3">{work.summary}</p>
            )}
          </div>
        ) : (
          <div className="aspect-square overflow-hidden">
            <img
              src={work.fileUrls?.[0]}
              alt={work.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
      </Link>

      {/* Work Info - Separate from the main Link */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* User info as separate clickable element */}
          <div 
            className="flex items-center space-x-2 group/profile cursor-pointer user-link"
            onClick={handleUserClick}
          >
            <img
              src={userProfileImage}
              alt={userName}
              className="h-6 w-6 rounded-lg object-cover border border-gray-600 group-hover/profile:border-purple-500 transition-colors"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            <span className="text-sm text-gray-300 group-hover/profile:text-purple-300 transition-colors">
              {userName}
            </span>
          </div>

          {/* Engagement stats */}
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <span>❤️</span>
              <span>{work.likes?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>💬</span>
              <span>{work.comments?.length || 0}</span>
            </div>
          </div>
        </div>

        {/* Work title for writing works (already shown for other categories) */}
        {work.category !== 'Writing' && (
          <h3 className="text-sm font-semibold text-white mt-3 line-clamp-2">
            {work.title}
          </h3>
        )}

        {/* Tags Section - Added here */}
        {work.tags && work.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {work.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50 hover:bg-purple-600/20 hover:border-purple-500/30 hover:text-purple-300 transition-all duration-200 cursor-default"
              >
                #{tag}
              </span>
            ))}
            {work.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-700/30 text-gray-500 text-xs rounded-full">
                +{work.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Category tag and additional info */}
        <div className="flex justify-between items-center mt-3">
          <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full capitalize">
            {work.category}
          </span>
          <div className="text-xs text-gray-500">
            {work.saves || 0} saves
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasonryWorkCard;