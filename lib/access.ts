/**
 * Access Layer — pure authorization functions.
 * No DB calls here; these operate on already-resolved session/user objects.
 * Keep this layer thin, composable, and side-effect free.
 */

import { UserRole } from '@/models/User';

export interface SessionUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  projectId: string;
}

/** Check if the user has admin role */
export function isAdmin(user: SessionUser): boolean {
  return user.role === 'admin';
}

/** Check if user belongs to a specific project */
export function belongsToProject(user: SessionUser, projectId: string): boolean {
  return user.projectId === projectId;
}

/** Require admin — throws if not admin */
export function requireAdmin(user: SessionUser | null): asserts user is SessionUser {
  if (!user) throw new UnauthorizedError('Not authenticated');
  if (!isAdmin(user)) throw new ForbiddenError('Admin access required');
}

/** Require membership in a project — throws if not a member */
export function requireProjectMember(
  user: SessionUser | null,
  projectId: string
): asserts user is SessionUser {
  if (!user) throw new UnauthorizedError('Not authenticated');
  if (!belongsToProject(user, projectId)) {
    throw new ForbiddenError('Access denied: not a member of this project');
  }
}

/** Require admin within a project */
export function requireProjectAdmin(
  user: SessionUser | null,
  projectId: string
): asserts user is SessionUser {
  requireProjectMember(user, projectId);
  if (!isAdmin(user!)) throw new ForbiddenError('Project admin access required');
}

// ---------------------------------------------------------------------------
// Custom Error classes
// ---------------------------------------------------------------------------

export class UnauthorizedError extends Error {
  statusCode = 401;
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}
