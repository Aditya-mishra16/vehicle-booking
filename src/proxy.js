import { NextResponse } from "next/server";

export default function proxy(req) {
  const token = req.cookies.get("adminToken")?.value;
  const { pathname } = req.nextUrl;

  // If logged in admin tries to visit login page
  if (pathname === "/admin-login") {
    if (token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
};
