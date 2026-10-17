import { NextRequest, NextResponse } from "next/server";
import { getAllWaitlistEntries } from "@/lib/waitlist-storage";

function isOperatorAuthorized(req: NextRequest): boolean {
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

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Strict authorization check
  if (!isOperatorAuthorized(req)) {
    return NextResponse.json(
      {
        success: false,
        error: "UNAUTHORIZED",
        message: "Operator authorization required to access waitlist records.",
      },
      { status: 401 }
    );
  }

  const entries = await getAllWaitlistEntries();
  const format = req.nextUrl.searchParams.get("format");

  // Secure CSV Export for authorized operators
  if (format === "csv") {
    const csvHeaders = "ID,Email,Is Adult (18+),Consent Given,Consent Timestamp,Consent Version,City,Created At,Email Delivery Status,Email Error\n";
    const csvRows = entries
      .map((e) => {
        const cleanEmail = `"${e.email.replace(/"/g, '""')}"`;
        const cleanError = e.emailError ? `"${e.emailError.replace(/"/g, '""')}"` : '""';
        return `${e.id},${cleanEmail},${e.isAdult},${e.consentGiven},${e.consentTimestamp},${e.consentVersion},${e.city},${e.createdAt},${e.emailDeliveryStatus},${cleanError}`;
      })
      .join("\n");

    return new NextResponse(csvHeaders + csvRows, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="vouple-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.json({
    success: true,
    totalSignups: entries.length,
    market: "Jabalpur, Madhya Pradesh, India",
    cohort: "№ 001",
    records: entries,
  });
}
