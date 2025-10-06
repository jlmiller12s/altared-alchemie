"use client";

import { useState, useEffect } from "react";

export default function ConsentForm() {
  const [consent, setConsent] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/storeConsent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentGiven: consent, signedName: name || undefined, date }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMsg("Consent saved");
    } catch (e: any) {
      setMsg(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-4">
      <h3 className="text-lg font-semibold">Consent to Create Legacy Avatar</h3>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" className="mt-1" checked={consent} onChange={e => setConsent(e.target.checked)} required />
        <span>I consent to the use of my voice, image, and likeness to create a private AI Legacy Avatar as described.</span>
      </label>
      <div>
        <label className="block text-sm font-medium">Type full legal name as signature (optional)</label>
        <input className="mt-1 w-full rounded bg-neutral-800 border border-neutral-700 px-3 py-2" value={name} onChange={e => setName(e.target.value)} placeholder="Full legal name" />
      </div>
      <div>
        <label className="block text-sm font-medium">Date</label>
        <input type="date" className="mt-1 rounded bg-neutral-800 border border-neutral-700 px-3 py-2" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div className="text-sm text-neutral-400">
        Optional studio video statement: “My name is [Full Name], and I give Altared Alchemie permission to create my Legacy Avatar using my voice and likeness.”
      </div>
      <button type="submit" className="aa-btn" disabled={saving || !consent}>{saving ? "Saving..." : "Save consent"}</button>
      {msg && <p className="text-sm text-neutral-400">{msg}</p>}
    </form>
  );
}


