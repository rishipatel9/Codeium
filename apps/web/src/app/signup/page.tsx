import SignUp from '@/components/Signup/Signup'
import React from 'react'
import { getUserDetails } from '../session/page'
import { redirect } from 'next/navigation';
const page = async () => {
  const session=await getUserDetails();
  if(session){
    redirect('/session')
  }
  return (
    <div className='flex justify-center items-center h-[100vh] w-[100vw] bg-black '>
      <SignUp/>
    </div>
  )
}

export default page
