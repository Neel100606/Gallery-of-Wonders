import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import WorkOptionsMenu from './WorkOptionsMenu';

const WorkCard = ({ work }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const userName = work.user ? work.user.name : 'Cosmic Creator';
  const userProfileImage = work.user ? work.user.profileImage : 'https://res.cloudinary.com/dw3dkqiac/image/upload/v1759513698/zqzrken305a14txbfjmv.jpg';
  const userProfileLink = work.user ? `/profile/${work.user._id}` : '#';
  const isOwner = userInfo && work.user && userInfo._id === work.user._id;

  const cardText = work.category === 'Writing' && work.summary ? work.summary : work.description;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/20 hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-500 overflow-hidden group">
      {/* Card Header */}
      <div className="flex items-center p-6 border-b border-gray-700/50">
        <Link to={userProfileLink} className="flex items-center space-x-3 group/profile">
          <div className="relative">
            <img 
              src={userProfileImage} 
              alt={userName} 
              className="h-12 w-12 rounded-2xl object-cover border-2 border-gray-600 group-hover/profile:border-purple-500 transition-colors duration-300" 
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-gray-800 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover/profile:text-purple-300 transition-colors duration-300">
              {userName}
            </p>
            <p className="text-xs text-gray-400">{work.category}</p>
          </div>
        </Link>
        <div className="ml-auto">
          {isOwner && <WorkOptionsMenu work={work} />}
        </div>
      </div>

      {/* Card Image or Text Preview */}
      {work.fileUrls && work.fileUrls.length > 0 ? (
        <Link to={`/work/${work._id}`} className="block overflow-hidden">
          <img 
            src={work.fileUrls[0]} 
            alt={work.title} 
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        </Link>
      ) : (
        <Link to={`/work/${work._id}`} className="block p-8 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-purple-900/20 hover:to-blue-900/20 transition-all duration-500 border-b border-gray-700/50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
              <span className="text-2xl">📝</span>
            </div>
            <h2 className="font-bold text-xl text-white mb-3 line-clamp-2">{work.title}</h2>
            <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">{cardText}</p>
          </div>
        </Link>
      )}

      {/* Tags Section - Added here */}
      {work.tags && work.tags.length > 0 && (
        <div className="px-6 pt-4 pb-2 border-b border-gray-700/50">
          <div className="flex flex-wrap gap-2">
            {work.tags.slice(0, 4).map(tag => (
              <span 
                key={tag} 
                className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-xs font-medium rounded-full border border-purple-500/30 hover:from-purple-600/30 hover:to-blue-600/30 transition-all duration-300 cursor-default"
              >
                #{tag}
              </span>
            ))}
            {work.tags.length > 4 && (
              <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
                +{work.tags.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Card Actions */}
      <div className="p-6 flex items-center space-x-6 border-b border-gray-700/50">
        <LikeButton work={work} />
        <Link to={`/work/${work._id}#comments`} className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-300 group/comment">
          <div className="p-2 rounded-xl bg-gray-700/50 group-hover/comment:bg-blue-500/20 transition-colors duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-sm font-medium">{work.comments?.length || 0}</span>
        </Link>
        <SaveButton workId={work._id} />
      </div>

      {/* Card Content */}
      <div className="p-6">
        <p className="font-semibold text-white text-sm mb-4 flex items-center space-x-2">
          <span>❤️</span>
          <span>{work.likes?.length || 0} stellar likes</span>
        </p>
        
        <div className="text-sm mb-4">
          <Link to={userProfileLink} className="font-semibold text-white hover:text-purple-300 transition-colors duration-300 mr-2">
            {userName}
          </Link>
          <span className="text-gray-300 leading-relaxed">{cardText}</span>
        </div>

        {/* Additional tags in content area (optional - remove if you prefer only one tags section) */}
        {work.tags && work.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {work.tags.slice(0, 3).map(tag => (
              <span 
                key={tag} 
                className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link 
          to={`/work/${work._id}#comments`} 
          className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center space-x-2"
        >
          <span>💬</span>
          <span>View all {work.comments?.length || 0} cosmic comments</span>
        </Link>
      </div>
    </div>
  );
};

export default WorkCard;