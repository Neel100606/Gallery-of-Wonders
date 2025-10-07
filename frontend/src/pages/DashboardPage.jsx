import React from 'react';
import { useGetWorkStatsQuery, useGetMyWorksQuery } from '../redux/api/worksApiSlice';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Custom Tooltip for better readability
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-md shadow-lg text-sm">
        <p className="font-semibold text-gray-800 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: <span className="font-medium">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const { data: stats, isLoading: isLoadingStats } = useGetWorkStatsQuery();
  const { data: myWorks, isLoading: isLoadingWorks } = useGetMyWorksQuery();

  if (isLoadingStats || isLoadingWorks) {
    return <div className="flex justify-center mt-20"><Loader /></div>;
  }

  // Prepare data for the chart, showing top 5 most liked works
  const chartData = myWorks
    ?.slice()
    .sort((a, b) => b.likes.length - a.likes.length)
    .slice(0, 5)
    .map(work => ({
      name: work.title.substring(0, 15) + (work.title.length > 15 ? '...' : ''), // Shorten title for chart
      Likes: work.likes.length,
      Comments: work.comments.length,
    }));

  return (
    <div className="container mx-auto max-w-7xl p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Works" value={stats?.totalWorks || 0} icon={"🎨"} />
        <StatCard title="Total Likes" value={stats?.totalLikes || 0} icon={"❤️"} />
        <StatCard title="Total Comments" value={stats?.totalComments || 0} icon={"💬"} />
        <StatCard title="Total Saves" value={stats?.totalSaves || 0} icon={"🔖"} />
      </div>

      {/* Charts Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Top 5 Most Engaged Works</h2> {/* Changed title slightly */}
        <div className="bg-white p-6 rounded-lg shadow-md h-96">
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                {/* Removed default CartesianGrid stroke for a cleaner look */}
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" /> 
                <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '0.8rem', fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} style={{ fontSize: '0.8rem', fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} /> {/* Custom tooltip */}
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px' }} /> {/* Smaller legend icons */}
                <Bar dataKey="Likes" fill="#6366f1" barSize={30} radius={[5, 5, 0, 0]} /> {/* Deeper indigo, rounded bars */}
                <Bar dataKey="Comments" fill="#a5b4fc" barSize={30} radius={[5, 5, 0, 0]} /> {/* Lighter indigo, rounded bars */}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No works available to display chart data. Start creating!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;