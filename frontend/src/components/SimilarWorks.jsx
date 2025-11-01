import React from 'react';
import { useGetSimilarWorksQuery } from '../redux/api/worksApiSlice';
import WorkGrid from './WorkGrid';
import Loader from './Loader';
import MasonryGrid from './MasonryGrid';

const SimilarWorks = ({ workId }) => {
  const { data: similarWorks, isLoading } = useGetSimilarWorksQuery(workId);

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <Loader />
      </div>
    );
  }

  if (!similarWorks || similarWorks.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">Similar Works</h2>
      <MasonryGrid works={similarWorks} />
    </div>  
  );
};

export default SimilarWorks;