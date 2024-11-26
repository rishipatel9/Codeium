import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="flex justify-center items-center flex-col gap-2">
        <div className='w-10 h-10 border-4 border-gray-300  border-t-[#2D2D2D] rounded-full animate-spin'></div>
        <div className='text-white '>
        Booting...
        </div>
      </div>
    </div>
  );
}

export default Loading;
