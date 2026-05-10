# Crypto Service

[![License: LGPL v3](https://img.shields.io/badge/license-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![GitHub last commit](https://img.shields.io/github/last-commit/WBlackTL/encryption-sdk)](https://github.com/WBlackTL/encryption-sdk)

A lightweight Node.js encryption/decryption service supporting AES-256-GCM and RSA-OAEP algorithms, offering HTTP APIs for secure data processing.

[简体中文](https://github.com/WBlackTL/encryption-sdk/blob/master/README_zh.md) | [English](https://github.com/WBlackTL/encryption-sdk/blob/master/README.md)

## Features

- Supports both AES-256-GCM (symmetric) and RSA-OAEP (asymmetric) encryption
- Automatic key generation and secure storage (keys are stored under `crypto_keys/`)
- Simple HTTP API for encryption, decryption, and service status checks
- Strict file permission control (directory `0o700`, key files `0o600`)
- Licensed under GNU Lesser General Public License v3 (LGPL-3.0)

## Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0

## Installation

1. Clone the repository
```bash
git clone https://github.com/WBlackTL/encryption-sdk.git
cd encryption-sdk
```

2. Install dependencies (currently no external dependencies; this step can be skipped)
```bash
npm install
```

## Usage

### Start the service
```bash
node index.js
```
The service will run on `http://localhost:4856` by default.

### API Endpoints

| Method | Path | Description | Request Body | Response |
|--------|------|-------------|--------------|----------|
| GET    | `/s` | Query service status | None | `{"status":"running","port":4856,"algorithms":["AES","RSA"]}` |
| GET    | `/a` | Query service info (copyright & version) | None | `{"copyright":"©️ 2026 WBlackTL","version":"1.0.0"}` |
| POST   | `/e` | Encrypt data | `{"algorithm":"AES/RSA", "data":"plaintext"}` | `{"algorithm":"AES/RSA", "result":"<base64 ciphertext>"}` |
| POST   | `/u` | Decrypt data | `{"algorithm":"AES/RSA", "data":"<base64 ciphertext>"}` | `{"algorithm":"AES/RSA", "result":"<decrypted text or error message>"}` |

### Example requests

#### AES encryption
```bash
curl -X POST http://localhost:4856/e \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "AES", "data": "Hello, Crypto Service"}'
```

#### AES decryption (using the returned Base64 string)
```bash
curl -X POST http://localhost:4856/u \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "AES", "data": "<base64 string from the previous step>"}'
```

## Key Management

All keys are stored in the `crypto_keys/` directory:

- `aes.key` – AES-256 key (32 bytes)
- `rsa_private.pem` – RSA private key (2048 bits, PKCS#8 format)
- `rsa_public.pem` – RSA public key (2048 bits, SPKI format)

If keys do not exist, they will be generated automatically on service start — no manual creation is needed.  
Both the directory and key files are protected with strict permissions (`700` for the directory, `600` for the files), allowing only the file owner to read and write.

## License

This project is licensed under the **GNU Lesser General Public License v3 (LGPL-3.0)**.  
This is free software: you can redistribute and/or modify it under the terms of the LGPL-3.0.  
It is distributed in the hope that it will be useful, but **WITHOUT ANY WARRANTY**; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See the [LICENSE](LICENSE) file for details, or visit <https://www.gnu.org/licenses/lgpl-3.0.html>.

## Version

Current version: **1.0.0**
## Version
1.0.0
