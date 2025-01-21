export const messagesSchema = {
  id: { type: 'integer' as const, primaryKey: true, autoIncrement: true },
  conversation_id: { type: 'text' as const, required: true },
  role: { type: 'text' as const, required: true },
  content: { type: 'text' as const, required: true },
  timestamp: { type: 'text' as const, required: true },
};