import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Project from '@/models/Project';
import ProductInstance from '@/models/ProductInstance';
import { getSession } from '@/lib/auth';
import { requireProjectMember } from '@/lib/access';
import { apiError, ok } from '@/lib/apiResponse';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();

    // In a multi-tenant system, we usually filter by the user's project
    // But for a listing, we might just return the user's current project
    if (!session) {
      // If no session, return all projects for the login screen (simplified)
      const projects = await Project.find({}).lean();
      return ok(projects);
    }

    const projects = await Project.find({ _id: session.projectId }).lean();
    return ok(projects);
  } catch (err) {
    return apiError(err);
  }
}
