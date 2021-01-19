import * as crypto from 'crypto';
import * as util from 'util';

export function generatePrivatePublicPair(): Promise<{
  privateKey: string;
  publicKey: string;
}> {
  return util.promisify(crypto.generateKeyPair)('rsa', {
    modulusLength: 1024,
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

export function createKey(): Buffer {
  return crypto.randomBytes(32);
}

export function encryptSymmetrical(value: string, key: Buffer): string {
  const ivBuffer = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, ivBuffer);
  const encrypted = Buffer.concat([cipher.update(value), cipher.final()]);
  return `${encrypted.toString('base64')}@${ivBuffer.toString('base64')}`;
}

export function decryptSymmetrical(encrypted: string, key: Buffer): string {
  const [iv, encryptedData] = encrypted.split('@');
  const ivBuffer = Buffer.from(iv, 'base64');
  const encryptedBuffer = Buffer.from(encryptedData, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivBuffer);
  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return decrypted.toString();
}

export function encryptWithPublicKey(value: string, publicKey: string): string {
  return crypto.publicEncrypt(publicKey, Buffer.from(value)).toString('base64');
}

export function decryptWithPrivateKey(encrypted: string, privateKey: string): string {
  return crypto.privateDecrypt(privateKey, Buffer.from(encrypted, 'base64')).toString();
}
