// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // 1. Tenta pegar o token (do header ou dos cookies)
    const token = req.headers.get("authorization") || req.cookies.get("token")?.value;

    // 2. Pega o caminho que o usuário quer acessar (ex: "/dashboard")
    const { pathname } = req.nextUrl;

    // 3. Se não houver token E o usuário estiver indo para o dashboard...
    if (!token && pathname.startsWith("/dashboard")) {
        // 4. Redireciona para a página de login
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    // 5. Se tiver token, ou for outra página, deixa passar
    return NextResponse.next();
}
export const config = {
    matcher: '/dashboard/:path*',
}