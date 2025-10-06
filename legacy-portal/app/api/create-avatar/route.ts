import { NextRequest, NextResponse } from "next/server";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { client } = await requireClient();
  const body = await req.json().catch(() => ({} as any));
  const fileUrl: string = String(body.fileUrl || "");
  const intakeData: any = body.intakeData || {};
  if (!fileUrl) return NextResponse.json({ ok: false, error: "Missing fileUrl" }, { status: 400 });

  // Require consent before proceeding
  const consent = await prisma.consent.findUnique({ where: { clientId: client.id } }).catch(() => null);
  if (!consent || !consent.consentGiven) {
    return NextResponse.json({ ok: false, error: "Consent required before avatar creation" }, { status: 403 });
  }

  const apiKey = process.env.HEYGEN_API_KEY || "";
  let jobId = "";
  let assetId = "";
  try {
    if (apiKey) {
      // Attempt a real HeyGen job creation.
      // Endpoint and payload may vary; adjust to your HeyGen plan.
      const res = await fetch("https://api.heygen.com/v1/talks/create", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          // Example payload using your uploaded media as source
          video_url: fileUrl,
          callback_url: `${req.nextUrl.origin}/api/webhooks/heygen`,
          metadata: { client_id: client.id, email: client.email },
        }),
      });
      if (!res.ok) throw new Error(`HeyGen error ${res.status}`);
      const data = await res.json().catch(() => ({} as any));
      jobId = String(data.job_id || data.id || "");
    }
  } catch (err) {
    // Fallback to a dev job id when HeyGen is unreachable
    jobId = `job_${Date.now()}`;
  }

  const created = await prisma.asset.create({
    data: { clientId: client.id, kind: "avatar", label: "Legacy avatar", url: "", status: "PENDING", jobId: jobId || `job_${Date.now()}` , tag: "For Avatar" },
  });
  assetId = created.id;

  return NextResponse.json({ ok: true, jobId, assetId });
}


