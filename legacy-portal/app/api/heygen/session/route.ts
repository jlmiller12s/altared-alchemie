import { NextRequest, NextResponse } from "next/server";
import { requireClient } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { client } = await requireClient();
  const body = await req.json();
  const avatarId = body.avatarId || "default";
  
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "HeyGen API key not configured" }, { status: 500 });
  }

  try {
    // Create a streaming session with HeyGen
    const response = await fetch("https://api.heygen.com/v1/streaming.new", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quality: "high",
        avatar_name: process.env.HEYGEN_AVATAR_ID || "55f325d395904613a896312d9654c3d0", // Use your specific avatar
        voice: {
          voice_id: "2d5b0e6cf36f460aa7fc47e3eee4ba54",
          rate: 1.0,
          emotion: "neutral"
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HeyGen API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({ 
      ok: true, 
      sessionId: data.session_id,
      sdp: data.sdp,
      ice_servers: data.ice_servers,
      url: data.url
    });
  } catch (error) {
    console.error("HeyGen session creation failed:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
