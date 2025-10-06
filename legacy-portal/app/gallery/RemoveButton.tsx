"use client";
import { useState } from "react";

export function RemoveButton({ assetId }: { assetId: string }) {
  const [busy, setBusy] = useState(false);

  async function handleRemove() {
    if (!confirm("Remove this memory from your gallery?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/assets?id=${assetId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove");
      // Refresh the page to show updated gallery
      window.location.reload();
    } catch (err) {
      alert("Failed to remove memory. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleRemove}
      disabled={busy}
      className="absolute top-2 left-2 w-6 h-6 text-black hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xl font-bold"
      title="Remove memory"
      aria-label="Remove memory"
    >
      {busy ? "..." : "×"}
    </button>
  );
}
