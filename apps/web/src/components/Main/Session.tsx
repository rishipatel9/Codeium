import React from 'react';
import MainNav from './MainNav';
import SearchBar from './SearchBar';
import SessionGrid from './SessionGrid';

const Session = () => {
  return (
    <div className="h-[100vh] w-[100vw] bg-black px-4 md:px-12 overflow-scroll">
      <div className="flex w-full flex-col">
        <SearchBar />
      </div>
      <SessionGrid />
    </div>
  );
};

export default Session;
