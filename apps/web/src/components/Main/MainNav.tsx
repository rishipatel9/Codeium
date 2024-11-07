import React from 'react';
import Logo from '../Logo/Logo';
import StarButton from '../Landing/StarButton';

const MainNav = () => {
  return (
    <header className="w-full flex justify-center items-center h-14 md:px-4 px-4 bg-[#0A0A0A] top-0 left-0 z-10 border-b border-[#2D2D2D]">
      <Logo />
      <svg className="geist-hide-on-mobile" data-testid="geist-icon" fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24" style={{"color": "var(--accents-2)", "width": "22px","height": "22px"}}><path d="M16.88 3.549L7.12 20.451"></path></svg>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <StarButton />
      </nav>
    </header>
  );
}

export default MainNav;
