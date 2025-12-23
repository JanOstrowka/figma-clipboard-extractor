import { useState, useRef, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedCodeBlockProps {
  code: string;
}

export function AnimatedCodeBlock({ code }: AnimatedCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [displayedCode, setDisplayedCode] = useState(code);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const codeRef = useRef(code);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle code changes with a simple fade
  useEffect(() => {
    if (code !== codeRef.current) {
      setIsTransitioning(true);
      
      // Fade out, swap content, fade in
      const timer = setTimeout(() => {
        setDisplayedCode(code);
        codeRef.current = code;
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [code]);

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 w-8 p-0 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 cursor-pointer relative active:scale-[0.97] backdrop-blur-sm"
        >
          <AnimatePresence initial={false}>
            <motion.span
              key={copied ? "check" : "copy"}
              initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center absolute inset-0"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </div>
      <pre className="bg-zinc-950 border border-border rounded-lg p-4 pr-12 overflow-x-auto w-full">
        <code 
          className="text-sm font-mono text-zinc-300 whitespace-pre"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transition: "opacity 0.15s ease-out",
          }}
        >
          {displayedCode}
        </code>
      </pre>
    </div>
  );
}

