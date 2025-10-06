"use client";
import { useState } from "react";

export default function UploadCenter() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      setMsg("Uploaded. Starting avatar job…");
      // Trigger avatar creation with returned URL
      if (json?.url) {
        await fetch("/api/create-avatar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileUrl: json.url }) });
      }
      form.reset();
      // Give the server a moment to write the PENDING asset then refresh to show status
      setTimeout(() => {
        try { location.reload(); } catch {}
      }, 1000);
    } catch (err: any) {
      setMsg(err?.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3">
      <input name="file" type="file" accept=".mp3,.mp4,.wav" className="block" />
      <button className="aa-btn mt-3" type="submit" disabled={busy}>{busy ? "Uploading..." : "Upload"}</button>
      {msg && <p className="mt-2 text-sm text-neutral-500">{msg}</p>}
    </form>
  );
}


