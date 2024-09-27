import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="w-1/4 bg-gray-200 h-6 rounded" />
        <div className="hidden sm:block w-1/4 bg-gray-200 h-6 rounded" />
        <div className="hidden md:block w-1/4 bg-gray-200 h-6 rounded" />
        <div className="w-1/4 bg-gray-200 h-6 rounded" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
