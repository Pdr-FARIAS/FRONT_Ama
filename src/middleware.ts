
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {

    const token = req.headers.get("authorization") || req.cookies.get("token")?.value;


    const { pathname } = req.nextUrl;


    if (!token && pathname.startsWith("/dashboard")) {

        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
export const config = {
    matcher: '/dashboard/:path*',
}