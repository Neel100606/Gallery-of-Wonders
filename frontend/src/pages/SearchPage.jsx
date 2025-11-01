import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSearchWorksQuery } from '../redux/api/worksApiSlice';
import Loader from '../components/Loader';
import MasonryGrid from '../components/MasonryGrid';
import WorkListView from '../components/WorkListView';

const SearchPage = () => {
  const { keyword } = useParams();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  const { 
    data: works, 
    isLoading, 
    error,
    isError 
  } = useSearchWorksQuery(keyword, {
    skip: !keyword,
  });

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 font-serif">
            Search Results
          </h1>
          <p className="text-gray-400 text-lg">
            Showing results for: <span className="text-purple-400 font-semibold">"{keyword}"</span>
          </p>
        </div>

        {/* View Toggle - Only show if there are results */}
        {works && works.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm8-8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Grid</span>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span>List</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Search Error</h3>
            <p className="text-gray-400 mb-4">
              {error?.data?.message || error?.error || 'Could not fetch search results.'}
            </p>
          </div>
        ) : works && works.length > 0 ? (
          <div>
            {/* Results Count */}
            <div className="mb-6 text-center">
              <p className="text-gray-400">
                Found <span className="text-purple-400 font-semibold">{works.length}</span> 
                result{works.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Dynamic View */}
            {viewMode === 'grid' ? (
              <MasonryGrid works={works} />
            ) : (
              <WorkListView works={works} />
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-3xl flex items-center justify-center border border-purple-500/30">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">
              No works found
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              No results found for "<span className="text-purple-400">{keyword}</span>". 
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;