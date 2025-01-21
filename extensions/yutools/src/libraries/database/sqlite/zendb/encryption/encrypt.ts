// import { Secret, Token } from 'fernet';
// import crypto from 'crypto';
// Activating extension 'mexyusef.yutools' failed: Secret must be 32 url-safe base64-encoded bytes..
export { encrypt, decrypt } from "./encrypt-crypto";
// // Generate a new secret key
// const secret = new Secret('my-secret-key'); // Replace with your secret key
// Generate a 32-byte random key and encode it in base64
// const generateSecretKey = () => {
//   return crypto.randomBytes(32).toString('base64');
// };

// const urlSafeSecret = 'Y29tZXNsYWxmcGsyZ0FkOW1ocHZrZkRnZGxfVHR3cg'.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// const secret = new Secret(urlSafeSecret);
// const secret = new Secret(
//   '3bYvL3sR7fX01X9m21p8u98y6p5j4w2w0o2t1r0q3e='
// );

// export function encrypt(text: string): string {
//   const token = new Token({
//     secret,
//     time: Date.now(),
//     ttl: 0, // Time-to-live (0 means no expiration)
//   });
//   return token.encode(text);
// }

// export function decrypt(encryptedText: string): string {
//   const token = new Token({
//     secret,
//     token: encryptedText,
//     ttl: 0, // Time-to-live (0 means no expiration)
//   });
//   return token.decode();
// }

// const encrypted = encrypt('Hello, World!');
// console.log('Encrypted:', encrypted);

// const decrypted = decrypt(encrypted);
// console.log('Decrypted:', decrypted);