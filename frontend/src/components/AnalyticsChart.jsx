import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnalyticsChart = ({ data }) => {
  const [chartType, setChartType] = useState('bar');

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-72 bg-gray-900/50 backdrop-blur-md rounded-2xl">
        <div className="text-center">
          <div className="text-5xl mb-3">📉</div>
          <p className="text-gray-300 text-lg font-medium">No analytics available</p>
          <p className="text-gray-500 text-sm mt-1">Create some works to see engagement stats</p>
        </div>
      </div>
    );
  }

  const topWorks = data.slice(0, 5);
  const maxLikes = Math.max(...topWorks.map(w => w.likes || 0), 1);
  const maxComments = Math.max(...topWorks.map(w => w.comments || 0), 1);

  const truncateTitle = (title, len = 14) =>
    title?.length > len ? title.substring(0, len) + '…' : title || 'Untitled';

  /** 🔹 Vertical Bar Chart */
  const BarChart = () => {
    const getHeight = (val, max) => Math.max((val / max) * 80, 10);

    return (
      <motion.div
        layout
        className="h-72 flex items-end justify-between px-6 border-b border-gray-700 pb-4"
      >
        {topWorks.map((w, i) => {
          const likesH = getHeight(w.likes || 0, maxLikes);
          const commentsH = getHeight(w.comments || 0, maxComments);
          return (
            <motion.div
              layout
              key={w._id || i}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className="flex items-end space-x-2 h-52">
                {/* Likes */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${likesH}%` }}
                  transition={{ duration: 0.5 }}
                  className="w-8 bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg relative hover:scale-105 transition-transform"
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    ❤️ {w.likes || 0}
                  </span>
                </motion.div>

                {/* Comments */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${commentsH}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg relative hover:scale-105 transition-transform"
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    💬 {w.comments || 0}
                  </span>
                </motion.div>
              </div>

              <div className="text-xs text-gray-200 font-medium">{truncateTitle(w.title)}</div>
              <div className="text-[10px] text-gray-500 bg-gray-800/60 px-2 py-0.5 rounded-full">
                {w.category || 'Uncategorized'}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  /** 🔹 Horizontal Bar Chart */
  const SimpleBarChart = () => (
    <motion.div layout className="space-y-4">
      {topWorks.map((w, i) => {
        const likesW = (w.likes / maxLikes) * 100;
        const commentsW = (w.comments / maxComments) * 100;

        return (
          <motion.div
            key={w._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-xl shadow-sm hover:bg-gray-800/70 transition"
          >
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span className="font-medium">{truncateTitle(w.title, 20)}</span>
              <span className="text-gray-400">
                ❤️ {w.likes} · 💬 {w.comments}
              </span>
            </div>

            <div className="flex h-4 rounded-lg overflow-hidden">
              <motion.div
                className="bg-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${likesW}%` }}
                transition={{ duration: 0.5 }}
              ></motion.div>
              <motion.div
                className="bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${commentsW}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
              ></motion.div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );

  return (
    <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl shadow-xl space-y-6 border border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white tracking-wide">Engagement Analytics</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📊 Vertical
          </button>
          <button
            onClick={() => setChartType('simple')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              chartType === 'simple'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            📈 Horizontal
          </button>
        </div>
      </div>

      {/* Chart */}
      <AnimatePresence mode="wait">
        {chartType === 'bar' ? (
          <motion.div
            key="bar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <BarChart />
          </motion.div>
        ) : (
          <motion.div
            key="simple"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <SimpleBarChart />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalyticsChart;
