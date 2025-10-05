import React from 'react';
import CollectionCard from './CollectionCard';

const CollectionGrid = ({ collections }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection._id} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionGrid;