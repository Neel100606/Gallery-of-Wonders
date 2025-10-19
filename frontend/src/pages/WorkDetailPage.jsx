import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetWorkDetailsQuery } from '../redux/api/worksApiSlice';
import { useGetCommentsForWorkQuery } from '../redux/api/commentsApiSlice';
import { socket } from '../socket';
import { apiSlice } from '../redux/api/apiSlice';
import Loader from '../components/Loader';
import CommentList from '../components/CommentList';
import AddCommentForm from '../components/AddCommentForm';
import ImageCarousel from '../components/ImageCarousel';
import LikeButton from '../components/LikeButton';
import SaveButton from '../components/SaveButton';

const WorkDetailPage = () => {
  const { id: workId } = useParams();
  const dispatch = useDispatch();
  const { data: work, isLoading: isLoadingWork, error: workError } = useGetWorkDetailsQuery(workId);
  const { data: comments, isLoading: isLoadingComments } = useGetCommentsForWorkQuery(workId);

  useEffect(() => {
    socket.emit('joinWorkRoom', workId);

    const handleNewComment = (newComment) => {
      dispatch(
        apiSlice.util.updateQueryData('getCommentsForWork', workId, (draft) => {
          draft.unshift(newComment);
        })
      );
    };

    socket.on('newComment', handleNewComment);

    return () => {
      socket.emit('leaveWorkRoom', workId);
      socket.off('newComment', handleNewComment);
    };
  }, [workId, dispatch]);

  if (isLoadingWork || isLoadingComments) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (workError) {
    return <div className="text-center mt-10 text-red-500">Error: {workError?.data?.message || 'Could not fetch work'}</div>;
  }

  // Prevents crash by ensuring 'work' exists before rendering
  if (!work) {
    return <div className="text-center mt-10">Work not found.</div>;
  }

  const userName = work.user ? work.user.name : 'Unknown Artist';
  const userProfileImage = work.user ? work.user.profileImage : '/default-avatar.png';
  const userProfileLink = work.user ? `/profile/${work.user._id}` : '#';

  return (
    <div className="container mx-auto my-10 max-w-6xl">
      <div className="flex flex-col md:flex-row border rounded-lg shadow-lg overflow-hidden min-h-[80vh]">
        
        {/* Left Column: Image or Text Content */}
        {work.category === 'Writing' ? (
          <div className="w-full md:w-1/2 flex flex-col bg-white p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold mb-4">{work.title}</h1>
            
            {/* Unlabeled Summary */}
            {work.summary && (
                <p className="text-gray-600 italic border-l-4 border-gray-200 pl-4 mb-6">
                  {work.summary}
                </p>
            )}

            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
              {work.description}
            </div>
          </div>
        ) : (
          <div className="w-full md:w-1/2 bg-black">
            <ImageCarousel images={work.fileUrls} />
          </div>
        )}

        {/* Right Column: Details & Comments */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          <div className="flex items-center p-4 border-b flex-shrink-0">
            <Link to={userProfileLink}>
              <img src={userProfileImage} alt={userName} className="h-10 w-10 rounded-full object-cover" />
            </Link>
            <div className="ml-3">
              <Link to={userProfileLink} className="text-sm font-semibold text-gray-800">{userName}</Link>
            </div>
          </div>

          <div className="p-4 border-b flex-shrink-0">
            <p className="text-sm">
              <span className="font-semibold text-gray-800 mr-2">{work.title}</span>
              {work.category !== 'Writing' && <span className="text-gray-600">{work.description}</span>}
            </p>
            {work.tags && work.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {work.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex-grow overflow-y-auto">
            <CommentList comments={comments} />
          </div>

          <div className="border-t p-4 flex-shrink-0">
            <div className="flex items-center space-x-4 mb-2">
              <LikeButton work={work} />
              <Link to={`/work/${work._id}#comments`} className="text-gray-600 hover:text-blue-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></Link>
              <SaveButton workId={workId} />
            </div>
            <p className="font-semibold text-gray-800 text-sm">{work.likes.length} likes</p>
          </div>

          <div className="flex-shrink-0">
            <AddCommentForm workId={workId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkDetailPage;