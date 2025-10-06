export async function getCurrentUser() {
  const email = process.env.AA_DEV_USER_EMAIL || '';
  if (!email) return null;
  return { id: 'dev_user_1', email, role: 'client' };
}

export async function requireUser() {
  const u = await getCurrentUser();
  if (!u) throw new Error('Auth required');
  return u;
}

/*
Replace with Clerk later by reading session and returning the user.
*/

