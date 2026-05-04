import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { serializeSession, SESSION_COOKIE } from '@/lib/auth';
import { apiError, ok } from '@/lib/apiResponse';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });

    if (!user) {
      return apiError(new Error('User not found. Please run the seed script.'));
    }

    const sessionData = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      projectId: user.projectId.toString(),
    };

    const serialized = serializeSession(sessionData);
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, serialized, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return ok(sessionData);
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
    return ok({ message: 'Logged out' });
}
