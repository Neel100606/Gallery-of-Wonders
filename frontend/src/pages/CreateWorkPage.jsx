import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateWorkMutation } from '../redux/api/worksApiSlice';
import { FaUpload, FaTimesCircle } from 'react-icons/fa';

const Loader = () => (<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>);

const CreateWorkPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Art');
    const [fileUrls, setFileUrls] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();
    const [createWork, { isLoading }] = useCreateWorkMutation();

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
                    toast.success(`${result.info.original_filename} uploaded successfully!`);
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
            // Validation: File is required only for Art and Photography
            if ((category === 'Art' || category === 'Photography') && fileUrls.length === 0) {
                toast.error('Please upload at least one image for this category.');
                return;
            }
            await createWork({ title, description, category, fileUrls }).unwrap();
            toast.success('Work created successfully!');
            navigate('/gallery');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    // 👇 MODIFIED: Determine when to show the file uploader
    const shouldShowUploader = ['Art', 'Photography', 'Other'].includes(category);

    // 👇 MODIFIED: Determine when the description is the primary content
    const isTextPrimary = ['Writing', 'Other'].includes(category);

    return (
        <div className="bg-slate-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Create New Work</h1>

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

                        {/* Conditional File Upload Section */}
                        {shouldShowUploader && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Attach File(s)
                                    {category !== 'Other' && <span className="text-red-500">*</span>}
                                </label>
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
                                    <FaUpload className="mr-2" /> Upload File(s)
                                </button>
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                {isTextPrimary ? 'Content / Details' : 'Description'} <span className="text-red-500">*</span>
                            </label>
                            <textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} rows={isTextPrimary ? 12 : 4} className="w-full px-4 py-3 border border-slate-300 rounded-lg"></textarea>
                        </div>

                        <button type="submit" disabled={isLoading || isUploading} className="w-full py-3 px-4 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 flex justify-center items-center disabled:opacity-50">
                            {isLoading || isUploading ? <Loader /> : 'Submit Your Work'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateWorkPage;