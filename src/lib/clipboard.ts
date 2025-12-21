export interface FigmaClipboardData {
  rawHtml: string;
  figmeta: string | null;
  figbuffer: string | null;
  displayName: string | null;
  isValidFigmaData: boolean;
}

export async function extractFigmaClipboard(): Promise<FigmaClipboardData> {
  try {
    const clipboardItems = await navigator.clipboard.read();

    for (const item of clipboardItems) {
      if (item.types.includes("text/html")) {
        const blob = await item.getType("text/html");
        const html = await blob.text();

        // Extract figmeta and figbuffer from the HTML
        const metaMatch = html.match(/\(figmeta\)([^(]+)\(\/figmeta\)/);
        const bufferMatch = html.match(/\(figma\)([^(]+)\(\/figma\)/);
        const nameMatch = html.match(
          /<span[^>]*style="white-space:pre-wrap;"[^>]*>([^<]+)<\/span>/
        );

        return {
          rawHtml: html,
          figmeta: metaMatch?.[1] || null,
          figbuffer: bufferMatch?.[1] || null,
          displayName: nameMatch?.[1] || null,
          isValidFigmaData: !!(metaMatch && bufferMatch),
        };
      }
    }

    return {
      rawHtml: "",
      figmeta: null,
      figbuffer: null,
      displayName: null,
      isValidFigmaData: false,
    };
  } catch (error) {
    console.error("Clipboard read failed:", error);
    throw new Error(
      "Could not read clipboard. Make sure you have copied a Figma component."
    );
  }
}
