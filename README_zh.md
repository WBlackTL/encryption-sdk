# 加密服务（Crypto Service）

[![License: LGPL v3](https://img.shields.io/badge/license-LGPL%20v3-blue.svg)](https://www.gnu.org/licenses/lgpl-3.0)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org)
[![GitHub last commit](https://img.shields.io/github/last-commit/WBlackTL/encryption-sdk)](https://github.com/WBlackTL/encryption-sdk)

一个轻量级 Node.js 加密解密服务，支持 AES-256-GCM 和 RSA-OAEP 两种加密算法，通过 HTTP 接口提供安全数据处理能力。

[English](https://github.com/WBlackTL/encryption-sdk/blob/master/README.md) | [简体中文](https://github.com/WBlackTL/encryption-sdk/blob/master/README_zh.md)

## 功能特性

- 支持 AES-256-GCM（对称加密）与 RSA-OAEP（非对称加密）两种算法
- 自动生成并安全管理密钥（存储于 `crypto_keys` 目录）
- 提供简洁的 HTTP API，支持数据加密、解密及服务状态查询
- 安全的密钥权限控制（目录 `0o700`，文件 `0o600`）
- 基于 GNU Lesser General Public License v3 (LGPL-3.0) 开源

## 前置要求

- Node.js ≥ 14.0.0
- npm ≥ 6.0.0

## 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/WBlackTL/encryption-sdk.git
cd encryption-sdk
```

2. 安装依赖（当前版本无外部依赖，此步骤可跳过）
```bash
npm install
```

## 使用方法

### 启动服务
```bash
node index.js
```
服务默认运行在 `http://localhost:4856`。

### API 接口说明

| 方法 | 路径 | 说明 | 请求体 | 响应示例 |
|------|------|------|--------|-----------|
| GET  | `/s` | 查询服务运行状态 | 无 | `{"status":"running","port":4856,"algorithms":["AES","RSA"]}` |
| GET  | `/a` | 查询服务信息（版权及版本） | 无 | `{"copyright":"©️ 2026 WBlackTL","version":"1.0.0"}` |
| POST | `/e` | 加密数据 | `{"algorithm":"AES/RSA", "data":"待加密数据"}` | `{"algorithm":"AES/RSA", "result":"<Base64 密文>"}` |
| POST | `/u` | 解密数据 | `{"algorithm":"AES/RSA", "data":"<Base64 密文>"}` | `{"algorithm":"AES/RSA", "result":"<解密结果或错误信息>"}` |

### 调用示例

#### AES 加密
```bash
curl -X POST http://localhost:4856/e \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "AES", "data": "你好，加密服务"}'
```

#### AES 解密（使用上一步返回的密文）
```bash
curl -X POST http://localhost:4856/u \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "AES", "data": "<上一步得到的 Base64 字符串>"}'
```

## 密钥管理

所有密钥均存放于 `crypto_keys/` 目录下：

- `aes.key` – AES-256 密钥（32 字节）
- `rsa_private.pem` – RSA 私钥（2048 位，PKCS#8 格式）
- `rsa_public.pem` – RSA 公钥（2048 位，SPKI 格式）

若密钥文件不存在，服务启动时会自动生成，无需手动创建。  
目录及文件均设置了严格的权限（目录 `700`，文件 `600`），仅文件所有者可读写。

## 开源协议

本项目依据 **GNU Lesser General Public License v3 (LGPL-3.0)** 发布。  
本软件为自由软件：你可以重新分发和/或修改它，但须遵守 LGPL-3.0 的条款。  
分发本软件是希望它能发挥作用，但 **不提供任何明示或默示的担保**，包括但不限于适销性或特定用途适用性的默示担保。  
更多细节请参阅 [LICENSE](LICENSE) 文件，或访问 <https://www.gnu.org/licenses/lgpl-3.0.html>。

## 版本信息

当前版本：**1.0.0**
