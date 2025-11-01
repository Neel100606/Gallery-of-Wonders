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

  const openEditModal = () => {
    setEditModalOpen(true);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="relative">
        <button 
          onClick={() => setMenuOpen(!isMenuOpen)} 
          className="p-1 rounded-lg hover:bg-gray-700 text-gray-400"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-10">
            <button
              onClick={openEditModal}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 disabled:opacity-50"
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