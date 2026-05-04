import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Message from '@/models/Message';
import Conversation from '@/models/Conversation';
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

    const conversation = await Conversation.findById(id).lean();
    if (!conversation) throw new Error('Conversation not found');

    requireProjectMember(session, conversation.projectId.toString());

    const messages = await Message.find({ conversationId: id })
      .sort({ createdAt: 1 })
      .lean();

    return ok(messages);
  } catch (err) {
    return apiError(err);
  }
}
