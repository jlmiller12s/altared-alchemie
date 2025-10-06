import Link from "next/link";

export const metadata = {
  title: "Meet Your AI Avatar Clone",
  description: "Speak, express, and share memories through a lifelike AI avatar for your family.",
};

export default function LegacyAvatarPage() {
  const intakeUrl = process.env.NEXT_PUBLIC_LEGACY_INTAKE_URL || "http://localhost:5177/legacy-avatar/start.html";
  return (
    <div className="space-y-10">
      <section className="aa-card">
        <div className="grid grid-cols-1 lg:grid-cols-[500px_1fr] gap-8 items-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-700 bg-black/60 shadow-2xl">
            <iframe 
              src="/test-avatar.html" 
              className="w-full h-full border-0 rounded-2xl"
              title="AI Avatar"
              allow="microphone; camera; autoplay; encrypted-media; fullscreen; display-capture"
            />
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">Meet Your AI Avatar Clone</h1>
              <p className="text-lg text-neutral-300 leading-relaxed">A lifelike AI avatar that speaks, expresses, and shares memories just like you would — creating an immersive connection across generations.</p>
            </div>
            
            <div className="rounded-xl border border-neutral-700 bg-gradient-to-r from-neutral-900/50 to-neutral-800/50 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                <p className="text-neutral-200 text-lg italic">"Hello there, my dear descendant. I'm so happy you're here to meet me."</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="aa-btn px-6 py-3 text-base font-medium">Start Voice Chat</button>
              <button className="inline-flex items-center justify-center rounded-lg border border-neutral-600 bg-neutral-800/50 hover:bg-neutral-700/50 px-6 py-3 text-base font-medium transition-colors">Audio On</button>
              <button className="inline-flex items-center justify-center rounded-lg border border-neutral-600 bg-neutral-800/50 hover:bg-neutral-700/50 px-6 py-3 text-base font-medium transition-colors">Play Demo</button>
            </div>
          </div>
        </div>
      </section>

      <section className="aa-card">
        <h2 className="text-lg font-semibold">Start a Conversation</h2>
        <p className="text-neutral-500 mt-1">Choose a topic to begin your voice conversation with the AI avatar.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Tell me about your childhood","What was your biggest dream?","Share a family tradition","What advice do you have for me?","Describe your favorite memory","What made you happiest in life?"].map((t) => (
            <button key={t} className="rounded-md border border-neutral-800 bg-black/40 px-4 py-3 text-left hover:border-red-600">
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="aa-card text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-black/40 border border-neutral-800"></div>
          <h3 className="mt-3 font-medium">Lifelike Expressions</h3>
          <p className="text-sm text-neutral-500">Natural facial expressions and gestures that match your personality.</p>
        </div>
        <div className="aa-card text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-black/40 border border-neutral-800"></div>
          <h3 className="mt-3 font-medium">Voice Conversations</h3>
          <p className="text-sm text-neutral-500">Speak naturally and hear responses in your authentic voice.</p>
        </div>
        <div className="aa-card text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-black/40 border border-neutral-800"></div>
          <h3 className="mt-3 font-medium">Emotional Intelligence</h3>
          <p className="text-sm text-neutral-500">Responds with empathy and emotional understanding.</p>
        </div>
      </section>

      <section className="aa-card" id="get-started">
        <h2 className="text-lg font-semibold">Get Started</h2>
        <p className="text-neutral-500 mt-1">Complete your intake to begin. You can return later to your dashboard to review progress.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={intakeUrl} target="_blank" rel="noreferrer" className="aa-btn">Open intake form</a>
          <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md border px-4 py-2">Sign in to dashboard</Link>
        </div>
      </section>
    </div>
  );
}

