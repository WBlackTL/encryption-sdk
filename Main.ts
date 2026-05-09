"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright ©️2026 WBlackTL. All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const http = __importStar(require("http"));
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Global constants
const PORT = 4856;
const KEY_DIR = 'crypto_keys';
const VERSION = '1.0.0';
// Key manager
class CryptoKeyManager {
    constructor() {
        this.aesKey = Buffer.alloc(0);
        this.rsaPrivKey = '';
        this.rsaPubKey = '';
    }
}
let keyManager;
// Main entry
function main() {
    if (!fs.existsSync(KEY_DIR)) {
        fs.mkdirSync(KEY_DIR, { mode: 0o700 });
    }
    keyManager = initCryptoKeys();
    const server = http.createServer(requestListener);
    server.listen(PORT, () => {
        console.log(`Crypto Service running on http://localhost:${PORT}`);
    });
}
// Request router
async function requestListener(req, res) {
    const url = req.url;
    const method = req.method;
    if (method === 'GET' && url === '/s') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'running', port: PORT, algorithms: ['AES', 'RSA'] }));
        return;
    }
    if (method === 'GET' && url === '/a') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ copyright: '©️ 2026 WBlackTL', version: VERSION }));
        return;
    }
    if (method === 'POST' && url === '/e') {
        handleEncrypt(req, res);
        return;
    }
    if (method === 'POST' && url === '/u') {
        handleDecrypt(req, res);
        return;
    }
    res.writeHead(404);
    res.end('Not found');
}
// Read JSON body
function readBody(req) {
    return new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk) => (data += chunk));
        req.on('end', () => {
            try {
                resolve(JSON.parse(data));
            }
            catch {
                resolve({});
            }
        });
    });
}
// Encrypt handler
async function handleEncrypt(req, res) {
    const body = await readBody(req);
    const { algorithm, data } = body;
    if (!algorithm || !data) {
        res.writeHead(400);
        res.end('Error: Invalid request');
        return;
    }
    let result = '';
    try {
        switch (algorithm.toUpperCase()) {
            case 'AES':
                result = aesEncrypt(data, keyManager.aesKey);
                break;
            case 'RSA':
                result = rsaEncrypt(data, keyManager.rsaPubKey);
                break;
            default:
                throw new Error('Unsupported algorithm');
        }
    }
    catch (err) {
        res.writeHead(500);
        res.end(`Error: ${err.message}`);
        return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ algorithm, result }));
}
// Decrypt handler
async function handleDecrypt(req, res) {
    const body = await readBody(req);
    const { algorithm, data } = body;
    if (!algorithm || !data) {
        res.writeHead(400);
        res.end('Error: Invalid request');
        return;
    }
    let result = '';
    try {
        switch (algorithm.toUpperCase()) {
            case 'AES':
                result = aesDecrypt(data, keyManager.aesKey);
                break;
            case 'RSA':
                result = rsaDecrypt(data, keyManager.rsaPrivKey);
                break;
            default:
                throw new Error('Unsupported algorithm');
        }
    }
    catch (err) {
        result = `Error: ${err.message}`;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ algorithm, result }));
}
// Key initialization
function initCryptoKeys() {
    const km = new CryptoKeyManager();
    km.aesKey = loadOrGenKey(path.join(KEY_DIR, 'aes.key'), 32);
    const rsa = loadOrGenRSAKeys();
    km.rsaPrivKey = rsa.priv;
    km.rsaPubKey = rsa.pub;
    return km;
}
function loadOrGenKey(filePath, size) {
    if (fs.existsSync(filePath)) {
        const buf = fs.readFileSync(filePath);
        if (buf.length >= size)
            return buf.slice(0, size);
    }
    const key = crypto.randomBytes(size);
    fs.writeFileSync(filePath, key, { mode: 0o600 });
    return key;
}
// AES-256-GCM
function aesEncrypt(plaintext, key) {
    const nonce = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce);
    let enc = cipher.update(plaintext, 'utf8');
    enc = Buffer.concat([enc, cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([nonce, enc, tag]).toString('base64');
}
function aesDecrypt(cipherText, key) {
    try {
        const raw = Buffer.from(cipherText, 'base64');
        const nonce = raw.slice(0, 12);
        const tag = raw.slice(-16);
        const ciphertext = raw.slice(12, -16);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
        decipher.setAuthTag(tag);
        let plain = decipher.update(ciphertext);
        plain = Buffer.concat([plain, decipher.final()]);
        return plain.toString('utf8');
    }
    catch {
        return 'Error: AES decrypt failed';
    }
}
// RSA OAEP
function rsaEncrypt(plaintext, pubKey) {
    const encrypted = crypto.publicEncrypt({ key: pubKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(plaintext, 'utf8'));
    return encrypted.toString('base64');
}
function rsaDecrypt(cipherText, privKey) {
    try {
        const decrypted = crypto.privateDecrypt({ key: privKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(cipherText, 'base64'));
        return decrypted.toString('utf8');
    }
    catch {
        return 'Error: RSA decrypt failed';
    }
}
// RSA key pair
function loadOrGenRSAKeys() {
    const privPath = path.join(KEY_DIR, 'rsa_private.pem');
    const pubPath = path.join(KEY_DIR, 'rsa_public.pem');
    if (fs.existsSync(privPath)) {
        return {
            priv: fs.readFileSync(privPath, 'utf8'),
            pub: fs.readFileSync(pubPath, 'utf8'),
        };
    }
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
    const pub = publicKey.export({ type: 'spki', format: 'pem' });
    const priv = privateKey.export({ type: 'pkcs8', format: 'pem' });
    fs.writeFileSync(privPath, priv, { mode: 0o600 });
    fs.writeFileSync(pubPath, pub, { mode: 0o600 });
    return { priv, pub };
}
main();