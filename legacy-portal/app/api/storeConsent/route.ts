import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({
  consentGiven: z.boolean(),
  signedName: z.string().optional(),
  date: z.string().optional(), // ISO date string
});

export async function POST(req: NextRequest) {
  const { client } = await requireClient();
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
  const json = await req.json().catch(() => ({} as any));
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid fields" }, { status: 400 });

  const { consentGiven, signedName, date } = parsed.data;

  if (!consentGiven) {
    return NextResponse.json({ ok: false, error: "Consent is required" }, { status: 400 });
  }

  const signedAt = signedName ? new Date() : null;
  const dateObj = date ? new Date(date) : new Date();

  await prisma.consent.upsert({
    where: { clientId: client.id },
    update: { consentGiven: true, signedName: signedName || null, signedAt, date: dateObj },
    create: { clientId: client.id, consentGiven: true, signedName: signedName || null, signedAt, date: dateObj },
  });

  // Optionally keep minimal audit trail in Asset or elsewhere; IP can be logged server-side only
  console.log("Consent stored for", client.id, ip);

  return NextResponse.json({ ok: true });
}


