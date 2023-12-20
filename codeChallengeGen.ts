import { createHash } from 'node:crypto';

function generateRandomString(length: number): string {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function generateCodeChallenge(codeVerifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = createHash('sha256')
    .update(data)
    .digest('base64url')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  // const digest = await window.crypto.subtle.digest('SHA-256', data);

  return digest;
}

const codeVerifier = '8kVhrmNKxsCpvAEcXBHdgeXOU3Dh8UGIfh80bkKiLi7M4NVmN9Vzwt64wqkCzImoyaDomnQj3ruwPC5ojpNiZEqnoKMc4EOtPz0ZCFI4fO2eJ6Xqua0giKJ3sjcjx8Mj'
const codeChallenge = generateCodeChallenge(codeVerifier);
console.log(`code_verifier: ${codeVerifier}\ncode_challenge: ${codeChallenge}`);
