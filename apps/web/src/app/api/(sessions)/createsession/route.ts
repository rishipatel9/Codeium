import { NEXT_AUTH } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { fetchAndUploadTemplate } from "@/utils/TemplateCreation";
import { createClient } from "@supabase/supabase-js";
import { NextApiResponse } from "next";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextApiResponse) {
  const { name, desc } = await req.json();
  try {
    const session = await getServerSession(NEXT_AUTH as AuthOptions);
    console.log(session?.user?.email);
    let user;
    if (session) {
      user = await prisma.user.findFirst({
        where: {
          email: session.user?.email || "",
        },
      });
    }
    const createdSession = await prisma.session.create({
      data: {
        name,
        desc,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    console.log(createdSession);
  
    const userUUID = user?.id;
    const sessionUUID = createdSession.id;
    const filePath = `${userUUID}/${sessionUUID}/example.txt`;
    const templatePath = 'react'; 
    await fetchAndUploadTemplate(templatePath, `${userUUID}/${sessionUUID}`);
    
    console.log(`File uploaded successfully to: ${filePath}`);
    return NextResponse.json(createdSession);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Error creating session" });
  }
}


