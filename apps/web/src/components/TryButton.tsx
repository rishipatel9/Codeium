'use client';
import { useRouter } from 'next/navigation';
import React from 'react'

const TryButton = () => {
    const router=useRouter();
    const handleClick=()=>{
        console.log("redirect");
        router.push("/signup")
    }
    return (
        <button
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#7f7ff5] text-white bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            onClick={handleClick}
        >
            Try Codeium
        </button>

    )
}

export default TryButton
