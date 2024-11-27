# Extract.fun - 网站图片提取工具

中文 | [English](./README.en.md)

一个使用 Cloudflare 浏览器渲染功能从任何网站提取图片的现代 Web 应用。基于 Remix 构建并部署在 Cloudflare Pages 上。

🌐 **在线地址**: [https://extract.fun](https://extract.fun)

## 功能特点

- 🖼️ 从任意网站提取图片
- 🚀 使用 Cloudflare 边缘网络，快速高效
- 🌐 基于浏览器渲染，确保准确的结果
- 💻 使用 React 和 TailwindCSS 构建的现代界面
- 🔒 安全可靠

## 技术栈

- [Remix](https://remix.run/) - 全栈 Web 框架
- [Cloudflare Pages](https://pages.cloudflare.com/) - 托管和部署
- [Cloudflare Browser Rendering](https://developers.cloudflare.com/browser-rendering/) - 浏览器渲染
- [React](https://reactjs.org/) - UI 框架
- [TailwindCSS](https://tailwindcss.com/) - 样式设计
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

## 开发指南

### 环境要求

- Node.js（推荐最新的 LTS 版本）
- pnpm 包管理器
- Cloudflare 账号
- Wrangler CLI

### 本地设置

1. 克隆仓库
```bash
git clone https://github.com/yourusername/extract
cd extract
```

2. 安装依赖
```bash
pnpm install
```

3. 复制 wrangler 配置示例
```bash
cp wrangler.example.toml wrangler.toml
```

4. 启动开发服务器
```bash
pnpm dev
```

### 部署

部署到 Cloudflare Pages：

```bash
pnpm run deploy
```

## 贡献

欢迎提交 Pull Request 来帮助改进这个项目！

## 许可证

MIT 许可证 - 您可以自由使用这个项目。

---

使用 Remix 和 Cloudflare 用 ❤️ 构建
