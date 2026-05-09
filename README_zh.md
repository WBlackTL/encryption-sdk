# 加密服务（Crypto Service）
一个轻量级 Node.js 加密解密服务，支持 AES-256-GCM 和 RSA-OAEP 两种加密算法，提供 HTTP 接口用于安全数据处理。

## 功能特性
- 支持两种加密算法：AES-256-GCM（对称加密）和 RSA-OAEP（非对称加密）
- 自动生成和加载加密密钥（密钥存储在 `crypto_keys` 目录下）
- 简洁的 HTTP API 接口，支持加密、解密及服务状态查询
- 遵循 GNU  Lesser General Public License v3（LGPLv3）开源协议
- 安全的密钥存储，采用严格的文件权限控制（目录 0o700，密钥文件 0o600）

## 前置要求
- Node.js（v14.0.0 及以上版本）
- npm（v6.0.0 及以上版本）

## 安装步骤
1. 克隆代码仓库
```bash
git clone https://github.com/your-username/crypto-service.git
cd crypto-service
```

2. 安装依赖（当前无外部依赖，可直接跳过）
```bash
npm install
```

## 使用方法
1. 启动服务
```bash
node index.js
```
服务默认运行在 `http://localhost:4856`。

2. API 接口说明
| 请求方法 | 接口地址 | 接口描述 | 请求体 | 响应结果 |
|----------|----------|----------|--------|----------|
| GET | /s | 查询服务运行状态 | 无 | `{"status": "running", "port": 4856, "algorithms": ["AES", "RSA"]}` |
| GET | /a | 查询服务信息（版权及版本） | 无 | `{"copyright": "©️ 2026 WBlackTL", "version": "1.0.0"}` |
| POST | /e | 对数据进行加密 | `{"algorithm": "AES/RSA", "data": "明文数据"}` | `{"algorithm": "AES/RSA", "result": "加密后的base64字符串"}` |
| POST | /u | 对数据进行解密 | `{"algorithm": "AES/RSA", "data": "加密后的base64字符串"}` | `{"algorithm": "AES/RSA", "result": "解密后的明文/错误信息"}` |

### 接口调用示例
#### AES 加密请求
```bash
curl -X POST http://localhost:4856/e \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "AES", "data": "你好，加密服务"}'
```

#### AES 解密请求
```bash
curl -X POST http://localhost:4856/u \
  -H "Content-Type: application/json" \
  -d '{"algorithm": "AES", "data": "上述加密得到的base64结果"}'
```

## 密钥管理
- 所有加密密钥均存储在 `crypto_keys` 目录下：
  - `aes.key`: AES-256 密钥（32字节）
  - `rsa_private.pem`: RSA 私钥（2048位，PKCS8 格式）
  - `rsa_public.pem`: RSA 公钥（2048位，SPKI 格式）
- 密钥不存在时会自动生成，无需手动创建
- 密钥文件采用严格的权限控制，仅文件所有者可进行读写操作，保障密钥安全

## 开源协议
本程序是自由软件：你可以重新分发它和/或修改它
根据由自由软件基金会发布的 GNU 次要通用公共许可证版本 3（LGPLv3）的条款，
或者任何更新的版本。

本程序的发布是希望它能有用，
但 WITHOUT ANY WARRANTY（无任何担保）；甚至没有隐含的担保
MERCHANTABILITY（适销性）或 FITNESS FOR A PARTICULAR PURPOSE（适用于特定用途）。
详见 GNU 次要通用公共许可证了解更多细节。

你应该已经收到了与本程序一起的 GNU 次要通用公共许可证的副本。
如果没有，请参见 <https://www.gnu.org/licenses/>。

## 版本信息
1.0.0
