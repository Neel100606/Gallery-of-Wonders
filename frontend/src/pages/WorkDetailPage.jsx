import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetWorkDetailsQuery } from '../redux/api/worksApiSlice';
import { useGetCommentsForWorkQuery } from '../redux/api/commentsApiSlice';
import Loader from '../components/Loader';
import CommentList from '../components/CommentList';
import AddCommentForm from '../components/AddCommentForm';
import ImageCarousel from '../components/ImageCarousel'; // 👈 Import the new component

const WorkDetailPage = () => {
  const { id: workId } = useParams();

  const { data: work, isLoading: isLoadingWork, error: workError } = useGetWorkDetailsQuery(workId);
  const { data: comments, isLoading: isLoadingComments } = useGetCommentsForWorkQuery(workId);

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

  const userName = work.user ? work.user.name : 'Unknown Artist';
  const userProfileImage = work.user ? work.user.profileImage : '/default-avatar.png';
  const userProfileLink = work.user ? `/profile/${work.user._id}` : '#';

  return (
    <div className="container mx-auto mt-10 max-w-6xl">
      <div className="flex flex-col md:flex-row border rounded-lg shadow-lg overflow-hidden min-h-[80vh]">
        {/* Left Column: Image Carousel */}
        <div className="w-full md:w-1/2 bg-black">
          {/* 👇 Replace the single image with the carousel component */}
          <ImageCarousel images={work.fileUrls} />
        </div>

        {/* Right Column: Details & Comments */}
        <div className="w-full md:w-1/2 flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center p-4 border-b">
            <Link to={userProfileLink}>
              <img src={userProfileImage} alt={userName} className="h-10 w-10 rounded-full object-cover" />
            </Link>
            <div className="ml-3">
              <Link to={userProfileLink} className="text-sm font-semibold text-gray-800">
                {userName}
              </Link>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 border-b">
              <p className="text-sm">
                <span className="font-semibold text-gray-800 mr-2">{work.title}</span>
                <span className="text-gray-600">{work.description}</span>
              </p>
          </div>
          
          {/* Comment List */}
          <CommentList comments={comments} />

          {/* Action Bar & Likes */}
           <div className="border-t p-4">
             <p className="font-semibold text-gray-800 text-sm">{work.likes.length} likes</p>
           </div>
          
          {/* Add Comment Form */}
          <AddCommentForm workId={workId} />
        </div>
      </div>
    </div>
  );
};

export default WorkDetailPage;