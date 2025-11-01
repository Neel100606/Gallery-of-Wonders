import React from 'react';

const Loader = ({ size = 'small' }) => {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-solid border-white border-t-transparent ${sizes[size]}`}></div>
  );
};

export default Loader;