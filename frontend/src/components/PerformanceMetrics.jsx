import React from 'react';

const PerformanceMetrics = ({ analytics }) => {
  const metrics = [
    {
      label: 'Avg. Likes per Work',
      value: analytics.avgLikesPerWork,
      icon: '❤️'
    },
    {
      label: 'Avg. Comments per Work',
      value: analytics.avgCommentsPerWork,
      icon: '💬'
    },
    {
      label: 'Engagement Rate',
      value: analytics.engagementRate,
      icon: '📊'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-xl">{metric.icon}</span>
              <span className="text-white text-sm">{metric.label}</span>
            </div>
            <span className="text-white font-semibold">{metric.value}</span>
          </div>
        ))}
      </div>

      {/* Top Performing Work */}
      {analytics.topPerformingWork && (
        <div className="p-4 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl border border-purple-500/30">
          <h4 className="text-white font-semibold mb-2 text-sm">🏆 Top Performing Work</h4>
          <p className="text-white text-sm font-medium truncate">{analytics.topPerformingWork.title}</p>
          <p className="text-gray-400 text-xs mt-1">
            {analytics.topPerformingWork.engagement || 0} total engagement
          </p>
          <p className="text-gray-400 text-xs capitalize">
            {analytics.topPerformingWork.category}
          </p>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;