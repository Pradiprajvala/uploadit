import { NextResponse } from "next/server";

export async function middleware(request) {
  const session = request.cookies.get("next-auth.session-token");
  console.log("middleware called");

  if (!session && request.nextUrl.pathname.startsWith("/api/project/retrive")) {
    return NextResponse.json({
      status: 401,
      message: "Unauthorized",
    });
  }
  if (!session && !request.nextUrl.pathname.startsWith("/auth/signin")) {
    return Response.redirect(new URL("/auth/signin", request.url));
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
