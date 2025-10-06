"use client";
import { useState } from "react";

export default function UploadForm() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      
      // Get all selected files
      const files = formData.getAll("files") as File[];
      const label = formData.get("label") as string || "Untitled";
      const tag = formData.get("tag") as string || "";

      if (files.length === 0) {
        throw new Error("Please select at least one file");
      }

      // Process each file
      for (const file of files) {
        const fileFormData = new FormData();
        fileFormData.append("file", file);
        fileFormData.append("label", label);
        fileFormData.append("tag", tag);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: fileFormData,
        });

        if (!response.ok) {
          const error = await response.json().catch(() => ({}));
          throw new Error(error.error || "Upload failed");
        }

        const result = await response.json();
        console.log("Upload successful:", result);
      }

      setMessage(`Successfully uploaded ${files.length} file(s)!`);
      form.reset();
      
      // Force a hard refresh to show new assets
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 500);

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      console.error("Upload error:", error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <input 
          name="files" 
          type="file" 
          accept=".jpg,.jpeg,.png,.mp4,.webm" 
          multiple 
          className="rounded border border-neutral-800 bg-black/40 px-3 py-2" 
          required 
        />
        <input name="label" placeholder="Label (optional)" className="rounded border border-neutral-800 bg-black/40 px-3 py-2" />
        <select name="tag" className="rounded border border-neutral-800 bg-black/40 px-3 py-2">
          <option value="">Other</option>
          <option value="For Avatar">For Avatar</option>
          <option value="For Memories">For Memories</option>
        </select>
      </div>
      <div className="text-sm text-neutral-400">
        💡 You can select multiple files at once by holding Ctrl (or Cmd on Mac) while clicking files
      </div>
      <button 
        className="aa-btn" 
        type="submit" 
        disabled={busy}
      >
        {busy ? "Uploading..." : "Upload to gallery"}
      </button>
      {message && (
        <div className={`text-sm ${message.includes("Error") ? "text-red-400" : "text-green-400"}`}>
          {message}
        </div>
      )}
    </form>
  );
}
