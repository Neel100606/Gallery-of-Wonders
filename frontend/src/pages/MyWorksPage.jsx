import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useGetMyWorksQuery, useDeleteWorkMutation } from '../redux/api/worksApiSlice.js';
import Loader from '../components/Loader.jsx';

const MyWorksPage = () => {
  const { data: works, isLoading, error, refetch } = useGetMyWorksQuery();
  const [deleteWork, { isLoading: isDeleting }] = useDeleteWorkMutation();

  const handleDelete = async (workId) => {
    if (window.confirm('Are you sure you want to delete this work? This action is permanent.')) {
      try {
        await deleteWork(workId).unwrap();
        toast.success('Work deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  if (isLoading) return <div className="min-h-screen flex justify-center items-center"><Loader /></div>;
  if (error) return <div className="text-red-500 text-center p-8">Error: {error?.data?.message || error.error}</div>;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">My Uploaded Works</h1>

      {works.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-slate-700">You haven't uploaded any work yet.</h2>
          <p className="text-slate-500 mt-2">
            Click the button below to share your first masterpiece!
          </p>
          <Link to="/work/create" className="mt-4 inline-block bg-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-purple-700">
            Upload Work
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {works.map(work => (
              <li key={work._id} className="p-4 flex flex-col sm:flex-row justify-between items-center hover:bg-gray-50">
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <img src={work.fileUrls[0]} alt={work.title} className="w-16 h-16 object-cover rounded-md" />
                  <div>
                    <Link to={`/work/${work._id}`} className="font-semibold text-lg text-slate-800 hover:text-purple-600">{work.title}</Link>
                    <p className="text-sm text-slate-500">{work.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link to={`/work/edit/${work._id}`} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100">
                    <FaEdit size={20} />
                  </Link>
                  <button onClick={() => handleDelete(work._id)} disabled={isDeleting} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 disabled:opacity-50">
                    <FaTrash size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyWorksPage;