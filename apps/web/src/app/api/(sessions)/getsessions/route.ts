import { NEXT_AUTH } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { AuthOptions, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextApiResponse) {
    const session = await getServerSession(NEXT_AUTH as AuthOptions);
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "No Sessions Found" }, { status: 401 });
    }
    const userEmail = session.user.email;
    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
        });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const userSessions = await prisma.session.findMany({
            where: {
                userId: user.id,
            },
        });
        return NextResponse.json(userSessions, { status: 200 });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}
