import React from 'react';
import { useParams } from 'react-router-dom';
import { useSearchWorksQuery } from '../redux/api/worksApiSlice';
import Loader from '../components/Loader';
import WorkCard from '../components/WorkCard';

const SearchPage = () => {
  const { keyword } = useParams();
  const { data: works, isLoading, error } = useSearchWorksQuery(keyword);

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Search Results for: <span className="text-indigo-600">{keyword}</span>
      </h1>

      {isLoading ? (
        <div className="flex justify-center"><Loader /></div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error?.data?.message || 'Could not fetch results.'}</div>
      ) : works && works.length > 0 ? (
        works.map((work) => <WorkCard key={work._id} work={work} />)
      ) : (
        <p className="text-center text-gray-500">No works found matching your search.</p>
      )}
    </div>
  );
};

export default SearchPage;