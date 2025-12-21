# Figma Clipboard Extractor

A sleek web tool to extract Figma clipboard metadata — enabling "Copy to Figma" functionality in your design system documentation.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)

## What it does

When you copy a component in Figma, the clipboard contains hidden metadata (`figmeta` and `figbuffer`) that encodes the full design. This tool extracts that data so you can:

- **Add "Copy to Figma" buttons** to your Storybook or design system docs
- **Enable designers** to paste production components directly into Figma
- **Bridge the gap** between code and design workflows

## How it works

1. **Copy** any component in Figma (⌘C / Ctrl+C)
2. **Extract** the clipboard data with one click
3. **Export** the `figmeta` and `figbuffer` as JSON

The extracted data can be embedded in your documentation. When users click "Copy to Figma", you reconstruct the HTML and copy it to their clipboard — Figma will recognize and paste the component.

## Features

- 🎨 **Dark/light mode** — follows system preference
- ⚡ **Instant extraction** — reads clipboard via browser API
- 🔍 **Component detection** — validates real Figma components vs primitives
- 📋 **One-click copy** — formatted JSON ready for your codebase
- ✨ **Smooth animations** — polished micro-interactions with Framer Motion

## Quick Start

```bash
# Clone the repository
git clone https://github.com/janostrowka/figma-clipboard-extractor.git
cd figma-clipboard-extractor

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint with ESLint |

## Tech Stack

- **React 19** — Latest React with automatic batching
- **TypeScript** — Full type safety
- **Vite 7** — Lightning-fast builds
- **Tailwind CSS 4** — Utility-first styling
- **Framer Motion** — Fluid animations
- **Radix UI** — Accessible component primitives
- **Vitest** — Fast unit testing

## Using the extracted data

Once you have the `figmeta` and `figbuffer`, you can create a "Copy to Figma" button like this:

```typescript
function copyToFigma(figmeta: string, figbuffer: string, displayName: string) {
  const html = `
    <meta charset="utf-8">
    <span data-metadata="<!--(figmeta)${figmeta}(/figmeta)-->"></span>
    <span data-buffer="<!--(figma)${figbuffer}(/figma)-->"></span>
    <span style="white-space:pre-wrap;">${displayName}</span>
  `;
  
  const blob = new Blob([html], { type: 'text/html' });
  navigator.clipboard.write([
    new ClipboardItem({ 'text/html': blob })
  ]);
}
```

## Browser Support

Requires a modern browser with [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) support:
- Chrome 66+
- Firefox 63+
- Safari 13.1+
- Edge 79+

## License

MIT © [Jan Ostrowka](https://jan.design)
