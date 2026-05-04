import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import DashboardConfig from '@/models/DashboardConfig';
import { getSession } from '@/lib/auth';
import { requireProjectAdmin } from '@/lib/access';
import { apiError, ok } from '@/lib/apiResponse';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId') || session.projectId;

    // Enforce server-side authorization
    requireProjectAdmin(session, projectId);

    const config = await DashboardConfig.findOne({ projectId }).lean();
    if (!config) {
      throw new Error('Dashboard config not found for this project');
    }

    return ok(config);
  } catch (err) {
    return apiError(err);
  }
}
