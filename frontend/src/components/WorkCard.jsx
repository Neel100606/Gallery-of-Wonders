import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import WorkOptionsMenu from './WorkOptionsMenu';

const WorkCard = ({ work }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const userName = work.user ? work.user.name : 'Unknown Artist';
  const userProfileImage = work.user ? work.user.profileImage : 'https://res.cloudinary.com/dw3dkqiac/image/upload/v1759513698/zqzrken305a14txbfjmv.jpg';
  const userProfileLink = work.user ? `/profile/${work.user._id}` : '#';
  const isOwner = userInfo && work.user && userInfo._id === work.user._id;

  // Use summary for "Writing" posts if it exists, otherwise use the main description/content
  const cardText = work.category === 'Writing' && work.summary ? work.summary : work.description;

  return (
    <div className="bg-white border rounded-lg shadow-sm max-w-xl mx-auto mb-8">
      {/* Card Header */}
      <div className="flex items-center p-4 border-b">
        <Link to={userProfileLink}>
          <img src={userProfileImage} alt={userName} className="h-10 w-10 rounded-full object-cover" />
        </Link>
        <div className="ml-3">
          <Link to={userProfileLink} className="text-sm font-semibold text-gray-800 hover:underline">
            {userName}
          </Link>
        </div>
        {isOwner && <WorkOptionsMenu work={work} />}
      </div>

      {/* Card Image or Text Preview */}
      {work.fileUrls && work.fileUrls.length > 0 ? (
        <Link to={`/work/${work._id}`}>
          <img src={work.fileUrls[0]} alt={work.title} className="w-full object-cover" />
        </Link>
      ) : (
        <Link to={`/work/${work._id}`} className="block p-4 bg-gray-50 hover:bg-gray-100">
            <h2 className="font-bold text-lg text-gray-800 truncate">{work.title}</h2>
            <p className="text-gray-600 mt-2 text-sm line-clamp-3">{cardText}</p>
        </Link>
      )}

      {/* Card Actions */}
      <div className="p-4 flex items-center space-x-4">
        <LikeButton work={work} />
        <Link to={`/work/${work._id}#comments`} className="text-gray-600 hover:text-blue-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg></Link>
        <SaveButton workId={work._id} />
      </div>

      {/* Card Content */}
      <div className="px-4 pb-4">
        <p className="font-semibold text-gray-800 text-sm">{work.likes.length} likes</p>
        <div className="mt-1 text-sm">
          <Link to={userProfileLink} className="font-semibold text-gray-800 mr-2">
            {userName}
          </Link>
          <span className="text-gray-600 line-clamp-2">{cardText}</span>
        </div>
        
        {work.tags && work.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {work.tags.slice(0, 4).map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Link to={`/work/${work._id}#comments`} className="text-sm text-gray-500 mt-3 block hover:underline">
          View all {work.comments.length} comments
        </Link>
      </div>
    </div>
  );
};

export default WorkCard;