import MainNav from '@/components/Main/MainNav';
import React from 'react';
import { getUserDetails } from './page';


const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getUserDetails();

  if (!session) {
    return null;
  }

  return (
    <>
      <MainNav name={session.user} /> 
      {children}
    </>
  );
};

export default Layout;
