# Extract.fun - Web Image Extractor

[中文](./README.md) | English

A modern web application that helps you extract images from any website using Cloudflare's browser rendering capabilities. Built with Remix and deployed on Cloudflare Pages.

🌐 **Live Site**: [https://extract.fun](https://extract.fun)

## Features

- 🖼️ Extract images from any website
- 🚀 Fast and efficient using Cloudflare's edge network
- 🌐 Browser-based rendering for accurate results
- 💻 Modern UI built with React and TailwindCSS
- 🔒 Secure and reliable

## Tech Stack

- [Remix](https://remix.run/) - Full stack web framework
- [Cloudflare Pages](https://pages.cloudflare.com/) - Hosting and deployment
- [Cloudflare Browser Rendering](https://developers.cloudflare.com/browser-rendering/) - Browser rendering
- [React](https://reactjs.org/) - UI framework
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Development

### Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm package manager
- Cloudflare account
- Wrangler CLI

### Local Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/extract
cd extract
```

2. Install dependencies
```bash
pnpm install
```

3. Copy wrangler example config
```bash
cp wrangler.example.toml wrangler.toml
```

4. Start the development server
```bash
pnpm dev
```

### Deployment

Deploy to Cloudflare Pages:

```bash
pnpm run deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

---

Made with ❤️ using Remix and Cloudflare
