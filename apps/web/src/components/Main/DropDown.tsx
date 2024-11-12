// components/ClientDropdownMenu.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

interface UserSession {
  name: string;
  image: string;
}

const DropDown = ({ user }: { user: UserSession }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Image
        src={user.image}
        alt="Profile image"
        width={36}
        height={36}
        className="rounded-full border-2 border-[#2D2D2D] md:inline hidden"
      />
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56 mt-6 mr-6 p-2 rounded-md text-[#8E8E8E] border-2 z-50 border-[#27272B] bg-black">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-[#27272B]" />
      <DropdownMenuGroup>
        <DropdownMenuItem className='py-2'>
          <Link href="/session">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='py-2'>
          <Link href="/" target='_main'>Home</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='py-2'>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator className="bg-[#27272B]" />
      <DropdownMenuLabel>Connect</DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-[#27272B]" />
    </DropdownMenuContent>
  </DropdownMenu>
);

export default DropDown;
