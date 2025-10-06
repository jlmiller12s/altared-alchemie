import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { promises as fs } from "node:fs";
import path from "node:path";
import UploadForm from "./UploadForm";
import { RemoveButton } from "./RemoveButton";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const { client } = await requireClient();
  const assets = await prisma.asset.findMany({ where: { clientId: client.id }, orderBy: { createdAt: "desc" } });
  const story = await prisma.story.findFirst({ where: { clientId: client.id }, orderBy: { createdAt: "desc" } });
  
  // Pull top messages from intake as a fallback for quotes
  const intakeRaw = client.intakeJson || "";
  const intake: any = (() => { try { return JSON.parse(intakeRaw || '{}'); } catch { return {}; } })();
  const topMessagesRaw = String(intake.q10_topMessages || "").trim();
  const topMessageLines = topMessagesRaw ? topMessagesRaw.split(/\r?\n+/).map((s: string) => s.trim()).filter(Boolean) : [];

  const photos = assets.filter((a: any) => a.kind === "photo");
  const videos = assets.filter((a: any) => a.kind === "video" || a.kind === "clip");
  
  // Debug logging
  console.log("Gallery assets:", assets.length, assets);
  console.log("Photos found:", photos.length);
  console.log("Videos found:", videos.length);
  const memoryInputs = [String(intake.q31_memory1||""), String(intake.q32_memory2||""), String(intake.q33_memory3||"")].filter(Boolean) as string[];
  const memoryItems = ([story?.s1, story?.s2, story?.s3].filter(Boolean) as string[])
    .concat(memoryInputs)
    .concat(topMessageLines)
    .slice(0, 10);

  return (
    <div className="space-y-8">
      <section className="aa-card">
        <h1 className="text-2xl font-semibold">Your gallery</h1>
        <p className="text-neutral-600 mt-1">Upload links to your approved photos and videos. For private files, use storage URLs that require auth.</p>
        <UploadForm />
      </section>

      {photos.length > 0 && (
        <section className="aa-card overflow-hidden">
          <h2 className="text-lg font-semibold">Photos</h2>
          <div className="relative mt-3 w-full">
            <div className="flex gap-4 aa-marquee">
              {[...photos, ...photos].map((p, idx) => (
                <div key={`${p.id}-${idx}`} className="relative flex-none w-[500px] h-[500px] overflow-hidden rounded-xl border border-neutral-800 bg-black/40 group">
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <RemoveButton assetId={p.id} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="aa-card overflow-hidden">
        <h2 className="text-lg font-semibold">Memory Wall</h2>
        <div className="relative mt-3 w-full">
          {memoryItems.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
              {memoryItems.map((text, idx) => (
                <blockquote key={idx} className="flex-none w-[500px] h-[500px] rounded-xl border border-neutral-800 bg-black/40 p-6 snap-center">
                  <p className="text-xl leading-relaxed">&ldquo;{text}&rdquo;</p>
                </blockquote>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-800 bg-black/40 p-6 text-neutral-400">
              Add your core stories or top messages to see them here.
            </div>
          )}
        </div>
      </section>

      {videos.length > 0 && (
        <section className="aa-card overflow-hidden">
          <h2 className="text-lg font-semibold">Videos</h2>
          <div className="relative mt-3 w-full">
            <div className="flex gap-4 aa-marquee">
              {[...videos, ...videos].map((v, idx) => (
                <div key={`${v.id}-${idx}`} className="relative flex-none w-[500px] h-[500px] overflow-hidden rounded-xl border border-neutral-800 bg-black/40 group">
                  <video className="w-full h-full object-cover" controls src={v.url} />
                  <RemoveButton assetId={v.id} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}



