export const snapshotsSchema = {
  id: { type: 'integer' as const, primaryKey: true, autoIncrement: true },
  conversation_id: { type: 'text' as const, required: true },
  summary: { type: 'text' as const, required: true },
  range_start: { type: 'integer' as const, required: true },
  range_end: { type: 'integer' as const, required: true },
  created_at: { type: 'text' as const, required: true },
};