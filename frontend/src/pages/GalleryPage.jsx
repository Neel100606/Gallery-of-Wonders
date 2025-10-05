import { useState } from 'react'; // 👈 1. Import useState
import { useGetWorksQuery } from '../redux/api/worksApiSlice';
import WorkCard from '../components/WorkCard.jsx';
import Loader from '../components/Loader.jsx';

const GalleryPage = () => {
  // 👇 2. Add state for the selected category
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // 👇 3. Pass the category state to the query hook
  const { data: works, isLoading, error } = useGetWorksQuery({ category: selectedCategory });

  const categories = ['Art', 'Photography', 'Writing', 'Other'];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
  
  // ... (isLoading and error handling remains the same)

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">
          Explore the Gallery
        </h1>

        {/* 👇 4. ADD FILTER BUTTONS */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 font-semibold rounded-full transition ${
              !selectedCategory ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 hover:bg-purple-100'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 font-semibold rounded-full transition ${
                selectedCategory === category ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 hover:bg-purple-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* Loading and Error states */}
        {isLoading ? (
          <div className="flex justify-center items-center"><Loader /></div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error?.data?.message || error.error}</div>
        ) : (
          <>
            {/* Grid Display */}
            {works.length === 0 ? (
              <p className="text-center text-slate-600">No works found for this category.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {works.map((work) => (
                  <WorkCard key={work._id} work={work} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;