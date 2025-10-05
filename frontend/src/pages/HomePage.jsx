import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetWorksQuery } from '../redux/api/worksApiSlice';
import Loader from '../components/Loader';
import WorkCard from '../components/WorkCard';
import FilterBar from '../components/FilterBar'; // 👈 Import the new component

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [category, setCategory] = useState(''); // 👈 State for the selected category

  // 👇 Pass the category state to the data-fetching hook
  const { data: works, isLoading, error } = useGetWorksQuery({ category });

  const renderWorksFeed = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold text-center mb-4">Discover Works</h1>
        
        {/* 👇 Render the FilterBar component */}
        <FilterBar selectedCategory={category} setSelectedCategory={setCategory} />
        
        {isLoading ? (
          <div className="flex justify-center"><Loader /></div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error?.data?.message || error.error}</span>
          </div>
        ) : (
          works.map((work) => (
            <WorkCard key={work._id} work={work} />
          ))
        )}
      </div>
    );
  };

  const renderGuestLandingPage = () => (
    <div className="text-center flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-4 font-serif">Welcome to the Gallery of Wonders</h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-8">
        A timeless stage where every creator's legendary act can be captured, celebrated, and preserved forever. Join our community to showcase your art, photography, writing, and more.
      </p>
      <div className="flex space-x-4">
        <Link to="/register" className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
          Get Started
        </Link>
        <Link to="/login" className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300">
          Sign In
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto mt-8 px-4">
      {userInfo ? renderWorksFeed() : renderGuestLandingPage()}
    </div>
  );
};

export default HomePage;