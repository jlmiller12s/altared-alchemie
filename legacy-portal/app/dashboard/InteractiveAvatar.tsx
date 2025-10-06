"use client";
import { useEffect, useRef, useState } from "react";

export function InteractiveAvatar({ avatarId, apiKey }: { avatarId?: string; apiKey: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionData, setSessionData] = useState<any>(null);

  const startSession = async () => {
    if (!apiKey) {
      alert("HeyGen API key not configured");
      return;
    }
    
    setIsLoading(true);
    try {
      // Create a new streaming session
      const response = await fetch('/api/heygen/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarId: avatarId || 'default' })
      });
      
      if (!response.ok) throw new Error('Failed to create session');
      
      const session = await response.json();
      setSessionData(session);
      setIsConnected(true);
      
      // Initialize WebRTC connection (simplified)
      if (videoRef.current && session.sdp) {
        // In a real implementation, you'd set up WebRTC here
        // For now, we'll show a placeholder
        videoRef.current.src = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
      }
    } catch (error) {
      console.error('Failed to start avatar session:', error);
      alert('Failed to start interactive session');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !sessionData) return;
    
    try {
      await fetch('/api/heygen/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: sessionData.sessionId, 
          text: message 
        })
      });
      setMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <video 
          ref={videoRef}
          className="w-full rounded-lg bg-black"
          width="640"
          height="480"
          autoPlay
          playsInline
          muted={false}
        />
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
            <button 
              onClick={startSession}
              disabled={isLoading}
              className="aa-btn"
            >
              {isLoading ? "Starting..." : "Start Interactive Avatar"}
            </button>
          </div>
        )}
      </div>
      
      {isConnected && (
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message for your avatar to speak..."
            className="flex-1 rounded border border-neutral-800 bg-black/40 px-3 py-2"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage} className="aa-btn">
            Send
          </button>
        </div>
      )}
    </div>
  );
}
