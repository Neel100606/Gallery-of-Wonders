import React from 'react';
import Comment from './Comment';

const CommentList = ({ comments }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {comments && comments.length > 0 ? (
        comments.map((comment) => <Comment key={comment._id} comment={comment} />)
      ) : (
        <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentList;