import React from 'react';
import { Link } from 'react-router-dom';

const Comment = ({ comment }) => {
  // Defensive check for populated user data
  const userName = comment.user ? comment.user.name : 'Anonymous';
  const userProfileImage = comment.user ? comment.user.profileImage : '/default-avatar.png';
  const userProfileLink = comment.user ? `/profile/${comment.user._id}` : '#';

  return (
    <div className="flex items-start space-x-3 my-4">
      <Link to={userProfileLink}>
        <img
          src={userProfileImage}
          alt={userName}
          className="h-9 w-9 rounded-full object-cover"
        />
      </Link>
      <div className="flex-1">
        <p className="text-sm">
          <Link to={userProfileLink} className="font-semibold text-gray-800 mr-2">
            {userName}
          </Link>
          <span className="text-gray-600">{comment.text}</span>
        </p>
      </div>
    </div>
  );
};

export default Comment;