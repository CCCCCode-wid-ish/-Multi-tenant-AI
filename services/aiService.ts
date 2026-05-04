/**
 * AI Service — ALL Gemini/LLM calls live here.
 * No component or route handler may call the AI directly.
 */
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { IStepLog } from '@/models/Message';

const FALLBACK_RESPONSE =
  "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again in a moment.";

const RATE_LIMIT_RESPONSE =
  "I'm receiving too many requests at the moment. Please wait a few seconds and try again.";

const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

// Initialise client lazily so the module can be imported without a key
let genAI: GoogleGenerativeAI | null = null;
function getClient() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key.includes('your_gemini_api_key')) {
      throw new Error('Please set your GEMINI_API_KEY in .env.local. Get one at https://aistudio.google.com/app/apikey');
    }
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface AIResponse {
  content: string;
  stepLogs: IStepLog[];
}

/**
 * Build integration context snippet to inject into the system prompt.
 * This simulates live Shopify / CRM data without a real integration.
 */
export function buildIntegrationContext(shopify: boolean, crm: boolean): string {
  const parts: string[] = [];

  if (shopify) {
    parts.push(`
[SHOPIFY INTEGRATION — live mock data]
Recent Orders:
- #1001 | Customer: Alice Brown | Total: $129.99 | Status: Shipped
- #1002 | Customer: Bob Smith  | Total: $249.00 | Status: Processing
- #1003 | Customer: Carol White | Total: $59.95 | Status: Delivered

Top Products:
- "ProMax Widget X1" | SKU: PMX-001 | Stock: 42 | Price: $49.99
- "EcoFlask 500ml"   | SKU: ECO-500 | Stock: 8  | Price: $24.99 ⚠ Low stock
- "NanoGadget Plus"  | SKU: NGP-002 | Stock: 0  | Price: $99.99 ✗ Out of stock

Use this data to answer any order tracking or product availability questions.`);
  }

  if (crm) {
    parts.push(`
[CRM INTEGRATION — live mock data]
Recent Leads:
- Lead #L-201 | Name: David Lee    | Company: TechCorp  | Stage: Qualified | Value: $5,000
- Lead #L-202 | Name: Emma Johnson | Company: RetailCo  | Stage: Proposal  | Value: $12,000
- Lead #L-203 | Name: Frank Wu     | Company: StartupXY | Stage: New       | Value: $3,500

Recent Customers:
- Cust #C-101 | Name: Grace Kim     | Company: BigRetail | LTV: $45,200 | Status: Active
- Cust #C-102 | Name: Henry Patel   | Company: SMB Corp  | LTV: $8,700  | Status: At-risk

Use this data to answer questions about leads, pipeline, and customer health.`);
  }

  return parts.join('\n');
}

/**
 * Core chat completion — sends history + new user message to Gemini.
 */
export async function generateChatResponse(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string,
  shopify: boolean,
  crm: boolean
): Promise<AIResponse> {
  const stepLogs: IStepLog[] = [];

  const addStep = (label: string, detail?: string) => {
    stepLogs.push({ label, detail, timestamp: new Date() });
  };

  addStep('Thinking', 'Processing your request…');

  const integrationCtx = buildIntegrationContext(shopify, crm);

  const fullSystemPrompt = [
    systemPrompt || 'You are a helpful AI assistant.',
    integrationCtx,
  ]
    .filter(Boolean)
    .join('\n\n');

  if (shopify || crm) {
    addStep('Fetching data', `Loading ${[shopify && 'Shopify', crm && 'CRM'].filter(Boolean).join(' & ')} context`);
  }

  addStep('Analyzing', 'Building response…');

  try {
    const client = getClient();
    const model = client.getGenerativeModel({
      model: DEFAULT_GEMINI_MODEL,
      systemInstruction: fullSystemPrompt,
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
    });

    const chat = model.startChat({ history });

    const result = await chat.sendMessage(userMessage);
    const text = result.response.text();

    addStep('Done', 'Response generated');
    return { content: text, stepLogs };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    // Rate limit detection - multiple patterns to catch rate limiting
    const isRateLimit = 
      msg.includes('429') || 
      msg.toLowerCase().includes('quota') ||
      msg.toLowerCase().includes('too many requests') ||
      msg.toLowerCase().includes('rate limit') ||
      msg.includes('503'); // Service Unavailable often indicates rate limiting

    if (isRateLimit) {
      addStep('Rate limited', 'API quota exceeded. Will retry automatically in the UI.');
      return { content: RATE_LIMIT_RESPONSE, stepLogs };
    }

    addStep('Error', msg);
    return { content: FALLBACK_RESPONSE, stepLogs };
  }
}
