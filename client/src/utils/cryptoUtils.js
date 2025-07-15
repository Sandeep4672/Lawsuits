export async function encryptWithPassword(privateKeyBase64, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Derive AES key from password
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  const encoded = new TextEncoder().encode(privateKeyBase64);
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded
  );

  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
    salt: btoa(String.fromCharCode(...salt)),
    iv: btoa(String.fromCharCode(...iv))
  };
}


export async function decryptWithPassword(base64Encrypted, password, base64Salt, base64IV) {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const salt = Uint8Array.from(atob(base64Salt), c => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(base64IV), c => c.charCodeAt(0));
  const encryptedBytes = Uint8Array.from(atob(base64Encrypted), c => c.charCodeAt(0));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encryptedBytes
  );

  return dec.decode(decryptedBuffer);
}





function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToArrayBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}



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
    publicKey: arrayBufferToBase64(publicKey),
    privateKey: arrayBufferToBase64(privateKey),
  };
}


export async function importPublicKey(pemBase64) {
  return await window.crypto.subtle.importKey(
    "spki",
    base64ToArrayBuffer(pemBase64),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

export async function importPrivateKey(pemBase64) {
  return await window.crypto.subtle.importKey(
    "pkcs8",
    base64ToArrayBuffer(pemBase64),
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
  console.log(key);
  console.log(data);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv.buffer),
  };
}

export async function decryptWithAESKey(key, { ciphertext, iv }) {
  console.log(key,ciphertext,iv);
  const ctBuffer = base64ToArrayBuffer(ciphertext);
  const ivBuffer = base64ToArrayBuffer(iv);
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
    key,
    ctBuffer
  );
  return new TextDecoder().decode(decrypted);
}


export async function encryptAESKeyWithRSA(publicKey, aesKey) {
  console.log("In encryptAesKeyWithRsa",publicKey,aesKey);
  const raw = await window.crypto.subtle.exportKey("raw", aesKey);
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    raw
  );
  return arrayBufferToBase64(encrypted);
}

export async function decryptAESKeyWithRSA(privateKey, encryptedKeyBase64) {
  try {
    console.log("Encrypted AES key (base64):", encryptedKeyBase64);
    console.log("Encrypted AES key length:", encryptedKeyBase64.length);
    
    const encryptedBuffer = base64ToArrayBuffer(encryptedKeyBase64);
    console.log("Decrypted buffer length:", encryptedBuffer.byteLength);
    
    const decryptedRaw = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedBuffer
    );
    console.log("Decrypted raw key length:", decryptedRaw.byteLength);
    
    return await window.crypto.subtle.importKey(
      "raw",
      decryptedRaw,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  } catch (err) {
    console.error("Detailed decryption error:", {
      error: err,
      privateKey,
      encryptedKeyBase64
    });
    throw new Error("AES key decryption failed");
  }
}
