import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { getSession } from '@/lib/auth';
import { requireProjectMember } from '@/lib/access';
import { apiError, ok } from '@/lib/apiResponse';
import { z } from 'zod';

const createConversationSchema = z.object({
  projectId: z.string(),
  productInstanceId: z.string(),
  title: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    const productInstanceId = searchParams.get('productInstanceId');

    if (!projectId || !productInstanceId) {
      throw new Error('projectId and productInstanceId are required');
    }

    requireProjectMember(session, projectId);

    const conversations = await Conversation.find({
      projectId,
      productInstanceId,
      userId: session._id,
    }).sort({ updatedAt: -1 }).lean();

    return ok(conversations);
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const body = await req.json();
    const { projectId, productInstanceId, title } = createConversationSchema.parse(body);

    requireProjectMember(session, projectId);

    const conversation = await Conversation.create({
      projectId,
      productInstanceId,
      userId: session._id,
      title: title || 'New Conversation',
    });

    return ok(conversation);
  } catch (err) {
    return apiError(err);
  }
}
