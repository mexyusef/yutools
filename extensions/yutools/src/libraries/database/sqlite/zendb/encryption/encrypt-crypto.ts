import { logger } from '@/yubantu/extension/logger';
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

// # Generate a 32-byte key and 16-byte IV
// node -e "console.log(crypto.randomBytes(32).toString('hex'))"
// node -e "console.log(crypto.randomBytes(16).toString('hex'))"
// export ENCRYPTION_KEY="your-32-byte-key"
// export ENCRYPTION_IV="your-16-byte-iv"
// const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
// const iv = Buffer.from(process.env.ENCRYPTION_IV, 'hex');

// const generateUrlSafeBase64Key = () => {
//   return crypto.randomBytes(32).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// };
// export function decrypt(encryptedText: string): string {
//   const [ivHex, encrypted] = encryptedText.split(':');
//   const iv = Buffer.from(ivHex, 'hex');
//   const decipher = crypto.createDecipheriv(algorithm, key, iv);
//   let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }

// const key = crypto.randomBytes(32); // Generate a random key
// const iv = crypto.randomBytes(16); // Generate a random initialization vector
// Generate or load a fixed key and IV (for demonstration purposes)
// In a real-world scenario, store these securely (e.g., in environment variables or a secure config file)
// const key = Buffer.from('my-secure-key-32-bytes-long-123456', 'utf8'); // Replace with a secure key
const key = Buffer.from('my-secure-key-32-bytes-long-123456', 'utf8').slice(0, 32);
// const iv = Buffer.from('my-secure-iv-16-bytes', 'utf8'); // Replace with a secure IV
const iv = Buffer.from('my-secure-iv-16-bytes', 'utf8').slice(0, 16);
logger.log('Key:', key.toString('hex'));
logger.log('IV:', iv.toString('hex'));

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  try {
    const [ivHex, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}