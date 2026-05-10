# Crypto Service
A lightweight Node.js encryption/decryption service that supports AES-256-GCM and RSA-OAEP algorithms, providing HTTP APIs for secure data processing.
[简体中文](https://github.com/WBlackTL/encryption-sdk/blob/master/README_zh.md) [English](https://github.com/WBlackTL/encryption-sdk/blob/master/README.md)

## Features
- Supports two encryption algorithms: AES-256-GCM and RSA-OAEP
- Automatic generation and loading of encryption keys (stored in `crypto_keys` directory)
- Simple HTTP API interface for encryption, decryption, and service status query
- Complies with the GNU Lesser General Public License v3 (LGPLv3)
- Secure key storage with restricted file permissions (0o700 for directory, 0o600 for key files)

## Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation
1. Clone the repository
```bash
git clone https://github.com/your-username/crypto-service.git
cd crypto-service
```

2. Install dependencies (if any, currently no external dependencies required)
```bash
npm install
```

## Usage
1. Start the service
```bash
node index.js
```
The service will run on `http://localhost:4856` by default.

2. API Endpoints
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | /s | Query service status | None | `{"status": "running", "port": 4856, "algorithms": ["AES", "RSA"]}` |
| GET | /a | Query service information (copyright & version) | None | `{"copyright": "©️ 2026 WBlackTL", "version": "1.0.0"}` |
| POST | /e | Encrypt data | `{"algorithm": "AES/RSA", "data": "plaintext"}` | `{"algorithm": "AES/RSA", "result": "encrypted-base64-string"}` |
| POST | /u | Decrypt data | `{"algorithm": "AES/RSA", "data": "encrypted-base64-string"}` | `{"algorithm": "AES/RSA", "result": "decrypted-plaintext/error-message"}` |

### Example Requests
#### Encrypt with AES
```bash
curl -X POST http://localhost:4856/e \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "AES", "data": "Hello Crypto Service"}'
```

#### Decrypt with AES
```bash
curl -X POST http://localhost:4856/u \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "AES", "data": "encrypted-base64-result-from-above"}'
```

## Key Management
- All encryption keys are stored in the `crypto_keys` directory:
  - `aes.key`: AES-256 key (32 bytes)
  - `rsa_private.pem`: RSA private key (2048 bits, PKCS8 format)
  - `rsa_public.pem`: RSA public key (2048 bits, SPKI format)
- Keys are automatically generated if they do not exist
- Key files have restricted permissions to ensure security (only the owner can read/write)

## License
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

## Version
1.0.0
