import React from "react";
import { Label } from "../ui/label";
import SignupButtons, { BottomGradient } from "../Signup/SignupButtons";
import  { EmailInput, PasswordInput } from "../Signup/InputBox";
import { LabelInputContainer } from "../ui/LabelInputContainer";

export default function SignUp() {
  return (
    <div className="max-w-md w-full mx-auto md:rounded-2xl p-4 md:p-6 md:border md:border-[#2D2D2D] rounded-md shadow-xl bg-[#0A0A0A]">      
      <form className="my-8">
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <EmailInput/>
        </LabelInputContainer>
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <PasswordInput />
        </LabelInputContainer>
        <button
          className="relative group flex items-center justify-center w-full h-11 rounded-md bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl animate-gradientMove"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>
        <p className="text-sm text-neutral-400 text-center leading-relaxed max-w-xs mx-auto my-2">
        Already have an Account? <a href="#" className="text-neutral-300 hover:text-neutral-200">Sign in</a>
      </p>
      <SignupButtons/>
      </form>
    </div>
  );
}


