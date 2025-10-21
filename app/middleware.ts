import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const tipo = req.cookies.get("tipo")?.value;
  const { pathname } = req.nextUrl;

  // se não tiver token, redireciona pro login
  if (!token) {
    if (pathname !== "/login") {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // se tiver token mas tipo errado, redireciona pro home correto
  if (pathname.startsWith("/parceiro") && tipo !== "parceiro") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/adotante/home";
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith("/adotante") && tipo !== "adotante") {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/parceiro/home";
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/parceiro/:path*", "/adotante/:path*"],
};

