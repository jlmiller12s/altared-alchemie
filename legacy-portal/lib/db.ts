import { PrismaClient } from "@prisma/client";

// Global store for mock database (persists during serverless function lifetime)
let globalMockAssets: any[] = [
  {
    id: "mock-asset-1",
    clientId: "mock-client-id",
    kind: "photo",
    label: "Sample Photo",
    url: "/placeholder-photo.jpg",
    status: "READY",
    tag: "",
    jobId: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "mock-asset-2",
    clientId: "mock-client-id",
    kind: "video",
    label: "Sample Video",
    url: "/placeholder-video.jpg",
    status: "READY",
    tag: "",
    jobId: "",
    createdAt: new Date().toISOString(),
  }
];

// Simple in-memory storage that works better with serverless
function getMockAssets() {
  return globalMockAssets;
}

function addMockAsset(asset: any) {
  globalMockAssets.push(asset);
  return asset;
}

function removeMockAsset(id: string) {
  const index = globalMockAssets.findIndex(a => a.id === id);
  if (index !== -1) {
    return globalMockAssets.splice(index, 1)[0];
  }
  return null;
}

// Create a mock database for when DATABASE_URL is not available
const createMockPrisma = () => {
  return {
    client: {
      findFirst: () => Promise.resolve({
        id: "mock-client-id",
        userId: "mock-user-id",
        email: "demo@example.com",
        fullName: "Demo User",
        preferredName: "Demo",
        status: "NEW",
        intakeJson: "{}",
        intakeSubmittedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve({
        id: "mock-client-id",
        userId: "mock-user-id",
        email: "demo@example.com",
        fullName: "Demo User",
        preferredName: "Demo",
        status: "NEW",
        intakeJson: "{}",
        intakeSubmittedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    },
    asset: {
      findFirst: ({ where }: { where: { id: string; clientId: string } }) => {
        const assets = getMockAssets();
        const asset = assets.find((a: any) => a.id === where.id && a.clientId === where.clientId);
        return Promise.resolve(asset || null);
      },
      findMany: ({ where }: { where: { clientId: string } } = { where: { clientId: "mock-client-id" } }) => {
        const assets = getMockAssets();
        const filteredAssets = assets.filter((a: any) => a.clientId === where.clientId);
        return Promise.resolve(filteredAssets);
      },
      create: (data: any) => {
        const newAsset = {
          id: `mock-asset-${Date.now()}`,
          clientId: data.clientId || "mock-client-id",
          kind: data.kind || "photo",
          label: data.label || "Mock Asset",
          url: data.url || "/placeholder-photo.jpg",
          status: data.status || "READY",
          tag: data.tag || "",
          jobId: data.jobId || "",
          createdAt: new Date().toISOString(),
        };
        addMockAsset(newAsset);
        return Promise.resolve(newAsset);
      },
      delete: ({ where }: { where: { id: string } }) => {
        const deleted = removeMockAsset(where.id);
        return Promise.resolve(deleted);
      },
    },
    story: {
      findFirst: () => Promise.resolve({
        id: "mock-story-id",
        clientId: "mock-client-id",
        s1: "This is a sample story about my childhood memories.",
        s2: "Here's another story about my family traditions.",
        s3: "And this is a story about my greatest achievements.",
        createdAt: new Date(),
      }),
      create: (data: any) => Promise.resolve({
        id: `mock-story-${Date.now()}`,
        clientId: data.clientId || "mock-client-id",
        s1: data.s1 || "Sample story 1",
        s2: data.s2 || "Sample story 2", 
        s3: data.s3 || "Sample story 3",
        createdAt: new Date(),
      }),
    },
  } as any;
};

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Use mock database if DATABASE_URL is not available or if it's a file URL (SQLite)
const shouldUseMock = !process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith('file:');

export const prisma = shouldUseMock 
  ? createMockPrisma()
  : (globalForPrisma.prisma ?? new PrismaClient());

if (process.env.NODE_ENV !== "production" && !shouldUseMock) {
  globalForPrisma.prisma = prisma as PrismaClient;
}

