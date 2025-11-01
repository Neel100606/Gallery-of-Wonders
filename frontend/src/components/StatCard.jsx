import React from 'react';

const StatCard = ({ title, value, icon, trend, description }) => {
  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-purple-500/30 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl transform group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isPositive ? 'bg-green-500/20 text-green-400' : 
            isNegative ? 'bg-red-500/20 text-red-400' : 
            'bg-gray-500/20 text-gray-400'
          }`}>
            {isPositive ? '↑' : isNegative ? '↓' : '→'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        {description && (
          <p className="text-gray-500 text-xs mt-2">{description}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;