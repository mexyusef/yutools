export interface PasswordEntry {
  id?: number;
  username: string;
  password: string; // Encrypted password
  site: string; // Site/URL
  notes?: string; // Optional notes
}

export const PasswordSchema = {
  id: { type: 'integer' as const, primaryKey: true, autoIncrement: true },
  username: { type: 'text' as const, required: true },
  password: { type: 'text' as const, required: true },
  site: { type: 'text' as const, required: true },
  notes: { type: 'text' as const, required: false },
};