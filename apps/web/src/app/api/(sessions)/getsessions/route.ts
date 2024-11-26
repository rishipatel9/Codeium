import { NEXT_AUTH } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthOptions, getServerSession } from "next-auth";
import {  NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession(NEXT_AUTH as AuthOptions);
    if (!session || !session.user || !session.user.email) {
        return NextResponse.json({ error: "No Sessions Found" }, { status: 401 });
    }
    console.log("Request recived")
    console.log("Session:", session);
    const userEmail = session.user.email;
    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail },
            include: { session: true },
        });
        console.log(user)
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching sessions:", error);
        return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
    }
}
