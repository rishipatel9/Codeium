'use client';
import { useParams } from 'next/navigation';

const SessionIdPage = () => {
  const params = useParams(); 
  const sessionId = params?.sessionId; 

  if (!sessionId) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Session Details for {sessionId}</h1>
    </div>
  );
};

export default SessionIdPage;