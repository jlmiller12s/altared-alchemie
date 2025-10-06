import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const hasClerk = !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

const isProtectedRoute = createRouteMatcher([
	'/dashboard(.*)',
	'/gallery(.*)',
	'/test-avatar(.*)',
]);

const isPublicRoute = createRouteMatcher([
	'/legacy-avatar(.*)',
	'/',
	'/api/heygen/(.*)',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/avatar-embed.html',
	'/test-avatar.html'
]);

export default hasClerk
	? clerkMiddleware((auth, req) => {
		if (isPublicRoute(req)) return;
		if (isProtectedRoute(req)) auth().protect();
	})
	: () => null;

export const config = {
	matcher: [
		"/((?!.+\\.[\\w]+$|_next).*)",
		"/",
		"/(api|trpc)(.*)",
	],
};

