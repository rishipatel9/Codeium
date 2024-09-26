'use client'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

const SignOut = () => {
    const router=useRouter();
    const handleSignOut=()=>{
        signOut();
        router.push('/');
    }
  return (
    <div>
      <Button variant='outline' className='bg-[#7f7ff5] text-white hover:bg-[#6363f3]' onClick={handleSignOut}>Signout</Button>
    </div>
  )
}

export default SignOut;
