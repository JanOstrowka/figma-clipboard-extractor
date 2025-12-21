import { ClipboardPaste, Loader2, AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ExtractButtonProps {
  onClick: () => void;
  isLoading: boolean;
  error: string | null;
  warning: string | null;
  success: boolean;
}

export function ExtractButton({
  onClick,
  isLoading,
  error,
  warning,
  success,
}: ExtractButtonProps) {
  return (
    <div className="space-y-3">
      <Button
        variant="secondary"
        size="lg"
        onClick={onClick}
        disabled={isLoading}
        className={`w-full sm:w-auto transition-all relative ${isLoading ? 'cursor-wait' : 'cursor-pointer active:scale-[0.97]'}`}
      >
        <AnimatePresence initial={false}>
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center absolute inset-0 justify-center"
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Reading clipboard...
            </motion.span>
          ) : success ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center absolute inset-0 justify-center"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Extracted!
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              exit={{ opacity: 0, filter: "blur(4px)", scale: 0.9 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center absolute inset-0 justify-center"
            >
              <ClipboardPaste className="mr-2 h-4 w-4" />
              Extract Clipboard Data
            </motion.span>
          )}
        </AnimatePresence>
        {/* Invisible placeholder to maintain button size */}
        <span className="flex items-center opacity-0 pointer-events-none">
          <ClipboardPaste className="mr-2 h-4 w-4" />
          Extract Clipboard Data
        </span>
      </Button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 text-sm text-destructive overflow-hidden"
          >
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
        {warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-500 overflow-hidden"
          >
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{warning}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
