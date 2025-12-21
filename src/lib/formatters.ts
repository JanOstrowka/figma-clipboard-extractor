import type { FigmaClipboardData } from "./clipboard";

// Tab 1: Raw Clipboard — just return the raw HTML as-is
export function formatRawClipboard(data: FigmaClipboardData): string {
  return data.rawHtml || "// No HTML content in clipboard";
}

// Tab 2: Figma — structured JSON with the extracted data
export function formatFigmaPayload(data: FigmaClipboardData): string {
  return JSON.stringify(
    {
      figmeta: data.figmeta,
      figbuffer: data.figbuffer,
      displayName: data.displayName,
    },
    null,
    2
  );
}

// Tab 3: HTML — the HTML string needed for ClipboardItem
export function formatHtmlPayload(data: FigmaClipboardData): string {
  if (!data.figmeta || !data.figbuffer) {
    return "// No valid Figma data found";
  }

  const html = `<meta charset="utf-8"><span data-metadata="<!--(figmeta)${data.figmeta}(/figmeta)-->"></span><span data-buffer="<!--(figma)${data.figbuffer}(/figma)-->"></span><span style="white-space:pre-wrap;">${data.displayName || "Component"}</span>`;

  return `const htmlPayload = \`${html}\`;`;
}

// Tab 4: Storybook — ready-to-paste story parameters
export function formatStorybookParams(data: FigmaClipboardData): string {
  if (!data.figmeta || !data.figbuffer) {
    return "// No valid Figma data found";
  }

  return `parameters: {
  figma: {
    name: '${data.displayName || "Component"}',
    figmeta: '${data.figmeta}',
    figbuffer: '${data.figbuffer}',
  },
},`;
}
