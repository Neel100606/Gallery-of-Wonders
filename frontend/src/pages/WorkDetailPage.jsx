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
import SimilarWorks from '../components/SimilarWorks';

const WorkDetailPage = () => {
  const { id: workId } = useParams();
  const dispatch = useDispatch();
  const { data: work, isLoading: isLoadingWork, error: workError, refetch: refetchWork } = useGetWorkDetailsQuery(workId);
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

  const handleSaveUpdate = () => {
    refetchWork();
  };

  if (isLoadingWork || isLoadingComments) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (workError || !work) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-center">
        <div>
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-white mb-2">Work not found</h1>
          <Link to="/" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // FIX: Properly handle user data with fallbacks
  const userName = work.user?.name || 'Unknown Artist';
  const userProfileImage = work.user?.profileImage || '/default-avatar.png';
  const userProfileLink = work.user?._id ? `/profile/${work.user._id}` : '#';

  console.log('WorkDetail User Debug:', {
    workUser: work.user,
    userName,
    userProfileImage,
    userProfileLink,
    tags: work.tags // Debug tags
  });

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Work Content */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 mb-8 flex flex-col lg:flex-row">
          
          {/* Left: Image / Writing */}
          {work.category === 'Writing' ? (
            <div className="w-full lg:w-1/2 p-8 overflow-y-auto">
              <h1 className="text-4xl font-bold text-white mb-4">{work.title}</h1>
              {work.summary && (
                <div className="bg-gray-700/50 rounded-xl p-4 mb-6 border-l-4 border-purple-500">
                  <h3 className="text-sm text-purple-400 font-semibold mb-2 uppercase">Summary</h3>
                  <p className="text-gray-300">{work.summary}</p>
                </div>
              )}
              <p className="text-gray-300 whitespace-pre-wrap">{work.description}</p>
            </div>
          ) : (
            <div className="w-full lg:w-1/2 bg-black p-6 flex items-center justify-center">
              <ImageCarousel images={work.fileUrls} />
            </div>
          )}

          {/* Right: Details */}
          <div className="w-full lg:w-1/2 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-700">
            {/* User Info - FIXED: Proper conditional rendering */}
            <div className="flex items-center p-6 border-b border-gray-700 bg-gray-800/50">
              {work.user?._id ? (
                <Link to={userProfileLink} className="flex items-center space-x-3 group">
                  <img
                    src={userProfileImage}
                    alt={userName}
                    className="h-12 w-12 rounded-xl object-cover border-2 border-gray-600 group-hover:border-purple-500 transition-colors"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div>
                    <div className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {userName}
                    </div>
                    <div className="text-sm text-gray-400">Creator</div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center space-x-3">
                  <img
                    src={userProfileImage}
                    alt={userName}
                    className="h-12 w-12 rounded-xl object-cover border-2 border-gray-600"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div>
                    <div className="text-lg font-semibold text-white">{userName}</div>
                    <div className="text-sm text-gray-400">Creator</div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-2">{work.title}</h2>
              <p className="text-gray-300 mb-4">{work.description}</p>

              {/* Tags Section - Added here */}
              {work.tags && work.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {work.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="px-3 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-sm font-medium rounded-lg border border-purple-500/30 hover:from-purple-600/30 hover:to-blue-600/30 hover:border-purple-400/50 transition-all duration-200 cursor-default"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center bg-gray-700/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{work.likes?.length || 0}</div>
                  <div className="text-xs text-gray-400 uppercase">Likes</div>
                </div>
                <div className="text-center bg-gray-700/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{comments?.length || 0}</div>
                  <div className="text-xs text-gray-400 uppercase">Comments</div>
                </div>
                <div className="text-center bg-gray-700/30 rounded-lg p-3">
                  <div className="text-2xl font-bold text-white">{work.saves || 0}</div>
                  <div className="text-xs text-gray-400 uppercase">Saves</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4 mb-6">
                <LikeButton work={work} />
                <SaveButton workId={workId} onSaveUpdate={handleSaveUpdate} />
              </div>

              {/* Comments */}
              <h3 className="text-lg font-semibold text-white mb-3">
                Comments ({comments?.length || 0})
              </h3>
              <div className="max-h-80 overflow-y-auto">
                <CommentList comments={comments} />
              </div>
              <div className="mt-4">
                <AddCommentForm workId={workId} />
              </div>
            </div>
          </div>
        </div>

        <SimilarWorks workId={workId} category={work.category} />
      </div>
    </div>
  );
};

export default WorkDetailPage;