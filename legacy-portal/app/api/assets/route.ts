import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({
  url: z.string().url(),
  label: z.string().min(1).max(200),
  kind: z.enum(["photo", "video", "clip", "avatar"]).default("photo"),
});

export async function GET() {
  const { client } = await requireClient();
  const assets = await prisma.asset.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, assets });
}

export async function POST(req: NextRequest) {
  const { client } = await requireClient();
  const json = await req.json();
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid fields" }, { status: 400 });
  }
  const data = parsed.data;
  const created = await prisma.asset.create({
    data: { clientId: client.id, url: data.url, label: data.label, kind: data.kind, status: "READY" },
  });
  return NextResponse.json({ ok: true, asset: created });
}

export async function DELETE(req: NextRequest) {
  const { client } = await requireClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  
  const asset = await prisma.asset.findFirst({ where: { id, clientId: client.id } });
  if (!asset) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  
  await prisma.asset.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}


