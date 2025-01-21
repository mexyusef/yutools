export const filesSchema = {
  id: { type: 'integer' as const, primaryKey: true, autoIncrement: true },
  conversation_id: { type: 'text' as const, required: true },
  name: { type: 'text' as const, required: true },
  type: { type: 'text' as const, required: true },
  size: { type: 'integer' as const, required: true },
  chunks: { type: 'json' as const, required: true }, // Store chunks as JSON
  created_at: { type: 'text' as const, required: true },
};