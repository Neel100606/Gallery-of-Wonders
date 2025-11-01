import React from 'react';

const CategoryDistribution = ({ data }) => {
  const distributionData = data.length > 0 ? data : [
    { category: 'Art', count: 5, color: '#8B5CF6' },
    { category: 'Photography', count: 3, color: '#3B82F6' },
    { category: 'Writing', count: 2, color: '#10B981' },
    { category: 'Design', count: 4, color: '#F59E0B' },
    { category: 'Music', count: 1, color: '#EF4444' },
  ];

  const total = distributionData.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      {distributionData.map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-white text-sm capitalize">{item.category}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-24 bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(item.count / total) * 100}%`,
                  backgroundColor: item.color 
                }}
              ></div>
            </div>
            <span className="text-gray-400 text-sm w-8 text-right">
              {item.count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryDistribution;