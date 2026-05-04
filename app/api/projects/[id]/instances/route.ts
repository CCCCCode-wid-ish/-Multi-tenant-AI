import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import ProductInstance from '@/models/ProductInstance';
import { getSession } from '@/lib/auth';
import { requireProjectMember } from '@/lib/access';
import { apiError, ok } from '@/lib/apiResponse';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getSession();
    const { id } = await params;

    requireProjectMember(session, id);

    const instances = await ProductInstance.find({ projectId: id }).lean();
    return ok(instances);
  } catch (err) {
    return apiError(err);
  }
}
