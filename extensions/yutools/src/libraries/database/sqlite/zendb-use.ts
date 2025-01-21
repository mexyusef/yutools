import { PasswordManager } from './zendb';

const passwordManager = new PasswordManager('vscode-passwords.sqlite');

// Add a new user
passwordManager.addUser('alice', 'password123');

// Verify a user
const isValid = passwordManager.verifyUser('alice', 'password123');
console.log(isValid ? 'Valid credentials' : 'Invalid credentials');

// Close the database
passwordManager.close();