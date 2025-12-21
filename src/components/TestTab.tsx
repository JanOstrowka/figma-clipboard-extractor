import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import type { FigmaClipboardData } from "@/lib/clipboard";

interface TestTabProps {
  data: FigmaClipboardData;
}

export function TestTab({ data }: TestTabProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyToFigma = async () => {
    if (!data.figmeta || !data.figbuffer) return;

    const html = `<meta charset="utf-8"><span data-metadata="<!--(figmeta)${data.figmeta}(/figmeta)-->"></span><span data-buffer="<!--(figma)${data.figbuffer}(/figma)-->"></span><span style="white-space:pre-wrap;">${data.displayName || "Component"}</span>`;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([data.displayName || "Component"], {
            type: "text/plain",
          }),
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const buttonText = copied ? "Copied!" : "Copy to Clipboard";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <h4 className="font-medium mb-2">Verify your extraction</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Click the button below to copy the extracted component to your
          clipboard, then paste it into Figma to confirm everything works.
        </p>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleCopyToFigma}
            disabled={!data.figmeta || !data.figbuffer}
            className="gap-2 relative active:scale-[0.97]"
          >
            <AnimatePresence initial={false}>
              <motion.span
                key={copied ? "check" : "copy"}
                initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
                animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-2 absolute inset-0 justify-center"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {buttonText}
              </motion.span>
            </AnimatePresence>
            {/* Invisible placeholder to maintain button size */}
            <span className="flex items-center gap-2 opacity-0 pointer-events-none">
              <Copy className="h-4 w-4" />
              {buttonText}
            </span>
          </Button>

          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Then paste in Figma (⌘V)
          </span>
        </div>
      </div>
    </div>
  );
}
