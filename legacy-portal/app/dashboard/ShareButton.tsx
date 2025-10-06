"use client";

export function ShareButton({ url }: { url: string }) {
  const handleShare = () => {
    const fullUrl = url.startsWith('http') ? url : new URL(url, window.location.origin).toString();
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('Avatar URL copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy URL');
    });
  };

  return (
    <button className="aa-btn" onClick={handleShare}>
      Share Avatar
    </button>
  );
}
