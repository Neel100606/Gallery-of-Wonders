import React from 'react';
import { Link } from 'react-router-dom';

const WorkGridItem = ({ work }) => {
  // Check if there's a valid, non-empty image URL to display
  const hasImage = work && work.fileUrls && work.fileUrls.length > 0 && work.fileUrls[0];

  return (
    <Link to={`/work/${work._id}`} className="relative aspect-square group bg-gray-200">
      {hasImage ? (
        <img
          src={work.fileUrls[0]}
          alt={work.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"></path></svg>
        </div>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-white flex space-x-4 text-lg">
          {/* 👇 UPDATED: Use optional chaining to prevent crashes */}
          <span className="flex items-center">
            🤍 {work.likes?.length || 0}
          </span>
          <span className="flex items-center">
            💬 {work.comments?.length || 0}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default WorkGridItem;