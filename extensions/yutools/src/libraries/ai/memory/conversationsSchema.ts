export const conversationsSchema = {
  id: { type: 'text' as const, primaryKey: true },
  name: { type: 'text' as const, required: true },
  created_at: { type: 'text' as const, required: true },
  updated_at: { type: 'text' as const, required: true },
};