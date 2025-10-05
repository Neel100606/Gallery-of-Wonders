import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetWorkDetailsQuery, useUpdateWorkMutation } from '../redux/api/worksApiSlice.js';
import { FaUpload, FaTimesCircle } from 'react-icons/fa';
import Loader from '../components/Loader.jsx';

const EditWorkPage = () => {
  const { id: workId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Art');
  const [fileUrls, setFileUrls] = useState([]);

  // Fetch existing work data
  const { data: work, isLoading: isLoadingDetails, error } = useGetWorkDetailsQuery(workId);
  const [updateWork, { isLoading: isUpdating }] = useUpdateWorkMutation();

  // Populate form with fetched data
  useEffect(() => {
    if (work) {
      setTitle(work.title);
      setDescription(work.description);
      setCategory(work.category);
      setFileUrls(work.fileUrls);
    }
  }, [work]);

  const handleFileUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        multiple: true,
        maxFiles: 5,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setFileUrls(prevUrls => [...prevUrls, result.info.secure_url]);
          toast.success('File uploaded successfully!');
        } else if (error) {
          toast.error(error.message || 'File upload failed.');
        }
      }
    );
    widget.open();
  };

  const removeFileUrl = (urlToRemove) => {
    setFileUrls(fileUrls.filter(url => url !== urlToRemove));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = { title, description, category, fileUrls };
      await updateWork({ workId, formData }).unwrap();
      toast.success('Work updated successfully!');
      navigate('/my-works');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  
  if (isLoadingDetails) return <div className="min-h-screen flex justify-center items-center"><Loader /></div>;
  if (error) return <div className="text-red-500 text-center p-8">Error loading work details.</div>;

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Edit Work</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                <option>Art</option>
                <option>Photography</option>
                <option>Writing</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Attached File(s)</label>
              <div className="flex flex-wrap gap-4 mb-4">
                {fileUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img src={url} alt={`Preview ${index + 1}`} className="h-24 w-24 rounded-md object-cover" />
                    <button type="button" onClick={() => removeFileUrl(url)} className="absolute -top-2 -right-2 bg-white rounded-full">
                      <FaTimesCircle className="text-red-500 text-xl" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={handleFileUpload} className="w-full py-2 px-4 rounded-lg font-medium text-purple-600 border border-purple-600 hover:bg-purple-50 flex justify-center items-center">
                <FaUpload className="mr-2" /> Upload More File(s)
              </button>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">Title <span className="text-red-500">*</span></label>
              <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
              <textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full px-4 py-3 border border-slate-300 rounded-lg"></textarea>
            </div>

            <button type="submit" disabled={isUpdating} className="w-full py-3 px-4 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 flex justify-center items-center disabled:opacity-50">
              {isUpdating ? <Loader /> : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditWorkPage;