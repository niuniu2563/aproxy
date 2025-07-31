# AProxy - AList 代理服务

基于 Cloudflare Pages 的 AList 文件代理服务，提供安全的文件下载和状态监控。

## 📁 项目结构

```
alistproxy/
├── index.html          # 前端监控页面
├── functions/           # Pages Functions
│   ├── api.js          # 主要代理 API
│   └── status.js       # 状态检查接口
├── package.json        # 项目配置
├── wrangler.toml       # Cloudflare 配置
└── README.md          # 说明文档
```

## 🚀 功能特性

- ✅ 文件下载代理服务
- ✅ HMAC-SHA256 签名验证
- ✅ CORS 跨域支持
- ✅ 实时状态监控页面
- ✅ 服务健康检查
- ✅ 响应式前端界面

## 📋 部署步骤

### 1. 配置参数

编辑 `functions/api.js` 文件，替换以下配置：

```javascript
const ADDRESS = "你的AList服务地址";        // 例如: https://your-alist.com
const TOKEN = "你的AList访问令牌";           // AList 管理面板中获取
const WORKER_ADDRESS = "你的Worker地址";     // 可选，留空即可
```

### 2. 本地开发

```bash
npm install
npm run dev
```

### 3. 部署到 Cloudflare Pages

**方式一：Git 部署（推荐）**
1. 将代码推送到 GitHub
2. 在 Cloudflare Dashboard 中连接仓库
3. 自动部署

**方式二：Wrangler CLI**
```bash
npm run deploy
```

## 🌐 使用方法

### 访问监控页面
```
https://your-domain.pages.dev/
```

### API 调用
```
https://your-domain.pages.dev/api/path/to/file?sign=签名
```

### 状态检查
```
https://your-domain.pages.dev/status
```

## 🔧 配置说明

| 配置项 | 说明 | 示例 |
|--------|------|------|
| ADDRESS | AList 服务器地址 | `https://files.example.com` |
| TOKEN | AList API 令牌 | `alist-1234567890abcdef` |
| WORKER_ADDRESS | Worker 地址（可选） | 留空或填写实际地址 |

## 📊 监控功能

前端页面提供以下监控信息：
- 服务实时状态
- 请求统计数据
- 成功率监控
- 响应时间统计
- 连接测试功能

## 🔒 安全特性

- HMAC-SHA256 签名验证
- 时间戳防重放攻击
- CORS 安全策略
- 敏感信息保护