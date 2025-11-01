import React from 'react';
import MasonryWorkCard from './MasonryWorkCard';

const MasonryGrid = ({ works }) => {
  // Group works into columns for masonry layout
  const createMasonryColumns = (works, columnCount = 3) => {
    const columns = Array.from({ length: columnCount }, () => []);
    works.forEach((work, index) => {
      columns[index % columnCount].push(work);
    });
    return columns;
  };

  const columns = createMasonryColumns(works);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {columns.map((column, columnIndex) => (
        <div key={columnIndex} className="flex flex-col gap-6">
          {column.map((work) => (
            <MasonryWorkCard key={work._id} work={work} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;