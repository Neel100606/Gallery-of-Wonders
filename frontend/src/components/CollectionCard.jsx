import React from 'react';
import { Link } from 'react-router-dom';

const CollectionCard = ({ collection }) => {
  const userName = collection.user ? collection.user.name : 'A User';
  const userProfileImage = collection.user ? collection.user.profileImage : 'https://res.cloudinary.com/dw3dkqiac/image/upload/v1759513698/zqzrken305a14txbfjmv.jpg';
  const userProfileLink = collection.user ? `/profile/${collection.user._id}` : '#';

  const workCount = collection.works.length;
  const worksPreview = collection.works.slice(0, 4);

  // Pad the array with placeholders if there are fewer than 4 works
  while (worksPreview.length < 4) {
    worksPreview.push({ isPlaceholder: true });
  }

  return (
    <Link to={`/collection/${collection._id}`} className="block group">
      <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-purple-500/50 transition-colors duration-300">
        {/* Collection Preview */}
        <div className="aspect-square">
          {workCount === 1 && collection.works[0].fileUrls?.length > 0 ? (
            <img 
              src={collection.works[0].fileUrls[0]} 
              alt="collection preview" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-1">
              {worksPreview.map((work, index) => (
                <div key={index} className="bg-gray-700">
                  {!work.isPlaceholder && work.fileUrls && work.fileUrls.length > 0 && (
                    <img
                      src={work.fileUrls[0]}
                      alt="collection item"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collection Info */}
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={userProfileImage}
              alt={userName}
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="text-sm text-gray-300">{userName}</span>
          </div>
          
          <h3 className="font-bold text-white text-lg mb-1">{collection.name}</h3>
          <p className="text-gray-400 text-sm">{collection.works.length} items</p>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;