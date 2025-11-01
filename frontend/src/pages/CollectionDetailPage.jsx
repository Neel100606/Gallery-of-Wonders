import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCollectionDetailsQuery } from '../redux/api/collectionApiSlice.js';
import Loader from '../components/Loader';
import MasonryGrid from '../components/MasonryGrid';

const CollectionDetailPage = () => {
  const { id: collectionId } = useParams();
  const { data: collection, isLoading, error } = useGetCollectionDetailsQuery(collectionId);

  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">Collection not found</h1>
          <p className="text-gray-400 mb-4">This collection may be private or doesn't exist.</p>
          <Link to="/" className="text-purple-400 hover:text-purple-300">Go back home</Link>
        </div>
      </div>
    );
  }

  const userName = collection.user?.name || 'A User';
  const userProfileLink = collection.user?._id ? `/profile/${collection.user._id}` : '#';

  // Fix: Ensure works have user data, fallback to collection user if missing
  const worksWithUser = collection.works?.map(work => ({
    ...work,
    user: work.user || collection.user // Fallback to collection owner if work user is missing
  })) || [];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{collection.name}</h1>
          {collection.description && (
            <p className="text-gray-400 max-w-2xl mx-auto">{collection.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            A collection by{' '}
            <Link to={userProfileLink} className="text-purple-400 hover:text-purple-300">
              {userName}
            </Link>
          </p>
          <div className="flex justify-center items-center space-x-6 mt-4 text-sm text-gray-400">
            <span>{collection.works?.length || 0} works</span>
          </div>
        </div>
        
        {/* Works */}
        {worksWithUser.length > 0 ? (
          <MasonryGrid works={worksWithUser} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">Empty Collection</h3>
            <p className="text-gray-400">This collection doesn't have any works yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailPage;