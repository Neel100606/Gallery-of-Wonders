import { Link } from 'react-router-dom';
import { useGetMyCollectionsQuery } from '../redux/api/collectionApiSlice';
import CollectionCard from '../components/CollectionCard';
import Loader from '../components/Loader';

const MyCollectionsPage = () => {
  const { data: collections, isLoading, error } = useGetMyCollectionsQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-8">Error loading collections.</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Collections</h1>
        {/* We can add a "Create New" button here later if needed */}
      </div>

      {collections.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-slate-700">No collections yet!</h2>
          <p className="text-slate-500 mt-2">
            Start by saving works you love from the{' '}
            <Link to="/gallery" className="text-purple-600 hover:underline">
              gallery
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection._id} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCollectionsPage;