import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return new TextEncoder().encode(secret);
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

function isProtectedApiRoute(req: NextRequest): boolean {
  const pathname = req.nextUrl.pathname;
  const method = req.method;
  if (pathname.startsWith("/api/contacts")) return true;
  if (pathname.startsWith("/api/projects") && (method === "POST" || method === "DELETE")) return true;
  return false;
}

export async function middleware(req: NextRequest) {
  if (isProtectedApiRoute(req)) {
    const token = extractToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const valid = await verifyToken(token);
    if (!valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/contacts/:path*", "/api/projects/:path*"],
};
