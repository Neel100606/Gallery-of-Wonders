import React from 'react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ user, workCount, isCurrentUser }) => {
  return (
    <div className="bg-gray-800 rounded-2xl p-8 mb-8 border border-gray-700">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
        <img
          src={user.profileImage}
          alt={user.name}
          className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border-2 border-gray-600"
        />
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0 mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
            {isCurrentUser && (
              <Link 
                to="/profile/edit" 
                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                Edit Profile
              </Link>
            )}
          </div>
          
          {/* Only show works count */}
          <div className="flex justify-center md:justify-start mb-4">
            <div className="text-center">
              <div className="text-white font-bold text-xl">{workCount}</div>
              <div className="text-gray-400 text-sm">Works</div>
            </div>
          </div>

          {user.bio && (
            <p className="text-gray-300 max-w-2xl">{user.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;