import React from 'react';
import { Link } from 'react-router-dom';

const StatsOverview = ({ stats, collectionsCount }) => {
  const statCards = [
    {
      label: 'Total Works',
      value: stats.totalWorks || 0,
      icon: '🎨',
      color: 'from-purple-500 to-pink-500',
      link: '/my-works'
    },
    {
      label: 'Total Likes',
      value: stats.totalLikes || 0,
      icon: '❤️',
      color: 'from-red-500 to-orange-500',
      link: '/my-works'
    },
    {
      label: 'Collections',
      value: collectionsCount,
      icon: '📚',
      color: 'from-blue-500 to-cyan-500',
      link: '/collections'
    },
    {
      label: 'Comments',
      value: stats.totalComments || 0,
      icon: '💬',
      color: 'from-green-500 to-emerald-500',
      link: '/my-works'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {statCards.map((stat, index) => (
        <Link
          key={index}
          to={stat.link}
          className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-xl`}>
              {stat.icon}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StatsOverview;