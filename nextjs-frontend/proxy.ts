import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export async function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  // Basic guard: if no token present redirect to login. Full user validation
  // can be reintroduced when clientService is available.
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
