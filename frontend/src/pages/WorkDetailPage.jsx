import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaUserCircle, FaRegBookmark } from "react-icons/fa";
import moment from "moment";

import { useGetWorkDetailsQuery, useToggleLikeMutation } from "../redux/api/worksApiSlice.js";
import { useGetCommentsForWorkQuery, useAddCommentToWorkMutation } from "../redux/api/commentsApiSlice.js";
import Loader from "../components/Loader";
import AddToCollectionModal from "../components/AddToCollectionModal";

const WorkDetailPage = () => {
  const { id: workId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [commentText, setCommentText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // RTK Query Hooks
  const { data: work, isLoading: isLoadingWork, error: workError, refetch: refetchWork } = useGetWorkDetailsQuery(workId);
  const { data: comments, isLoading: isLoadingComments, refetch: refetchComments } = useGetCommentsForWorkQuery(workId);
  
  const [toggleLike] = useToggleLikeMutation();
  const [addComment, { isLoading: isAddingComment }] = useAddCommentToWorkMutation();

  // Set initial selected image when work data loads
  useEffect(() => {
    if (work && work.fileUrls && work.fileUrls.length > 0) {
      setSelectedImage(work.fileUrls[0]);
    }
  }, [work]);

  const handleLike = async () => {
    if (!userInfo) {
      toast.error("Please log in to like a work");
      navigate("/login");
      return;
    }
    await toggleLike(workId);
    refetchWork();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await addComment({ workId, text: commentText }).unwrap();
      toast.success("Comment added!");
      setCommentText("");
      refetchComments();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoadingWork) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }
  
  if (workError) return <div className="text-red-500 text-center p-8">Error loading work details.</div>;

  const isLiked = userInfo ? work.likes.includes(userInfo._id) : false;

  return (
    <>
      {isModalOpen && <AddToCollectionModal workId={workId} onClose={() => setIsModalOpen(false)} />}

      <div className="container mx-auto p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img src={selectedImage || (work.fileUrls && work.fileUrls[0])} alt={work.title} className="w-full h-auto object-contain max-h-[70vh]" />
            </div>
            {work.fileUrls && work.fileUrls.length > 1 && (
              <div className="flex space-x-2">
                {work.fileUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`thumbnail ${index}`}
                    onClick={() => setSelectedImage(url)}
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === url ? 'border-purple-500' : 'border-transparent'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details & Comments Section */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{work.title}</h1>
            <Link to={`/artist/${work.user._id}`} className="text-lg text-gray-600 hover:text-purple-600 mb-4 inline-block">
              by {work.user.name}
            </Link>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{work.description}</p>

            {/* Action Buttons */}
            <div className="flex items-center space-x-6 mb-8">
              <button onClick={handleLike} className="flex items-center space-x-2 text-xl text-gray-700 hover:text-red-500">
                {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                <span>{work.likes.length}</span>
              </button>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 text-xl text-gray-700 hover:text-purple-600">
                <FaRegBookmark />
                <span>Save</span>
              </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b pb-2">Comments</h2>
              
              {userInfo && (
                <form onSubmit={handleCommentSubmit} className="flex flex-col space-y-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add your comment..."
                    className="w-full p-2 border rounded-md focus:ring-purple-500 focus:border-purple-500"
                    rows="3"
                  ></textarea>
                  <button type="submit" disabled={isAddingComment} className="self-end bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50">
                    {isAddingComment ? "Posting..." : "Post Comment"}
                  </button>
                </form>
              )}

              {isLoadingComments ? (
                <p>Loading comments...</p>
              ) : comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-3">
                    {comment.user.profileImage ? (
                      <img src={comment.user.profileImage} alt={comment.user.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <FaUserCircle className="w-10 h-10 text-gray-400" />
                    )}
                    <div>
                      <p className="font-semibold">{comment.user.name} <span className="text-xs text-gray-500 font-normal">{moment(comment.createdAt).fromNow()}</span></p>
                      <p className="text-gray-800">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkDetailPage;