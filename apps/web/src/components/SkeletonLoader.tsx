import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col gap-1 px-2 items-center justify-between border-gray-300">
        {Array.from({ length: 10 }).map((_, index) => (
          <div className='flex w-full'>
              <div key={index} className="w-[10%] mx-1 h-5 bg-gray-700 rounded"/>
              <div key={index} className="w-[80%] h-5 bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
