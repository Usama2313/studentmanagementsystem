// server/cryptoUtils.js
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Derive or format 32-byte (256-bit) encryption key
const RAW_KEY = process.env.AES_ENCRYPTION_KEY || 'e83b4b91f5a9e27609d949be88a2e411b9319e7f864cf4c9657099712abdc381';
const AES_KEY = crypto.createHash('sha256').update(RAW_KEY).digest(); // Always 32 bytes

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes recommended for GCM

/**
 * Encrypt plaintext using AES-256-GCM
 * Output format: iv:authTag:ciphertext (hex)
 */
export function encryptAES(text) {
  if (text === null || text === undefined) return text;
  const stringVal = typeof text === 'object' ? JSON.stringify(text) : String(text);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, AES_KEY, iv);

  let encrypted = cipher.update(stringVal, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt AES-256-GCM payload
 */
export function decryptAES(encryptedPayload) {
  if (!encryptedPayload || typeof encryptedPayload !== 'string' || !encryptedPayload.includes(':')) {
    return encryptedPayload;
  }

  try {
    const parts = encryptedPayload.split(':');
    if (parts.length !== 3) return encryptedPayload;

    const [ivHex, authTagHex, cipherHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, AES_KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(cipherHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Try parse JSON if object
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (err) {
    console.error('Decryption failed, returning sanitized fallback');
    return null;
  }
}
