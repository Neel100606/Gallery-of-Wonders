import React from 'react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ user, workCount, isCurrentUser }) => {
  return (
    <div className="flex flex-col md:flex-row items-center p-8 border-b">
      <img
        src={user.profileImage}
        alt={user.name}
        className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover"
      />
      <div className="md:ml-10 mt-4 md:mt-0 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start space-x-4">
          <h1 className="text-2xl font-light">{user.name}</h1>
          {isCurrentUser && ( // The "Edit Profile" button only shows if it's the current user's profile
            <Link to="/profile/edit" className="px-4 py-1 border rounded font-semibold text-sm">
              Edit Profile
            </Link>
          )}
        </div>
        
        {/* Simplified stats section showing only the post count */}
        <div className="flex justify-center md:justify-start space-x-8 mt-4">
          <span><span className="font-semibold">{workCount}</span> posts</span>
        </div>

        <div className="mt-4">
          <p className="text-gray-700">{user.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;