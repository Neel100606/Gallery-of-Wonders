import React from 'react';
import { Link } from 'react-router-dom';

const Comment = ({ comment }) => {
  const userName = comment.user ? comment.user.name : 'Anonymous';
  const userProfileImage = comment.user ? comment.user.profileImage : '/default-avatar.png';
  const userProfileLink = comment.user ? `/profile/${comment.user._id}` : '#';

  return (
    <div className="flex items-start space-x-3 py-3 border-b border-gray-700 last:border-b-0">
      <Link to={userProfileLink}>
        <img
          src={userProfileImage}
          alt={userName}
          className="h-8 w-8 rounded-lg object-cover"
        />
      </Link>
      <div className="flex-1">
        <p className="text-sm">
          <Link to={userProfileLink} className="font-semibold text-white hover:text-purple-300 mr-2">
            {userName}
          </Link>
          <span className="text-gray-300">{comment.text}</span>
        </p>
      </div>
    </div>
  );
};

export default Comment;