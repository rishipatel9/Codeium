import { NextApiResponse } from 'next';
import { supabaseClient } from '@/utils/SupabaseClient';
import { AuthOptions, getServerSession } from 'next-auth';
import { NEXT_AUTH } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextApiResponse) {
  try {
    const { sessionId, path = '' } = await req.json();
    const session = await getServerSession(NEXT_AUTH as AuthOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized, no active session' }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        email: session.user?.email || '',
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized, user not found' }, { status: 401 });
    }

    const storagePath = `${user.id}/${sessionId}/${path}`;
    const { data, error } = await supabaseClient.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string)
      .list(storagePath);

    if (error) {
      return NextResponse.json({ error: 'Error fetching file structure' }, { status: 503 });
    }

    const fileStructure = data?.map(item => ({
      name: item.name,
      isFolder: item.metadata?.mimetype === null,
    }));

    return NextResponse.json(fileStructure, { status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ error: 'Server error fetching file structure' }, { status: 500 });
  }
}
