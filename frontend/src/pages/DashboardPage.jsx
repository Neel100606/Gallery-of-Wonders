import React from 'react';
import { useGetMyWorksQuery } from '../redux/api/worksApiSlice';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import AnalyticsChart from '../components/AnalyticsChart';
import CategoryDistribution from '../components/CategoryDistribution';
import RecentActivity from '../components/RecentActivity';
import PerformanceMetrics from '../components/PerformanceMetrics';

const DashboardPage = () => {
  const { data: myWorks, isLoading: isLoadingWorks, error: worksError } = useGetMyWorksQuery();

  // Calculate all analytics from myWorks data
  const calculateAnalytics = (works = []) => {
    if (!works || works.length === 0) {
      return {
        // Basic Stats
        totalWorks: 0,
        totalLikes: 0,
        totalComments: 0,
        totalSaves: 0,
        
        // Engagement Metrics
        avgEngagement: 0,
        completionRate: 0,
        topCategory: 'N/A',
        
        // Chart Data
        engagementData: [],
        categoryData: [],
        
        // Performance Metrics
        avgLikesPerWork: 0,
        avgCommentsPerWork: 0,
        engagementRate: '0%',
        
        // Top Performing Work
        topPerformingWork: null
      };
    }

    // Basic Stats - FIXED: work.saves is a number, not an array
    const totalLikes = works.reduce((sum, work) => sum + (work.likes?.length || 0), 0);
    const totalComments = works.reduce((sum, work) => sum + (work.comments?.length || 0), 0);
    const totalSaves = works.reduce((sum, work) => sum + (work.saves || 0), 0); // FIXED

    // Engagement Metrics
    const worksWithEngagement = works.filter(work => 
      (work.likes?.length || 0) > 0 || (work.comments?.length || 0) > 0
    ).length;
    
    const completionRate = Math.round((worksWithEngagement / works.length) * 100);  
    const avgEngagement = Math.round((totalLikes + totalComments) / works.length);

    // Category Analysis
    const categoryCount = {};
    works.forEach(work => {
      const category = work.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });
    
    const topCategory = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b, 'N/A'
    );

    // Generate engagement data for top 5 works by total engagement
    const worksWithEngagementData = works.map(work => ({
      _id: work._id,
      title: work.title,
      category: work.category,
      likes: work.likes?.length || 0,
      comments: work.comments?.length || 0,
      saves: work.saves || 0, // Added saves
      totalEngagement: (work.likes?.length || 0) + (work.comments?.length || 0)
    }));

    // Sort by total engagement (likes + comments) and take top 5
    const engagementData = worksWithEngagementData
      .sort((a, b) => b.totalEngagement - a.totalEngagement)
      .slice(0, 5);

    // Generate Category Distribution
    const categoryData = Object.entries(categoryCount).map(([category, count], index) => ({
      category,
      count,
      color: getCategoryColor(category, index)
    }));

    // Performance Metrics
    const avgLikesPerWork = (totalLikes / works.length).toFixed(1);
    const avgCommentsPerWork = (totalComments / works.length).toFixed(1);
    const engagementRate = `${completionRate}%`;

    // Top Performing Work
    const topPerformingWork = works.reduce((top, work) => {
      const engagement = (work.likes?.length || 0) + (work.comments?.length || 0);
      return engagement > (top.engagement || 0) ? { ...work, engagement } : top;
    }, {});

    return {
      totalWorks: works.length,
      totalLikes,
      totalComments,
      totalSaves,
      avgEngagement,
      completionRate,
      topCategory,
      engagementData,
      categoryData,
      avgLikesPerWork,
      avgCommentsPerWork,
      engagementRate,
      topPerformingWork: topPerformingWork.title ? topPerformingWork : null
    };
  };

  // Helper function to get consistent colors for categories
  const getCategoryColor = (category, index) => {
    const colors = [
      '#8B5CF6', // purple
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#EC4899', // pink
      '#6366F1', // indigo
      '#14B8A6', // teal
    ];
    return colors[index % colors.length];
  };

  const analytics = calculateAnalytics(myWorks);
  const recentWorks = myWorks?.slice(0, 5) || [];

  if (isLoadingWorks) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Track your creative performance and engagement</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Works" 
            value={analytics.totalWorks} 
            icon="🎨"
            description="Your creative portfolio"
          />
          <StatCard 
            title="Total Likes" 
            value={analytics.totalLikes} 
            icon="❤️"
            description="Audience appreciation"
          />
          <StatCard 
            title="Total Comments" 
            value={analytics.totalComments} 
            icon="💬"
            description="Community engagement"
          />
          <StatCard 
            title="Total Saves" 
            value={analytics.totalSaves} 
            icon="📚"
            description="Saved by users"
          />
        </div>

        {/* Charts and Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Engagement Overview Chart */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Engagement Overview</h2>
            <AnalyticsChart data={analytics.engagementData} />
          </div>

          {/* Category Distribution */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Works by Category</h2>
            <CategoryDistribution data={analytics.categoryData} />
          </div>
        </div>

        {/* Performance and Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Metrics */}
          <div className="lg:col-span-1 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Performance Metrics</h2>
            <PerformanceMetrics 
              analytics={analytics}
            />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <RecentActivity works={recentWorks} />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/30">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-white font-semibold mb-1">Avg. Engagement</h3>
              <p className="text-2xl font-bold text-white">{analytics.avgEngagement}</p>
              <p className="text-gray-400 text-sm">per work</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-6 border border-green-500/30">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="text-white font-semibold mb-1">Engagement Rate</h3>
              <p className="text-2xl font-bold text-white">{analytics.engagementRate}</p>
              <p className="text-gray-400 text-sm">works with engagement</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl p-6 border border-orange-500/30">
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="text-white font-semibold mb-1">Top Category</h3>
              <p className="text-2xl font-bold text-white capitalize">{analytics.topCategory}</p>
              <p className="text-gray-400 text-sm">most popular</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;