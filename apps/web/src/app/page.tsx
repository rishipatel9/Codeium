import { LandingPage } from '@/components/landing-page'
import { NEXT_AUTH } from '@/lib/auth';
import { AuthOptions, getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
    const session = await getServerSession(NEXT_AUTH as AuthOptions);
    if(session){
      redirect('/session')
    }
  return (
    <div>
      <LandingPage/>
    </div>
  )
}

export default page
