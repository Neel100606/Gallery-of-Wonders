import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import {
  useGetMyCollectionsQuery,
  useCreateCollectionMutation,
  useAddWorkToCollectionMutation,
  useRemoveWorkFromCollectionMutation,
} from "../redux/api/collectionApiSlice";
import Loader from "./Loader";

const AddToCollectionModal = ({ workId, onClose }) => {
  const [newCollectionName, setNewCollectionName] = useState("");
  
  // Fetch user's collections
  const { data: collections, isLoading, error, refetch } = useGetMyCollectionsQuery();
  
  // Mutations
  const [createCollection, { isLoading: isCreating }] = useCreateCollectionMutation();
  const [addWorkToCollection] = useAddWorkToCollectionMutation();
  const [removeWorkFromCollection] = useRemoveWorkFromCollectionMutation();
  
  useEffect(() => {
    // Refetch collections when modal opens to ensure data is fresh
    refetch();
  }, []);

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) {
      toast.error("Collection name cannot be empty");
      return;
    }
    try {
      await createCollection({ name: newCollectionName }).unwrap();
      toast.success(`'${newCollectionName}' created!`);
      setNewCollectionName("");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleToggleWorkInCollection = async (collection) => {
    const isWorkInCollection = collection.works.some(work => work._id === workId);
    const collectionId = collection._id;

    try {
      if (isWorkInCollection) {
        await removeWorkFromCollection({ collectionId, workId }).unwrap();
        toast.info(`Removed from '${collection.name}'`);
      } else {
        await addWorkToCollection({ collectionId, workId }).unwrap();
        toast.success(`Saved to '${collection.name}'`);
      }
    } catch (err) {
       toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Save to Collection</h2>
          <button onClick={onClose}><FaTimes /></button>
        </div>
        
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {isLoading && <Loader />}
          {error && <p className="text-red-500">Could not load collections.</p>}
          {collections && (
            <ul className="space-y-2">
              {collections.map((collection) => {
                const isWorkInCollection = collection.works.some(work => work._id === workId);
                return (
                  <li key={collection._id}>
                    <button
                      onClick={() => handleToggleWorkInCollection(collection)}
                      className={`w-full text-left p-3 rounded-md flex justify-between items-center transition ${
                        isWorkInCollection ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{collection.name}</span>
                      {isWorkInCollection && <FaCheck className="text-purple-600" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        <div className="p-4 border-t">
          <form onSubmit={handleCreateCollection} className="flex space-x-2">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Create a new collection"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="bg-purple-600 text-white p-2 rounded-md flex items-center justify-center disabled:opacity-50"
            >
              {isCreating ? <Loader /> : <FaPlus />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionModal;