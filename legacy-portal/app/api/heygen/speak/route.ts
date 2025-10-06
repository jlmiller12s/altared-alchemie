import { NextRequest, NextResponse } from "next/server";
import { requireClient } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { client } = await requireClient();
  const body = await req.json();
  const { sessionId, text } = body;
  
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "HeyGen API key not configured" }, { status: 500 });
  }

  try {
    // Send text to avatar for speaking
    const response = await fetch("https://api.heygen.com/v1/streaming.task", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        text: text,
        task_type: "talk"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HeyGen speak API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, taskId: data.task_id });
  } catch (error) {
    console.error("HeyGen speak failed:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
