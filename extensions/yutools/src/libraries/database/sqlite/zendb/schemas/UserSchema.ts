export interface User {
  id?: number;
  username: string;
  password: string; // Encrypted password
}

// export const UserSchema = {
//   id: { type: 'integer', primaryKey: true, autoIncrement: true },
//   username: { type: 'text', required: true, unique: true },
//   password: { type: 'text', required: true },
// };
export const UserSchema = {
  id: { type: 'integer' as const, primaryKey: true, autoIncrement: true },
  username: { type: 'text' as const, required: true, unique: true },
  password: { type: 'text' as const, required: true },
};