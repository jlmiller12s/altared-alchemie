export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { text: string; color: string }> = {
    AWAITING_INTAKE: { text: "Awaiting intake", color: "bg-neutral-700" },
    AWAITING_UPLOAD: { text: "Awaiting upload", color: "bg-yellow-600" },
    PENDING: { text: "Processing", color: "bg-yellow-600" },
    PROCESSING: { text: "Processing", color: "bg-yellow-600" },
    READY: { text: "Ready", color: "bg-green-600" },
    FAILED: { text: "Failed", color: "bg-red-600" },
  };
  const s = map[status] || map.AWAITING_INTAKE;
  return <span className={`inline-flex items-center rounded px-2 py-1 text-xs text-white ${s.color}`}>{s.text}</span>;
}


