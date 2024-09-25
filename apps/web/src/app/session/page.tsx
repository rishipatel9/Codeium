import { CreateCode } from '@/components/create-code';
import { NEXT_AUTH } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const session = await getServerSession(NEXT_AUTH);;
    console.log(session);


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
        <CreateCode/>
    </>
  );
};

export default Page;
