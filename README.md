# Figma Clipboard Extractor

A web tool to extract Figma clipboard metadata — enabling "Copy to Figma" functionality in your design system documentation.

## The problem

Design systems live across multiple places: docs, Figma, code. The documentation is usually the most complete reference, but designers still have to hunt through Figma libraries to find components.

## What this does

Adds a "Copy to Figma" button to your design system website. Designers can grab ready-made Figma components directly from the docs instead of digging through library files.

When you copy a component in Figma, the clipboard contains hidden metadata (`figmeta` and `figbuffer`) that encodes the full design. This tool extracts that data so you can embed it in your documentation.

## Why it's useful

- Designers actually use the docs when components are one click away
- Creates natural pressure to keep the website complete and current
- Bridges the gap between code and design workflows

## How it works

1. **Copy** any component in Figma (⌘C / Ctrl+C)
2. **Extract** the clipboard data with this tool
3. **Add** the snippet to your docs site

## Using the extracted data

Once you have the `figmeta` and `figbuffer`, create a "Copy to Figma" button like this:

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

## Credits

Concept and design by [Jan Ostrówka](https://github.com/JanOstrowka) @ n8n

Implementation based on clipboard research by [dgtlntv](https://github.com/dgtlntv/figma-copy-button-test)

## License

MIT
