import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

// Check if Clerk is configured
const isClerkConfigured = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

export async function requireClient() {
  // If Clerk is not configured, return mock data
  if (!isClerkConfigured) {
    const mockClient = await prisma.client.findFirst();
    const mockUser = {
      id: "mock-user-id",
      emailAddresses: [{ emailAddress: "demo@example.com" }],
      firstName: "Demo",
      lastName: "User"
    };
    return { client: mockClient, user: mockUser } as const;
  }

  const user = await currentUser();
  if (!user?.id) throw new Error("Auth required");
  const email = user.emailAddresses?.[0]?.emailAddress || "";
  let client = await prisma.client.findFirst({ where: { userId: user.id } });
  if (!client && email) {
    const byEmail = await prisma.client.findFirst({ where: { email } }).catch(() => null);
    if (byEmail) {
      client = await prisma.client.create({ data: { userId: user.id, email, fullName: byEmail.fullName, preferredName: byEmail.preferredName, intakeJson: byEmail.intakeJson } });
    }
  }
  if (!client) {
    client = await prisma.client.create({ data: { userId: user.id, email, fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || email, preferredName: user.firstName || "Friend", intakeJson: "" } });
  }
  return { client, user } as const;
}

