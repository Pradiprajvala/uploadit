import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const url = request.url;
  const parts = url.split("/");
  if (parts.length >= 4 && parts[3] === "project") {
    const token = await getToken({ req: request });
    const user = token?.name;
    const projectId = parts[4];
    if (!user || !user.projects?.includes(projectId)) {
      return new NextResponse("Unauthorized");
    }
  }
}

export const config = {
  matcher: ["/project/:path*"],
};
