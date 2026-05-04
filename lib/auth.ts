/**
 * Mock Auth — simulates login sessions via cookies.
 * In production replace with NextAuth or a real JWT solution.
 * The session user IS enforced server-side via the access layer.
 */
import { cookies } from 'next/headers';
import { SessionUser } from './access';

const SESSION_COOKIE = 'ai_platform_session';

/** Reads the mock session from the cookie store (server-side only) */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as SessionUser;
  } catch {
    return null;
  }
}

/** Serializes a user into a base64 cookie value */
export function serializeSession(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user)).toString('base64');
}

export { SESSION_COOKIE };
