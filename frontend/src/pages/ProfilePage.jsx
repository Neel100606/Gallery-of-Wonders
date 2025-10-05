import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetUserByIdQuery } from '../redux/api/usersApiSlice';
import { useGetWorksByUserIdQuery } from '../redux/api/worksApiSlice';
import { useGetCollectionsByUserIdQuery } from '../redux/api/collectionApiSlice';

import Loader from '../components/Loader';
import ProfileHeader from '../components/ProfileHeader';
import WorkGrid from '../components/WorkGrid';
import CollectionGrid from '../components/CollectionGrid';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('works'); // State for tabs
  const { userId } = useParams();
  const { userInfo: currentUser } = useSelector((state) => state.auth);

  const profileUserId = userId || currentUser._id;
  const isCurrentUser = !userId || userId === currentUser._id;

  // Fetch all data concurrently
  const { data: profileUser, isLoading: isLoadingUser } = useGetUserByIdQuery(profileUserId);
  const { data: works, isLoading: isLoadingWorks } = useGetWorksByUserIdQuery(profileUserId);
  const { data: collections, isLoading: isLoadingCollections } = useGetCollectionsByUserIdQuery(profileUserId);

  if (isLoadingUser || isLoadingWorks || isLoadingCollections) {
    return <div className="flex justify-center mt-20"><Loader /></div>;
  }
  
  if (!profileUser) {
    return <div className="text-center mt-20">User not found.</div>
  }

  return (
    <div className="container mx-auto max-w-5xl">
      <ProfileHeader user={profileUser} workCount={works?.length || 0} isCurrentUser={isCurrentUser} />
      
      {/* Tabs Navigation */}
      <div className="border-b">
        <div className="flex justify-center space-x-8">
          <button 
            onClick={() => setActiveTab('works')}
            className={`py-4 px-2 text-sm font-medium ${activeTab === 'works' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500'}`}
          >
            WORKS
          </button>
          <button 
            onClick={() => setActiveTab('collections')}
            className={`py-4 px-2 text-sm font-medium ${activeTab === 'collections' ? 'border-b-2 border-gray-800 text-gray-800' : 'text-gray-500'}`}
          >
            COLLECTIONS
          </button>
        </div>
      </div>

      {/* Conditional Content */}
      <div className="p-4 sm:p-8">
        {activeTab === 'works' && (
          works && works.length > 0 ? <WorkGrid works={works} /> : <p className="text-center text-gray-500">No works yet.</p>
        )}
        {activeTab === 'collections' && (
          collections && collections.length > 0 ? <CollectionGrid collections={collections} /> : <p className="text-center text-gray-500">No collections yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;