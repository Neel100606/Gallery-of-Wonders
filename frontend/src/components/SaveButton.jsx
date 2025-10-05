import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CollectionModal from './CollectionModal';
import { useGetMyCollectionsQuery } from '../redux/api/collectionApiSlice';

const SaveButton = ({ workId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  // Fetch the user's collections to check if this work is saved
  const { data: collections } = useGetMyCollectionsQuery();

  // If the user isn't logged in, show a link to the login page
  if (!userInfo) {
    return (
      <Link to="/login" className="ml-auto" aria-label="Log in to save">
        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
      </Link>
    );
  }

  // Determine if the work is in any of the user's collections
  const isSaved = collections?.some(collection => 
    collection.works.some(workInCollection => workInCollection._id === workId)
  );

  return (
    <>
      <button 
        onClick={() => setModalOpen(true)}
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 ml-auto"
        aria-label="Save to collection"
      >
        {isSaved ? (
          // Filled Icon (Saved)
          <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21z"></path></svg>
        ) : (
          // Outlined Icon (Not Saved)
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        )}
      </button>

      <CollectionModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)}
        workId={workId}
      />
    </>
  );
};

export default SaveButton;