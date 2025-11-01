import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserByIdQuery } from '../redux/api/usersApiSlice';
import { useGetWorksByUserIdQuery } from '../redux/api/worksApiSlice';
import { useGetCollectionsByUserIdQuery } from '../redux/api/collectionApiSlice';
import Loader from '../components/Loader';
import ProfileHeader from '../components/ProfileHeader';
import CollectionGrid from '../components/CollectionGrid';
import MasonryGrid from '../components/MasonryGrid';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('works');
  const { userId } = useParams();
  const { userInfo: currentUser } = useSelector((state) => state.auth);

  const profileUserId = userId || currentUser?._id;
  const isCurrentUser = !userId || userId === currentUser?._id;

  const { 
    data: profileUser, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useGetUserByIdQuery(profileUserId, {
    skip: !profileUserId
  });

  const { 
    data: works = [], 
    isLoading: isLoadingWorks,
    error: worksError 
  } = useGetWorksByUserIdQuery(profileUserId, {
    skip: !profileUserId
  });

  const { 
    data: collections = [], 
    isLoading: isLoadingCollections
  } = useGetCollectionsByUserIdQuery(profileUserId, {
    skip: !profileUserId
  });

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (userError) {
    console.error('User Error Details:', userError);
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {userError?.status === 404 ? 'User not found' : 'Error loading profile'}
          </h1>
          <p className="text-gray-400 mb-4">
            {userError?.data?.message || 'Unable to load user profile.'}
          </p>
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">User not found</h1>
          <p className="text-gray-400 mb-4">The user you're looking for doesn't exist.</p>
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isLoadingContent = isLoadingWorks || isLoadingCollections;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader 
          user={profileUser} 
          workCount={works?.length || 0} 
          isCurrentUser={isCurrentUser} 
        />
        
        {/* Tabs */}
        <div className="border-b border-gray-800 mb-8">
          <div className="flex space-x-8">
            <button 
              onClick={() => setActiveTab('works')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'works' 
                  ? 'border-purple-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              WORKS ({works?.length || 0})
            </button>
            <button 
              onClick={() => setActiveTab('collections')}
              className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'collections' 
                  ? 'border-purple-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              COLLECTIONS ({collections?.length || 0})
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {isLoadingContent ? (
            <div className="flex justify-center py-16">
              <Loader />
            </div>
          ) : (
            <>
              {activeTab === 'works' && (
                works?.length > 0 ? (
                  <MasonryGrid works={works} />
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🎨</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {isCurrentUser ? 'No works yet' : 'No works published'}
                    </h3>
                    <p className="text-gray-400">
                      {isCurrentUser 
                        ? 'Start creating and sharing your amazing work!' 
                        : 'This user hasn\'t published any works yet.'
                      }
                    </p>
                  </div>
                )
              )}
              
              {activeTab === 'collections' && (
                collections?.length > 0 ? (
                  <CollectionGrid collections={collections} />
                ) : (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {isCurrentUser ? 'No collections yet' : 'No collections created'}
                    </h3>
                    <p className="text-gray-400">
                      {isCurrentUser 
                        ? 'Organize your favorite works into collections!' 
                        : 'This user hasn\'t created any collections yet.'
                      }
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;