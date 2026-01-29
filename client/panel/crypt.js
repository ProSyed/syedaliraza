/*

AES-GCM encryption: Modern symmetric encryption (fast & secure).
PBKDF2 key derivation: Converts a short password into a strong 256-bit key with salt + iterations.
Salt & IV: Randomly generated per encryption, prepended to ciphertext to allow proper decryption.
Base64 output: Makes encrypted string safe to store in text formats.

*/

function str2ab(str) {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

function ab2str(buf) {
    const decoder = new TextDecoder();
    return decoder.decode(buf);
}

async function getKey(password, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

async function encrypt(plaintext, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getKey(password, salt);
    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        str2ab(plaintext)
    );
    const combined = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.byteLength);
    combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);
    return btoa(String.fromCharCode(...combined));
}

async function decrypt(ciphertextB64, password) {
    const combined = Uint8Array.from(atob(ciphertextB64), c => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const data = combined.slice(28);
    const key = await getKey(password, salt);
    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        data
    );
    return ab2str(decrypted);
}