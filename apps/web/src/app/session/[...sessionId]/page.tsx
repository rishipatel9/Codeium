import Editor from '@/components/CodeEditor/Editor';
import { getValidSession } from '@/lib/db';
import { getUserDetails } from '@/utils/user';
import { redirect } from 'next/navigation';
import React from 'react';

interface PageProps {
  params: { sessionId: string };
}
const Page = async ({ params }: PageProps) => {
  const sessionId = params?.sessionId;
  const session = await getUserDetails();
  
  if (!session) {
    redirect('/');
  } 
  const userSession = await getValidSession(session.user?.email || null ,typeof sessionId === "string" ? sessionId : sessionId?.[0] || null);
  if (!userSession) {
    console.log(userSession)
    redirect('/');
  }

  return (
    <Editor session={userSession} />
  );
};

export default Page;
