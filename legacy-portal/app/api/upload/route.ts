import { NextRequest, NextResponse } from "next/server";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { client } = await requireClient();
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const label = form.get("label") as string || "Untitled";
    const tag = form.get("tag") as string || "";
    
    if (!file) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    // Determine file type
    const mime = file.type || "";
    const kind = mime.startsWith("video") ? "video" : "photo";
    
    // Create a mock URL for demo purposes
    const url = kind === "video" ? `/placeholder-video.jpg` : `/placeholder-photo.jpg`;
    
    // Create asset in database
    const asset = await prisma.asset.create({
      data: {
        clientId: client.id,
        url,
        label: `${label} - ${file.name}`,
        kind,
        status: "READY",
        tag,
      },
    });

    return NextResponse.json({ 
      ok: true, 
      url,
      asset: {
        id: asset.id,
        label: asset.label,
        kind: asset.kind,
        status: asset.status
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      ok: false, 
      error: "Upload failed" 
    }, { status: 500 });
  }
}

