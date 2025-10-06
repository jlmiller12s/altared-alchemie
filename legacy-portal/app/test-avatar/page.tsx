import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function completeAvatar(formData: FormData) {
  "use server";
  const { client } = await requireClient();
  
  // Find any pending avatar or create one
  let avatar = await prisma.asset.findFirst({ 
    where: { clientId: client.id, kind: "avatar" }, 
    orderBy: { createdAt: "desc" } 
  });
  
  if (!avatar) {
    avatar = await prisma.asset.create({
      data: { 
        clientId: client.id, 
        kind: "avatar", 
        label: "Legacy avatar", 
        url: "", 
        status: "PENDING", 
        jobId: `demo_${Date.now()}`,
        tag: "For Avatar"
      }
    });
  }
  
  // Mark it as ready with a demo video
  await prisma.asset.update({
    where: { id: avatar.id },
    data: { 
      status: "READY", 
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" 
    }
  });
  
  revalidatePath("/dashboard");
}

export default async function TestAvatarPage() {
  const { client } = await requireClient();
  
  return (
    <div className="aa-card">
      <h1 className="text-2xl font-semibold">Test Avatar Completion</h1>
      <p className="mt-2 text-neutral-600">This simulates HeyGen completing your avatar job.</p>
      
      <form action={completeAvatar} className="mt-4">
        <button className="aa-btn" type="submit">
          Complete Avatar (Demo)
        </button>
      </form>
      
      <p className="mt-3 text-sm text-neutral-500">
        After clicking, go to <a href="/dashboard" className="aa-link">Dashboard</a> to see your completed avatar.
      </p>
    </div>
  );
}
