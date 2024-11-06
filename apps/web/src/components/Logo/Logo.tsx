import { CodeIcon } from '@/icons/CodeIcon'
import React from 'react'
import Link from "next/link";
const Logo = () => {
  return (
    <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <CodeIcon className="h-6 w-6 text-white" />
          <span className="font-bold text-xl text-white">Codeium</span>
    </Link>
  )
}

export default Logo
