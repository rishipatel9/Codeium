import { CreateSession } from '@/components/CreateSession';
import { NEXT_AUTH } from '@/lib/auth';
import { AuthOptions, getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const session = await getServerSession(NEXT_AUTH as AuthOptions);
  if (!session) {
    redirect(`/`);
  } 
  //   else {
//     const sessionId = session.user?.name;

//     if (sessionId) {
//       redirect(`/session/${encodeURIComponent(sessionId)}`);
//     }
//   }
  return (
    <>
        <CreateSession/>
    </>
  );
};

export default Page;
