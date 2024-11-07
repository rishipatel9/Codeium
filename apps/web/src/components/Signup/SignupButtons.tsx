'use client'
import React from 'react'
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react';

const SignupButtons = () => {
    const router = useRouter()
    const handleSignup=(provider:string)=>{
        signIn(provider)
        router.push('/session');
    }
      
    return (
        <>
            <div className="bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8 h-[1px] w-full" />
            <div className="flex flex-col space-y-4">
                <button  onClick={() => handleSignup("google")}
                    className="relative group/btn flex space-x-2 items-center justify-center border border-[#2D2D2D] px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                >
                    <IconBrandGoogle className="h-4 w-4 text-neutral-300" />
                    <span className="text-neutral-300 text-sm">
                        Google
                    </span>
                    <BottomGradient />
                </button>
                <button onClick={() => handleSignup("github")}
                    className="relative group/btn flex space-x-2 items-center border border-[#2D2D2D]  justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-zinc-900 shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                >
                    <IconBrandGithub className="h-4 w-4 text-neutral-300" />
                    <span className="text-neutral-300 text-sm">
                        GitHub
                    </span>
                    <BottomGradient />
                </button>

            </div>
        </>
    )
}
export const BottomGradient = () => (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
  


export default SignupButtons
