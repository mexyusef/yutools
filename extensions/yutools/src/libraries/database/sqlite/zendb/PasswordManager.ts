import { ZenDB } from './core/Database';
import { encrypt, decrypt } from './encryption/encrypt';
import { Table } from './core/Table';
import { User, UserSchema } from './schemas/UserSchema';
import { PasswordEntry, PasswordSchema } from './schemas/PasswordSchema';

export class PasswordManager {
  private db: ZenDB;
  private users: Table<User>;
  private passwords: Table<PasswordEntry>;

  constructor(dbPath: string) {
    this.db = new ZenDB(dbPath);
    this.users = this.db.table<User>('users', UserSchema);
    this.passwords = this.db.table<PasswordEntry>('passwords', PasswordSchema);
  }

  /// USERS
  addUser(username: string, password: string): void {
    const encryptedPassword = encrypt(password);
    this.users.insert({ username, password: encryptedPassword });
  }

  verifyUser(username: string, password: string): boolean {
    const user = this.users.find().where({ username }).first();
    if (user) {
      const decryptedPassword = decrypt(user.toObject().password);
      return decryptedPassword === password;
    }
    return false;
  }

  /// PASSWORDS
  addEntry(username: string, password: string, site: string, notes?: string): void {
    const encryptedPassword = encrypt(password);
    this.passwords.insert({ username, password: encryptedPassword, site, notes });
  }

  getEntries(): PasswordEntry[] {
    return this.passwords.find().all().map(row => ({
      ...row.toObject(),
      password: decrypt(row.toObject().password), // Decrypt password for display
    }));
  }

  updateEntry(id: number, updates: Partial<PasswordEntry>): void {
    if (updates.password) {
      updates.password = encrypt(updates.password); // Encrypt updated password
    }
    this.passwords.update(id, updates);
  }

  deleteEntry(id: number): void {
    this.passwords.delete(id);
  }

  close(): void {
    this.db.close();
  }
}