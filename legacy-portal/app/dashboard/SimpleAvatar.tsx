"use client";

export function SimpleAvatar() {
  return (
    <div className="space-y-4">
      <div className="bg-neutral-800 rounded-lg p-4 text-center">
        <p className="text-sm text-neutral-400 mb-3">Interactive Avatar will appear here</p>
        <div className="bg-black rounded aspect-video flex items-center justify-center">
          <p className="text-neutral-500">
            To enable: Create an Interactive Avatar in your HeyGen account → Get avatar ID → Add to .env
          </p>
        </div>
      </div>
      
      <div className="text-sm text-neutral-400">
        <p><strong>Next steps:</strong></p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Record avatar footage in HeyGen (15s listening + 90s talking + 15s idling)</li>
          <li>Wait for processing (2-3 days)</li>
          <li>Get your avatar ID from HeyGen dashboard</li>
          <li>Add HEYGEN_AVATAR_ID=your_id to .env file</li>
          <li>Interactive avatar will work here automatically</li>
        </ol>
      </div>
    </div>
  );
}
