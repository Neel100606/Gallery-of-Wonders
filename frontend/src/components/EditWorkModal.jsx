import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetWorkDetailsQuery, useUpdateWorkMutation } from '../redux/api/worksApiSlice';
import Loader from './Loader';

const EditWorkModal = ({ isOpen, onClose, workId }) => {
  const { data: work, isLoading: isLoadingWork } = useGetWorkDetailsQuery(workId, { skip: !isOpen });
  const [updateWork, { isLoading: isUpdating }] = useUpdateWorkMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (work) {
      setTitle(work.title);
      setDescription(work.description);
      setCategory(work.category);
    }
  }, [work]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = { title, description, category };
      await updateWork({ workId, formData }).unwrap();
      toast.success('Work updated successfully!');
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update work.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-2xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Work</h2>
        
        {isLoadingWork ? (
          <div className="flex justify-center my-8">
            <Loader />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows="3" 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Art">Art</option>
                <option value="Photography">Photography</option>
                <option value="Writing">Writing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <button 
                type="button" 
                onClick={onClose} 
                className="bg-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isUpdating} 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-400"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditWorkModal;