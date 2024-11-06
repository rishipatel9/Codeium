'use client';
import { useRouter } from 'next/navigation';
import React from 'react'
import { RainbowButton } from './rainbow-button';

const TryButton = () => {
    const router = useRouter();
    const handleClick = () => {
        router.push("/signup")
    }
    return (
        <div>
            <RainbowButton
                className="w-full inline-flex h-10 items-center justify-center rounded-md px-8 text-sm 
            bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))] text-black font-medium "
                onClick={handleClick}
            >
                Try Codeium
            </RainbowButton>
        </div>
    )
}

export default TryButton
