import { CreateSession } from '@/components/sessionPages/CreateSession';
import { NEXT_AUTH } from '@/lib/auth';
import { AuthOptions, getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

const getUserDetails = async () => {
  const session = await getServerSession(NEXT_AUTH as AuthOptions);
  return session;
};
const Page = async () => {
  const session = await getUserDetails();
  if (!session) {
    redirect(`/`);
  } 
  return (
    <>
        <CreateSession/>
    </>
  );
};

export default Page;
