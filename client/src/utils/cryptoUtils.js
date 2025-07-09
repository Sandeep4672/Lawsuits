export async function generateRSAKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
    privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
  };
}

export async function importPublicKey(pem) {
  const binary = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    "spki",
    binary.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

export async function importPrivateKey(pem) {
  const binary = Uint8Array.from(atob(pem), c => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    "pkcs8",
    binary.buffer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );
}

export async function generateAESKey() {
  return await window.crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptWithAESKey(key, data) {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv))
  };
}

export async function decryptWithAESKey(key, { ciphertext, iv }) {
  const ct = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
  const plainBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    key,
    ct
  );
  return new TextDecoder().decode(plainBuffer);
}

export async function encryptAESKeyWithRSA(publicKey, aesKey) {
  const raw = await window.crypto.subtle.exportKey("raw", aesKey);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    raw
  );
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

export async function decryptAESKeyWithRSA(privateKey, encryptedKey) {
  const binary = Uint8Array.from(atob(encryptedKey), c => c.charCodeAt(0));
  const rawKey = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    binary
  );
  return await window.crypto.subtle.importKey(
    "raw",
    rawKey,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
}
