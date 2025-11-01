import React from 'react';

const FilterBar = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { name: 'All', value: '', emoji: '🌌' },
    { name: 'Art', value: 'Art', emoji: '🎨' },
    { name: 'Photography', value: 'Photography', emoji: '📸' },
    { name: 'Writing', value: 'Writing', emoji: '✍️' },
    { name: 'Other', value: 'Other', emoji: '🔮' }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 my-8">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => setSelectedCategory(category.value)}
          className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-2xl transition-all duration-300 backdrop-blur-sm border ${
            selectedCategory === category.value
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white border-purple-500/30 shadow-2xl shadow-purple-500/10 transform scale-105'
              : 'bg-gray-800/50 text-gray-400 border-gray-700 hover:text-white hover:bg-gray-700/50 hover:border-gray-600'
          }`}
        >
          <span className="text-lg">{category.emoji}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterBar;