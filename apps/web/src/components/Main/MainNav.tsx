import React from 'react';
import Logo from '../Logo/Logo';
import StarButton from '../Landing/StarButton';
import Image from 'next/image';

interface UserSession {
  name: string;
  image: string;
  email: string;
}

const MainNav = ({ name }: { name: any }) => {
  return (
    <header className="w-full flex items-center h-16 md:px-6 px-4 bg-[#0A0A0A] top-0 left-0 z-20 border-b border-[#2D2D2D]">
      {/* Logo with clickable link */}
      <a href="/" aria-label="Homepage" className="flex items-center">
        <Logo />
      </a>
      
      {/* Divider */}
      <p className="text-[#525050] text-2xl px-3">/</p>

      {/* Profile Image and User Name */}
      <div className="flex items-center gap-2">
        {name?.image && (
          <Image
            src={name.image}
            alt="Profile image"
            width={32}
            height={32}
            className="rounded-full border-2 border-[#2D2D2D]"
          />
        )}
        <p className="text-[#EDEDED] text-sm font-semibold">
          {name ? `${name.name.toLowerCase()}'s projects` : 'User'}
        </p>
      </div>

      {/* Divider Icon */}
      <svg
        className="ml-4 sm:block hidden"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        width="24"
        style={{ color: "var(--accents-2)" }}
      >
        <path d="M16.88 3.549L7.12 20.451"></path>
      </svg>

      {/* Navigation Links (e.g., GitHub Star Button) */}
      <nav className="ml-auto flex items-center gap-4 sm:gap-6">
        <StarButton />
        
        {/* Conditional Greeting */}
        {name && (
          <p className="text-[#8E8E8E] text-sm hidden md:inline-block">
            Hello, {name.name.split(' ')[0]}!
          </p>
        )}
      </nav>
    </header>
  );
};

export default MainNav;
