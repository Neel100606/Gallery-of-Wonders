import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaTrash, FaTimes } from 'react-icons/fa';
import {
  useGetCollectionDetailsQuery,
  useRemoveWorkFromCollectionMutation,
  useDeleteCollectionMutation,
} from '../redux/api/collectionApiSlice';
import WorkCard from '../components/WorkCard';
import Loader from '../components/Loader';

const CollectionDetailPage = () => {
  const { id: collectionId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: collection, isLoading, error } = useGetCollectionDetailsQuery(collectionId);
  const [removeWork, { isLoading: isRemoving }] = useRemoveWorkFromCollectionMutation();
  const [deleteCollection, { isLoading: isDeleting }] = useDeleteCollectionMutation();

  const handleRemoveWork = async (workId) => {
    if (window.confirm('Are you sure you want to remove this work from the collection?')) {
      try {
        await removeWork({ collectionId, workId }).unwrap();
        toast.success('Work removed from collection');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleDeleteCollection = async () => {
    if (window.confirm('Are you sure you want to permanently delete this collection?')) {
      try {
        await deleteCollection(collectionId).unwrap();
        toast.success('Collection deleted');
        navigate('/my-collections');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Loader /></div>;
  if (error) return <div className="text-red-500 text-center p-8">Error: {error?.data?.message || error.error}</div>;

  const isOwner = userInfo && userInfo._id === collection?.user?._id;

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">{collection.name}</h1>
            <p className="text-slate-600 mt-2">{collection.description}</p>
          </div>
          {isOwner && (
            <button
              onClick={handleDeleteCollection}
              disabled={isDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 disabled:opacity-50"
            >
              <FaTrash />
              {isDeleting ? 'Deleting...' : 'Delete Collection'}
            </button>
          )}
        </div>

        <hr className="my-8" />

        {collection.works.length === 0 ? (
          <p className="text-center text-slate-600">This collection is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {collection.works.map((work) => (
              <div key={work._id} className="relative">
                <WorkCard work={work} />
                {isOwner && (
                  <button
                    onClick={() => handleRemoveWork(work._id)}
                    disabled={isRemoving}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                    title="Remove from collection"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionDetailPage;