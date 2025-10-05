import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCollectionDetailsQuery } from '../redux/api/collectionApiSlice';
import Loader from '../components/Loader';
import WorkGrid from '../components/WorkGrid';

const CollectionDetailPage = () => {
  const { id: collectionId } = useParams();
  const { data: collection, isLoading, error } = useGetCollectionDetailsQuery(collectionId);

  if (isLoading) {
    return <div className="flex justify-center mt-20"><Loader /></div>;
  }

  if (error || !collection) {
    return <div className="text-center mt-20 text-red-500">Could not load collection. It may be private or does not exist.</div>;
  }

  const userName = collection.user ? collection.user.name : 'A User';
  const userProfileLink = collection.user ? `/profile/${collection.user._id}` : '#';

  return (
    <div className="container mx-auto max-w-5xl p-4 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{collection.name}</h1>
        <p className="text-gray-600 mt-2">{collection.description}</p>
        <p className="text-sm text-gray-500 mt-1">
          A collection by <Link to={userProfileLink} className="font-semibold hover:underline">{userName}</Link>
        </p>
      </div>
      
      {collection.works && collection.works.length > 0 ? (
        <WorkGrid works={collection.works} />
      ) : (
        <p className="text-center text-gray-500">This collection is empty.</p>
      )}
    </div>
  );
};

export default CollectionDetailPage;