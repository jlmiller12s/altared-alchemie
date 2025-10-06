import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const STATIC_ORIGIN = process.env.NEXT_PUBLIC_STATIC_ORIGIN || "http://localhost:5177";
const SECRET = process.env.LEGACY_AVATAR_TYPEFORM_WEBHOOK_SECRET || "replace_me";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": STATIC_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-AA-INTAKE-SECRET",
    "Access-Control-Allow-Credentials": "true",
  } as Record<string, string>;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-aa-intake-secret");
  const devBypass = process.env.DEV_BYPASS_SECRET === "true" || process.env.NODE_ENV !== "production";
  const referer = req.headers.get("referer") || "";
  const fromStatic = referer.startsWith(STATIC_ORIGIN);
  if (!(secret && secret === SECRET) && !(devBypass && fromStatic)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401, headers: corsHeaders() });
  }

  try {
    const body = await req.json();
    const email = String(body.email || "").toLowerCase();
    const fullName = String(body.fullName || "Friend");
    const preferredName = String(body.preferredName || fullName.split(" ")[0]);
    if (!email) return NextResponse.json({ ok: false, error: "Missing email" }, { status: 400, headers: corsHeaders() });

    const existing = await prisma.client.findUnique({ where: { email } }).catch(() => null);
    if (existing) {
      await prisma.client.update({ where: { email }, data: { intakeJson: JSON.stringify(body), intakeSubmittedAt: new Date() } });
    } else {
      // Generate a truly unique userId by combining email hash and timestamp
      const uniqueUserId = `pending_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      await prisma.client.create({ data: { email, fullName, preferredName, intakeJson: JSON.stringify(body), intakeSubmittedAt: new Date(), userId: uniqueUserId } });
    }
    return NextResponse.json({ ok: true }, { headers: corsHeaders() });
  } catch (e) {
    console.error("Intake API error:", e);
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500, headers: corsHeaders() });
  }
}


