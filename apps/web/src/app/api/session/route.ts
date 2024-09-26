import { NEXT_AUTH } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Usr } from "@/types";
import { NextApiResponse } from "next";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export  async function POST(req: NextRequest, res: NextApiResponse) {
    const { name, desc } = await req.json();
    try {
      const session:Usr | null=await getServerSession(NEXT_AUTH as AuthOptions);
      let user ;
      if(session){
        user=await prisma.user.findFirst({
          where:{
            email:session.email
          }
        })
      }
      console.log(user?.id);
      const createdSession=await prisma.session.create({
        data:{
          name,
          desc,
          user:{
            connect:{
              id:user?.id
            }
          }
        }
      })      
      return NextResponse.json(createdSession);
    } catch (error) {
      return NextResponse.json({ error: "Error creating session" });
    }

}
