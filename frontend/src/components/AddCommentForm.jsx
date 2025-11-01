import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAddCommentToWorkMutation } from '../redux/api/commentsApiSlice';

const AddCommentForm = ({ workId }) => {
  const [text, setText] = useState('');
  const [addComment, { isLoading }] = useAddCommentToWorkMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await addComment({ workId, text }).unwrap();
      setText('');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add comment');
    }
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default AddCommentForm;