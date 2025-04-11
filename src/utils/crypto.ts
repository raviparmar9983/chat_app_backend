import * as crypto from 'crypto';
import * as config from 'config';

const secret: string = config.get('CRYPTO.SECRET');

const padKey = (key: string) => {
  const keyBuffer = Buffer.from(key, 'utf-8');
  if (keyBuffer.length >= 32) {
    return keyBuffer.slice(0, 32);
  } else {
    const paddKey = Buffer.alloc(32);
    keyBuffer.copy(paddKey);
    return paddKey;
  }
};

export const encryptData = (data: any): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', padKey(secret), iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return `${iv.toString('hex')}:${encryptedData}`;
};

export const decryptData = (encryptedData: any): string => {
  const [ivHex, encryptedText] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createCipheriv('aes-256-gcm', padKey(secret), iv);
  let descyptCipher = decipher.update(encryptedText, 'hex', 'utf-8');
  descyptCipher += decipher.final('utf-8');
  return descyptCipher;
};
