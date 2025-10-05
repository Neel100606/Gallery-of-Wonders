import React from 'react';
import WorkGridItem from './WorkGridItem';

const WorkGrid = ({ works }) => {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-6">
      {works.map((work) => (
        <WorkGridItem key={work._id} work={work} />
      ))}
    </div>
  );
};

export default WorkGrid;