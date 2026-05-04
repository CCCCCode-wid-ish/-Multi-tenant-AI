import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import ProductInstance from '@/models/ProductInstance';
import Integration from '@/models/Integration';
import { getSession } from '@/lib/auth';
import { requireProjectMember } from '@/lib/access';
import { apiError, ok } from '@/lib/apiResponse';
import { generateChatResponse, ChatMessage } from '@/services/aiService';
import { z } from 'zod';

const chatSchema = z.object({
  conversationId: z.string(),
  message: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');

    const body = await req.json();
    const { conversationId, message } = chatSchema.parse(body);

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error('Conversation not found');

    requireProjectMember(session, conversation.projectId.toString());

    // 1. Get Product Instance configuration
    const productInstance = await ProductInstance.findById(conversation.productInstanceId);
    if (!productInstance) throw new Error('Product instance not found');

    // 2. Get Integration flags
    const integrations = await Integration.findOne({ projectId: conversation.projectId });
    const shopifyEnabled = integrations?.shopify || false;
    const crmEnabled = integrations?.crm || false;

    // 3. Store user message
    const userMsg = await Message.create({
      conversationId,
      role: 'user',
      content: message,
    });

    // 4. Get history for AI
    const historyDocs = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    
    // Map history for Gemini (reverse because we want oldest first for history)
    const history: ChatMessage[] = historyDocs.reverse().map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // 5. Generate AI response
    const aiResponse = await generateChatResponse(
      productInstance.systemPrompt || '',
      history.slice(0, -1), // History without the latest message which we'll send as the prompt
      message,
      shopifyEnabled,
      crmEnabled
    );

    // 6. Store assistant message
    const assistantMsg = await Message.create({
      conversationId,
      role: 'assistant',
      content: aiResponse.content,
      stepLogs: aiResponse.stepLogs,
    });

    // 7. Update conversation timestamp
    await Conversation.findByIdAndUpdate(conversationId, { updatedAt: new Date() });

    return ok({
        userMessage: userMsg,
        assistantMessage: assistantMsg
    });
  } catch (err) {
    return apiError(err);
  }
}
