import * as crypto from 'crypto';
import * as util from 'util';
import base64url from 'base64url';

export function generatePrivatePublicPair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  return util.promisify(crypto.generateKeyPair)('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });
}

export function createKey(): string {
  return base64url.encode(crypto.randomBytes(32));
}

export function encryptSymmetrical(value: string, key: string): string {
  const ivBuffer = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', base64url.toBuffer(key), ivBuffer);
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
  return `${base64url.encode(encrypted)}.${base64url.encode(ivBuffer)}`;
}

export function decryptSymmetrical(encrypted: string, key: string): string {
  const [encryptedData, iv] = encrypted.split('.');
  const ivBuffer = base64url.toBuffer(iv);
  const encryptedBuffer = base64url.toBuffer(encryptedData);
  const decipher = crypto.createDecipheriv('aes-256-cbc', base64url.toBuffer(key), ivBuffer);
  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted.toString();
}

export function encryptWithPublicKey(value: string, publicKey: string): string {
  return base64url.encode(crypto.publicEncrypt(publicKey, Buffer.from(value)));
}

export function decryptWithPrivateKey(encrypted: string, privateKey: string): string {
  return crypto.privateDecrypt(privateKey, base64url.toBuffer(encrypted)).toString();
}
