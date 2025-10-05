import { Link } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';

const CollectionCard = ({ collection }) => {
  // Get the first 4 works with file URLs for the preview grid
  const previewWorks = collection.works.filter(work => work.fileUrl).slice(0, 4);

  return (
    <Link to={`/collection/${collection._id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        <div className="grid grid-cols-2 grid-rows-2 h-48">
          {previewWorks.length > 0 ? (
            previewWorks.map((work, index) => (
              <img
                key={work._id || index}
                src={work.fileUrl}
                alt={work.title}
                className="w-full h-full object-cover"
              />
            ))
          ) : (
            // Placeholder if there are no images
            <div className="col-span-2 row-span-2 bg-gray-200 flex items-center justify-center">
              <FaImage className="text-gray-400 text-4xl" />
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 truncate group-hover:text-purple-600">
            {collection.name}
          </h3>
          <p className="text-sm text-gray-500">
            {collection.works.length} {collection.works.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;