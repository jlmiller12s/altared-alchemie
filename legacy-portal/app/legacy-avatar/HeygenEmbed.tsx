"use client";

import { useEffect, useRef } from "react";

type HeygenEmbedProps = {
	url: string; // Full HeyGen embed URL with share params
	targetSelector?: string; // CSS selector to move the widget into (fills container)
};

/**
 * Mounts the provided HeyGen embed snippet, then moves the created widget
 * into the preview container so it fills the card on the page.
 */
export default function HeygenEmbed({ url, targetSelector = "#heygen-preview-slot" }: HeygenEmbedProps) {
	const hostRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!hostRef.current) return;

		const host = new URL(url).origin;
		const clientWidth = document.body.clientWidth;

		// Create wrapper and contents (ported from HeyGen snippet)
		const wrapDiv = document.createElement("div");
		wrapDiv.id = "heygen-streaming-embed";
		const container = document.createElement("div");
		container.id = "heygen-streaming-container";
		const stylesheet = document.createElement("style");
		const styleCss = `
  #heygen-streaming-embed {
    z-index: 9999;
    position: fixed;
    left: 40px;
    bottom: 40px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 2px solid #fff;
    box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
    transition: all linear 0.1s;
    overflow: hidden;

    opacity: 0;
    visibility: hidden;
  }
  #heygen-streaming-embed.show {
    opacity: 1;
    visibility: visible;
  }
  #heygen-streaming-embed.expand {
    ${clientWidth < 540 ? "height: 266px; width: 96%; left: 50%; transform: translateX(-50%);" : "height: 366px; width: calc(366px * 16 / 9);"}
    border: 0;
    border-radius: 8px;
  }
  #heygen-streaming-container {
    width: 100%;
    height: 100%;
  }
  #heygen-streaming-container iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
    `;
		stylesheet.innerHTML = styleCss;

		const iframe = document.createElement("iframe");
		iframe.allowFullscreen = false;
		iframe.title = "Streaming Embed";
		iframe.role = "dialog";
		iframe.allow = "microphone; camera; autoplay; encrypted-media; fullscreen; display-capture";
		iframe.src = url;

		let visible = false;
		let initial = false;
		const onMessage = (e: MessageEvent) => {
			if (e.origin !== host || !e.data || (e as any).data?.type !== "streaming-embed") return;
			const action = (e as any).data?.action as string | undefined;
			if (action === "init") {
				initial = true;
				wrapDiv.classList.toggle("show", initial);
			} else if (action === "show") {
				visible = true;
				wrapDiv.classList.toggle("expand", visible);
			} else if (action === "hide") {
				visible = false;
				wrapDiv.classList.toggle("expand", visible);
			}
		};
		window.addEventListener("message", onMessage);

		container.appendChild(iframe);
		wrapDiv.appendChild(stylesheet);
		wrapDiv.appendChild(container);
		document.body.appendChild(wrapDiv);

		// After the script runs, move the generated floating widget into our target
		// preview container and override its styles to fill the box.
		const tryMountIntoTarget = () => {
			const wrap = document.getElementById("heygen-streaming-embed");
			const target = document.querySelector(targetSelector) as HTMLElement | null;
			if (!wrap || !target) return false;

			// Move into the target container
			target.appendChild(wrap);
			// Ensure it becomes visible and expanded
			wrap.classList.add("show", "expand");
			// Override positioning to fit container
			Object.assign((wrap as HTMLElement).style, {
				position: "absolute",
				inset: "0px",
				left: "0px",
				bottom: "0px",
				width: "100%",
				height: "100%",
				borderRadius: "12px",
				border: "0",
				boxShadow: "none",
				transform: "none",
			});
			return true;
		};

		// Try immediately, then use observer as fallback
		setTimeout(() => {
			if (!tryMountIntoTarget()) {
				const observer = new MutationObserver(() => {
					if (tryMountIntoTarget()) {
						observer.disconnect();
					}
				});
				observer.observe(document.body, { childList: true, subtree: true });
				// Clean up observer after 5 seconds if still running
				setTimeout(() => observer.disconnect(), 5000);
			}
		}, 100);

		return () => {
			// Cleanup: remove floating widget container if present
			const existing = document.getElementById("heygen-streaming-embed");
			if (existing && existing.parentElement) {
				existing.parentElement.removeChild(existing);
			}
			window.removeEventListener("message", onMessage);
		};
	}, [url, targetSelector]);

	return <div ref={hostRef} className="w-full h-full" />;
}


