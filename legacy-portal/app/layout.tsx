import { ClerkProvider, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import "./globals.css";

export const metadata = { title: "Legacy Portal" };

const hasClerk = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

function AuthArea() {
	if (!hasClerk) return <span className="text-neutral-500 text-xs">Demo Mode</span>;
	return (
		<>
			<SignedOut>
				<Link href="/sign-in" className="aa-link">Sign in</Link>
			</SignedOut>
			<SignedIn>
				<SignOutButton redirectUrl="/signed-out">
					<button className="aa-link">Sign out</button>
				</SignOutButton>
			</SignedIn>
		</>
	);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const content = (
		<html lang="en">
			<body>
				<header className="border-b border-neutral-800 bg-black/80 backdrop-blur">
					<div className="aa-container flex h-16 items-center justify-between">
						<Link href="http://localhost:5177/" className="flex items-center gap-2 glow-hover" aria-label="Altared Alchemie home">
							<img src="/logo.png" alt="Altared Alchemie" className="h-8 w-auto" />
						</Link>
						<nav className="flex items-center gap-6 text-sm">
							<Link href="/legacy-avatar" className="aa-link">Legacy Avatar</Link>
							<Link href="/dashboard" className="aa-link">Dashboard</Link>
							<Link href="/gallery" className="aa-link">Gallery</Link>
							<AuthArea />
						</nav>
					</div>
				</header>
				<main className="aa-container py-10">{children}</main>
			</body>
		</html>
	);
	return hasClerk ? <ClerkProvider>{content}</ClerkProvider> : content;
}

