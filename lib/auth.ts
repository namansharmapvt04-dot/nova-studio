import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface AdminPayload {
  role: "admin";
}

export function signAdminToken(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ role: "admin" } as AdminPayload, secret, {
    expiresIn: "8h",
  });
}

export function verifyAdminToken(token: string): AdminPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return jwt.verify(token, secret) as AdminPayload;
}

export function extractBearerToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export function requireAdmin(req: NextRequest): AdminPayload {
  const token = extractBearerToken(req);
  if (!token) throw new Error("Missing token");
  return verifyAdminToken(token);
}
