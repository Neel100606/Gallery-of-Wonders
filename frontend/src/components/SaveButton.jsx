import React, { useState, useEffect } from 'react';
import { useAddWorkToCollectionMutation, useRemoveWorkFromCollectionMutation, useCreateCollectionMutation } from '../redux/api/collectionApiSlice';
import { useGetMyCollectionsQuery } from '../redux/api/collectionApiSlice';
import { useDispatch } from 'react-redux';
import { apiSlice } from '../redux/api/apiSlice';

const SaveButton = ({ workId, onSaveUpdate }) => {
  const [savedCollectionIds, setSavedCollectionIds] = useState([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const { data: collections = [], refetch: refetchCollections } = useGetMyCollectionsQuery();
  const [addWorkToCollection] = useAddWorkToCollectionMutation();
  const [removeWorkFromCollection] = useRemoveWorkFromCollectionMutation();
  const [createCollection] = useCreateCollectionMutation();
  const dispatch = useDispatch();

  // Check which collections contain this work
  useEffect(() => {
    if (collections && workId) {
      const savedCollections = collections.filter(collection => 
        collection.works?.some(work => work._id === workId)
      );
      setSavedCollectionIds(savedCollections.map(collection => collection._id));
    }
  }, [collections, workId]);

  const isWorkSaved = savedCollectionIds.length > 0;

  const handleAddToCollection = async (collectionId) => {
    try {
      await addWorkToCollection({ 
        collectionId, 
        workId 
      }).unwrap();
      
      // Update saved collections
      setSavedCollectionIds(prev => [...prev, collectionId]);
      
      // Update the work data in cache for immediate UI update
      dispatch(
        apiSlice.util.updateQueryData('getWorkDetails', workId, (draft) => {
          if (draft) {
            draft.saves = (draft.saves || 0) + 1;
          }
        })
      );
      
      // Also update the works list cache if needed
      dispatch(
        apiSlice.util.updateQueryData('getWorks', undefined, (draft) => {
          const workToUpdate = draft?.find(work => work._id === workId);
          if (workToUpdate) {
            workToUpdate.saves = (workToUpdate.saves || 0) + 1;
          }
        })
      );
      
      // Notify parent component
      if (onSaveUpdate) {
        onSaveUpdate();
      }
      
      console.log('Work added to collection');
      
    } catch (error) {
      console.error('Error adding to collection:', error);
      alert('Failed to add work to collection. Please try again.');
    }
  };

  const handleRemoveFromCollection = async (collectionId) => {
    try {
      await removeWorkFromCollection({ 
        collectionId, 
        workId 
      }).unwrap();
      
      // Update saved collections
      setSavedCollectionIds(prev => prev.filter(id => id !== collectionId));
      
      // Update the work data in cache for immediate UI update
      dispatch(
        apiSlice.util.updateQueryData('getWorkDetails', workId, (draft) => {
          if (draft) {
            draft.saves = Math.max(0, (draft.saves || 0) - 1);
          }
        })
      );
      
      // Also update the works list cache if needed
      dispatch(
        apiSlice.util.updateQueryData('getWorks', undefined, (draft) => {
          const workToUpdate = draft?.find(work => work._id === workId);
          if (workToUpdate) {
            workToUpdate.saves = Math.max(0, (workToUpdate.saves || 0) - 1);
          }
        })
      );
      
      // Notify parent component
      if (onSaveUpdate) {
        onSaveUpdate();
      }
      
      console.log('Work removed from collection');
      
    } catch (error) {
      console.error('Error removing from collection:', error);
      alert('Failed to remove work from collection. Please try again.');
    }
  };

  const handleToggleCollection = (collectionId, isCurrentlySaved) => {
    if (isCurrentlySaved) {
      handleRemoveFromCollection(collectionId);
    } else {
      handleAddToCollection(collectionId);
    }
  };

  const handleQuickSave = async () => {
    setShowCollectionModal(true);
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      alert('Please enter a collection name');
      return;
    }

    setIsCreating(true);
    try {
      const newCollection = await createCollection({
        name: newCollectionName,
        description: newCollectionDescription,
        isPrivate: false
      }).unwrap();

      // Refetch collections to get the new one
      await refetchCollections();
      
      // Add the work to the newly created collection
      await handleAddToCollection(newCollection._id);
      
      // Reset form
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowCreateCollection(false);
      
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateCollection(false);
    setNewCollectionName('');
    setNewCollectionDescription('');
  };

  return (
    <>
      <button
        onClick={handleQuickSave}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isWorkSaved 
            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }`}
      >
        <span>{isWorkSaved ? '📚' : '💾'}</span>
        <span>
          {isWorkSaved 
            ? `Saved (${savedCollectionIds.length})` 
            : 'Save'
          }
        </span>
      </button>

      {/* Collection Selection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-96 max-w-md border border-gray-700 max-h-96 overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4">
              {showCreateCollection ? 'Create New Collection' : 'Manage Collections'}
            </h3>
            
            {showCreateCollection ? (
              // Create Collection Form
              <form onSubmit={handleCreateCollection} className="space-y-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    placeholder="Enter collection name"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newCollectionDescription}
                    onChange={(e) => setNewCollectionDescription(e.target.value)}
                    placeholder="Describe your collection"
                    rows="3"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelCreate}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    disabled={isCreating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isCreating || !newCollectionName.trim()}
                  >
                    {isCreating ? 'Creating...' : 'Create & Save'}
                  </button>
                </div>
              </form>
            ) : (
              // Collection Selection List
              <>
                <div className="space-y-2 max-h-60 overflow-y-auto flex-1">
                  {collections && collections.length > 0 ? (
                    collections.map(collection => {
                      const isSaved = savedCollectionIds.includes(collection._id);
                      return (
                        <button
                          key={collection._id}
                          onClick={() => handleToggleCollection(collection._id, isSaved)}
                          className={`w-full text-left p-3 rounded-lg transition-colors text-white group ${
                            isSaved 
                              ? 'bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30' 
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          <div className="font-medium flex items-center justify-between">
                            <span>{collection.name}</span>
                            {isSaved && (
                              <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                ✓ Saved
                              </span>
                            )}
                          </div>
                          {collection.description && (
                            <div className="text-sm text-gray-400 mt-1">{collection.description}</div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            {collection.works?.length || 0} works
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-4xl mb-2">📁</div>
                      <p className="text-gray-400">No collections found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Create your first collection to save works
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setShowCreateCollection(true)}
                    className="flex items-center space-x-2 px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <span>+</span>
                    <span>Create New Collection</span>
                  </button>
                  <button
                    onClick={() => setShowCollectionModal(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SaveButton;