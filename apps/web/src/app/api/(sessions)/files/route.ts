import { NextApiResponse } from 'next';
import { supabaseClient } from '@/utils/SupabaseClient';
import { AuthOptions, getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

export default async function handler(req: NextRequest, res: NextApiResponse) {
  try {
    // Parse the sessionId from the request body
    const { sessionId } = await req.json();
    console.log("Session ID:", sessionId);

    // Get the current user session using next-auth
    const session = await getServerSession(NEXT_AUTH as AuthOptions);
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized, no active session' });
    }

    // Find the user by email (based on session)
    const user = await prisma.user.findFirst({
      where: {
        email: session.user?.email || "",
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized, user not found' });
    }

    // Verify the sessionId belongs to the logged-in user
    const userSession = await prisma.session.findFirst({
      where: {
        userId: user.id,
        id: sessionId,
      },
    });

    if (!userSession) {
      return res.status(404).json({ error: 'Session not found or does not belong to the user' });
    }

    console.log("Session verified for user:", user.id);

    // Construct the storage path using the userId and sessionId
    const path = `${user.id}/${sessionId}`;
    console.log("Storage Path:", path);

    // Fetch file structure from Supabase storage
    const { data, error } = await supabaseClient.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string)
      .list(path);

    if (error) {
      return res.status(500).json({ error: 'Error fetching file structure' });
    }

    // Map the file structure to the appropriate format
    const fileStructure = data?.map((item) => ({
      name: item.name,
      isFolder: item.metadata?.mimetype === null,  
    }));

    // Return the file structure to the frontend
    return res.status(200).json(fileStructure);
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: 'Server error fetching file structure' });
  }
}
