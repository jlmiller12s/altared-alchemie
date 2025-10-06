import { requireClient } from "@/lib/auth";

export default async function PortalHome() {
  const { client } = await requireClient();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome {client.preferredName || client.fullName}</h1>
      <p className="mt-2 text-neutral-600">Signed in as {client.email}</p>
      <div className="mt-6 grid gap-4">
        <div className="rounded border p-4">
          <h3 className="font-medium">Status</h3>
          <p className="text-sm mt-1">{client.status}</p>
        </div>
        <div className="rounded border p-4">
          <h3 className="font-medium">Your sections</h3>
          <ul className="list-disc ml-5 mt-2 text-sm">
            <li>Intake shows what you submitted</li>
            <li>Stories lets you paste your three drafts</li>
            <li>AI Clone will display your avatar when it is ready</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

