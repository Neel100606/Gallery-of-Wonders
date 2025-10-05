import React from 'react';

const FilterBar = ({ selectedCategory, setSelectedCategory }) => {
  const categories = ['All', 'Art', 'Photography', 'Writing', 'Other'];

  return (
    <div className="flex justify-center space-x-2 sm:space-x-4 my-8">
      {categories.map((category) => {
        const isAllCategory = category === 'All';
        const categoryValue = isAllCategory ? '' : category; // API expects empty string for 'All'

        return (
          <button
            key={category}
            onClick={() => setSelectedCategory(categoryValue)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
              selectedCategory === categoryValue
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;