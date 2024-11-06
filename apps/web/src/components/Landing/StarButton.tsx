import React from 'react';
import Link from 'next/link'; 
import { RainbowButton } from './rainbow-button';
import { Star } from 'lucide-react';
import { GithubIcon } from '@/icons/Github';

const StarButton = () => {
    return (
        <Link href="https://github.com/rishipatel9/Codeium" passHref>
            <RainbowButton
                className="h-10 items-center justify-center rounded-md border bg-white hover:bg-gray-200  px-8 text-sm  shadow-sm
                         bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] 
                         text-black font-medium 
                         hover:text-yellow-500 transition-colors duration-300 hover:fill-yellow-500
                         hidden md:inline-flex">
                <GithubIcon className="mr-2 h-5 w-5" />
                <p className='px-2'>Star on Github</p>
                <Star className="mr-2 h-5 w-5 transition-colors duration-300 group-hover:fill-yellow-500" />
            </RainbowButton>
        </Link>
    );
};

export default StarButton;
