import { requireClient } from "@/lib/auth";
import { UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { StatusBadge } from "./StatusBadge";
import UploadCenter from "./UploadCenter";
import { ShareButton } from "./ShareButton";
import { SimpleAvatar } from "./SimpleAvatar";
import ConsentForm from "./ConsentForm";

export const dynamic = "force-dynamic";

const hasClerk = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

export default async function DashboardPage() {
  try {
    const { client, user } = await requireClient();
  const raw = typeof client.intakeJson === 'string' ? client.intakeJson : JSON.stringify(client.intakeJson || {});
  const data: any = (() => { try { return JSON.parse(raw || '{}'); } catch { return {}; } })();
  const intake = {
    fullName: String(data.q1_fullName || client.fullName),
    preferredName: String(data.q2_preferredName || client.preferredName || ''),
    purpose: String(data.q9_purpose || ''),
    topMessages: String(data.q10_topMessages || ''),
  };
  const submittedAt = client.intakeSubmittedAt ? new Date(client.intakeSubmittedAt) : null;
  const latestAvatar = await prisma.asset.findFirst({ where: { clientId: client.id, kind: "avatar" }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-8">
      <section className="aa-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welcome {client.preferredName || client.fullName}</h1>
            <p className="text-neutral-600">{client.email}</p>
          </div>
          {hasClerk ? (
            <UserButton />
          ) : (
            <span className="text-xs text-neutral-500">Clerk not configured</span>
          )}
        </div>
      </section>

      <section className="aa-card">
        <h2 className="text-lg font-semibold">Your intake</h2>
        {!submittedAt && (
          <p className="mt-2 text-neutral-600">You haven't submitted your intake yet. <a className="aa-link" href="http://localhost:5177/legacy-avatar/start.html" target="_blank">Open intake form</a></p>
        )}
        <dl className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><dt className="text-sm text-neutral-500">Full name</dt><dd className="font-medium">{intake.fullName}</dd></div>
          <div><dt className="text-sm text-neutral-500">Preferred name</dt><dd className="font-medium">{intake.preferredName}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm text-neutral-500">Purpose</dt><dd className="font-medium">{intake.purpose || '—'}</dd></div>
          <div className="sm:col-span-2"><dt className="text-sm text-neutral-500">Top messages</dt><dd className="font-medium whitespace-pre-wrap">{intake.topMessages || '—'}</dd></div>
        </dl>
        {submittedAt && <p className="mt-2 text-sm text-neutral-500">Submitted on {submittedAt.toLocaleDateString()}</p>}
      </section>

      <section className="aa-card">
        <h2 className="text-lg font-semibold">Your Legacy Avatar</h2>
        <div className="mt-2 text-sm text-neutral-600">
          <StatusBadge status={latestAvatar?.status || (submittedAt ? "AWAITING_UPLOAD" : "AWAITING_INTAKE")} />
          <span className="ml-3">Usually takes 2–5 business days after upload.</span>
        </div>
        <div className="mt-4">
          <ConsentForm />
          <SimpleAvatar />
        </div>
      </section>

      <section className="aa-card">
        <h2 className="text-lg font-semibold">Upload center</h2>
        <p className="text-sm text-neutral-600">Upload audio or video (max 2 minutes). Accepted: .mp3 .mp4 .wav</p>
        {/* Client-side handler for better feedback */}
        <UploadCenter />
      </section>
    </div>
  );
  } catch {
    if (hasClerk) redirect("/sign-in");
    // If Clerk not configured, show a simple message instead of crashing
    return (
      <div className="aa-card p-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-neutral-600 mt-2">Clerk is not configured. Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY.</p>
      </div>
    ) as any;
  }
}

