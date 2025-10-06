import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Example webhook receiver to update asset status when HeyGen finishes.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({} as any));
  const jobId = String(body.jobId || "");
  const url = String(body.url || "");
  const status = String(body.status || "READY");
  if (!jobId) return NextResponse.json({ ok: false }, { status: 400 });
  const asset = await prisma.asset.findFirst({ where: { jobId } });
  if (!asset) return NextResponse.json({ ok: false }, { status: 404 });
  await prisma.asset.update({ where: { id: asset.id }, data: { status: status === "READY" ? "READY" : "FAILED", url } });
  return NextResponse.json({ ok: true });
}


