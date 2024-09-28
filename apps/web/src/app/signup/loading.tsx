import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-[#7f7ff5] rounded-full animate-spin"></div>
    </div>
  );
}

export default Loading;
