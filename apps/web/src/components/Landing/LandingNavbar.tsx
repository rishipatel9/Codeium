import React from 'react'
import Logo from '../Logo/Logo'
import StarButton from './StarButton'
import Link from 'next/link'

const LandingNavbar = () => {
  return (
    <header className="w-full flex justify-center items-center px-4 lg:px-6 h-14 max-w-7xl mx-auto py-4 md:py-4">
    <Logo />
    <nav className="ml-auto flex gap-4 sm:gap-6">
      <StarButton />
      <Link href="/signup" className="text-black inline-flex h-10 items-center justify-center rounded-md border bg-white hover:bg-gray-200 px-8 text-sm font-medium shadow-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400">
        Signin
      </Link>
    </nav>
  </header>
  )
}

export default LandingNavbar
