import { NextResponse, type NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    console.log(req.url);
    return NextResponse.redirect(new URL("/",req.url));
}

export const config = {
    matcher: ["/problems"],
};
