import { Link } from 'react-router-dom';

const WorkCard = ({ work }) => {
  // Defensive check for user data to prevent crashes
  const authorName = work?.user?.name || 'Unknown Artist';
  const authorImage = work?.user?.profileImage;

  return (
    <Link to={`/work/${work._id}`} className="block group">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
        {/* Display the first image of the work */}
        {work.fileUrls && work.fileUrls.length > 0 && (
          <img
            src={work.fileUrls[0]}
            alt={work.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        
        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-slate-800 truncate">{work.title}</h3>
          
          {/* Author Info */}
          <div className="flex items-center mt-3 text-sm text-slate-600">
            {authorImage && (
              <img
                src={authorImage}
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover mr-2 border-2 border-slate-200"
              />
            )}
            <span>by {authorName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WorkCard;