import { motion } from "framer-motion";

// Base skeleton for code blocks
function CodeBlockSkeletonBase({ lineCount }: { lineCount: number }) {
  // Generate lines with varying widths
  const lines = Array.from({ length: lineCount }, (_, i) => ({
    width: `${Math.floor(Math.random() * 30) + 65}%`, // Random width between 65-95%
    delay: i * 0.03,
  }));

  return (
    <div className="relative">
      {/* Copy button skeleton */}
      <div className="absolute right-2 top-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="h-8 w-20 bg-muted rounded animate-pulse"
        />
      </div>
      
      {/* Code block container */}
      <div className="bg-zinc-950 border border-border rounded-lg p-4 pr-16 overflow-x-auto w-full">
        <div className="space-y-2.5">
          {lines.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.2, 
                delay: line.delay,
                ease: "easeOut" 
              }}
              className="h-3.5 bg-zinc-800 rounded animate-pulse"
              style={{ width: line.width }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton for Test tab - 4-5 rows (card structure)
export function TestTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        {/* Title skeleton */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="h-5 w-48 bg-muted rounded animate-pulse mb-2"
        />
        
        {/* Description skeleton - 2 lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="space-y-2 mb-4"
        >
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </motion.div>

        {/* Button skeleton */}
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="h-10 w-44 bg-muted rounded animate-pulse"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
            className="h-4 w-40 bg-muted rounded animate-pulse"
          />
        </div>
      </div>

      {/* Component name skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="h-4 w-56 bg-muted rounded animate-pulse"
      />
    </div>
  );
}

// Skeleton for Raw tab - 1 row (just raw HTML)
export function RawTabSkeleton() {
  return <CodeBlockSkeletonBase lineCount={1} />;
}

// Skeleton for Figma tab - 5 rows (JSON with figmeta, figbuffer, displayName)
export function FigmaTabSkeleton() {
  return <CodeBlockSkeletonBase lineCount={5} />;
}

// Skeleton for HTML tab - 1 row (single line HTML string)
export function HtmlTabSkeleton() {
  return <CodeBlockSkeletonBase lineCount={1} />;
}

// Skeleton for Storybook tab - 7 rows (parameters object with nested figma object)
export function StorybookTabSkeleton() {
  return <CodeBlockSkeletonBase lineCount={7} />;
}
