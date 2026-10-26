import { NextRequest } from "next/server";

export function isOperatorAuthorized(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET_KEY || "vouple-operator-2026";
  const authHeader = req.headers.get("authorization");
  const queryKey = req.nextUrl.searchParams.get("key");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (token === adminSecret) return true;
  }

  if (queryKey && queryKey.trim() === adminSecret) {
    return true;
  }

  return false;
}
