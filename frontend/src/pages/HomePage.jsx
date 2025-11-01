import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetWorksQuery } from '../redux/api/worksApiSlice';
import Loader from '../components/Loader';
import FilterBar from '../components/FilterBar';
import HeroSection from '../components/HeroSection';
import FeaturedWorks from '../components/FeaturedWorks';
import CategoryGrid from '../components/CategoryGrid';
import CreateWorkModal from '../components/CreateWorkModal';
import MasonryGrid from '../components/MasonryGrid';
import WorkListView from '../components/WorkListView';

const HomePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [category, setCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [featuredWorks, setFeaturedWorks] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // API calls
  const { 
    data: works, 
    isLoading: worksLoading, 
    error: worksError,
    refetch: refetchWorks 
  } = useGetWorksQuery({ category });

  // Set featured works (most liked works)
  useEffect(() => {
    if (works && works.length > 0) {
      const sortedByLikes = [...works]
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        .slice(0, 3);
      setFeaturedWorks(sortedByLikes);
    }
  }, [works]);

  const renderWorksFeed = () => {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">
            Discover Creative Works
          </h1>
          <p className="text-gray-400 text-lg">
            Explore amazing creations from our community of artists
          </p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <FilterBar selectedCategory={category} setSelectedCategory={setCategory} />
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 mr-2">View:</span>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Works Grid/List */}
        {worksLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : worksError ? (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">⚠️</span>
              <strong className="font-bold">Error Loading Works</strong>
            </div>
            <span className="block sm:inline">{worksError?.data?.message || worksError.error}</span>
            <button
              onClick={refetchWorks}
              className="mt-3 px-4 py-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors border border-red-500/30 text-sm"
            >
              Try Again
            </button>
          </div>
        ) : works && works.length > 0 ? (
          viewMode === 'grid' ? (
            <MasonryGrid works={works} />
          ) : (
            <WorkListView works={works} />
          )
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl flex items-center justify-center border border-purple-500/30">
              <span className="text-4xl">🌠</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              {category ? `No ${category} works found` : 'The Cosmos Awaits'}
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {category 
                ? 'Try selecting a different category or check back later.' 
                : 'Be the first to illuminate this space with your creations!'
              }
            </p>
            {userInfo && (
              <button
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <span className="text-lg">✨</span>
                <span>Create First Work</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {userInfo ? (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          {renderWorksFeed()}
        </div>
      ) : (
        <>
          <HeroSection />
          {featuredWorks.length > 0 && <FeaturedWorks works={featuredWorks} />}
          <CategoryGrid />
        </>
      )}

      {/* Create Work Modal */}
      <CreateWorkModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  );
};

export default HomePage;