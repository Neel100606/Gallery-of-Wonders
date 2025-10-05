import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDeleteWorkMutation } from '../redux/api/worksApiSlice';
import EditWorkModal from './EditWorkModal';

const WorkOptionsMenu = ({ work }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [deleteWork, { isLoading: isDeleting }] = useDeleteWorkMutation();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this work? This action cannot be undone.')) {
      try {
        await deleteWork(work._id).unwrap();
        toast.success('Work deleted successfully.');
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete work.');
      }
    }
  };

  return (
    <>
      <div className="relative ml-auto">
        <button onClick={() => setMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
        </button>

        {isMenuOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
            <button
              onClick={() => { setEditModalOpen(true); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      <EditWorkModal 
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        workId={work._id}
      />
    </>
  );
};

export default WorkOptionsMenu;