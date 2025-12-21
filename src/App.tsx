import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "./components/Header";
import { StepCard } from "./components/StepCard";
import { ExtractButton } from "./components/ExtractButton";
import { OutputTabs } from "./components/OutputTabs";
import { AboutDialog } from "./components/AboutDialog";
import { useSystemTheme } from "./hooks/useTheme";
import {
  extractFigmaClipboard,
  type FigmaClipboardData,
} from "./lib/clipboard";
import { detectFigmaComponent } from "./utils/detectFigmaComponent";

const MIN_LOADING_TIME = 300;

function App() {
  useSystemTheme();

  const [clipboardData, setClipboardData] = useState<FigmaClipboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);

  const handleExtract = async () => {
    setIsLoading(true);
    setError(null);
    setWarning(null);
    setSuccess(false);

    const startTime = Date.now();

    try {
      const data = await extractFigmaClipboard();

      // Ensure minimum loading time for perceived feedback
      const elapsed = Date.now() - startTime;
      if (elapsed < MIN_LOADING_TIME) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_LOADING_TIME - elapsed)
        );
      }

      // Check for empty clipboard
      if (!data.rawHtml) {
        setError("Your clipboard is empty. Copy a component in Figma first.");
        setClipboardData(null);
        return;
      }

      // Check for valid Figma data
      if (!data.isValidFigmaData) {
        setError(
          "This doesn't look like Figma data. Make sure you copied a component from Figma."
        );
        setClipboardData(null); // Don't show test/export sections for invalid data
        return;
      }

      // Detect if this is a real component
      const detection = detectFigmaComponent(data.displayName);
      
      // Show warning if there's any concern (never block extraction)
      if (detection.message) {
        setWarning(detection.message);
      }

      setClipboardData(data);
      setSuccess(true);

      // Reset success state after animation
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to read clipboard"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Custom ease-out curve for smooth animations (recommended by Emil Kowalski)
  const customEaseOut = [0.16, 1, 0.3, 1];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Reduced stagger for faster sequence
        delayChildren: 0.8, // Start cards after header
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // 400ms as requested
        ease: customEaseOut,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12 min-h-screen">
        <motion.div
          initial={{ 
            opacity: 0,
          }}
          animate={{ 
            opacity: 1,
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
          }}
        >
          <Header onAboutClick={() => setAboutOpen(true)} />
        </motion.div>

        <motion.div
          className="space-y-6 mt-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onAnimationComplete={() => setInitialAnimationComplete(true)}
        >
          <motion.div 
            variants={itemVariants}
            onMouseEnter={() => initialAnimationComplete && setHoveredCard(1)}
            onMouseLeave={() => initialAnimationComplete && setHoveredCard(null)}
            animate={{
              opacity: !initialAnimationComplete || hoveredCard === null || hoveredCard === 1 ? 1 : 0.5,
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepCard 
              step={1} 
              title="Copy a component in Figma"
              description="Use ⌘C (Mac) or Ctrl+C (Windows) to copy any component"
            />
          </motion.div>

          <motion.div 
            variants={itemVariants}
            onMouseEnter={() => initialAnimationComplete && setHoveredCard(2)}
            onMouseLeave={() => initialAnimationComplete && setHoveredCard(null)}
            animate={{
              opacity: !initialAnimationComplete || hoveredCard === null || hoveredCard === 2 ? 1 : 0.5,
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <StepCard 
              step={2} 
              title="Extract the clipboard data"
              description="Reads your clipboard and extracts the Figma metadata."
            >
              <ExtractButton
                onClick={handleExtract}
                isLoading={isLoading}
                error={error}
                warning={warning}
                success={success}
              />
            </StepCard>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            onMouseEnter={() => initialAnimationComplete && setHoveredCard(3)}
            onMouseLeave={() => initialAnimationComplete && setHoveredCard(null)}
            animate={{
              opacity: !initialAnimationComplete || hoveredCard === null || hoveredCard === 3 ? 1 : 0.5,
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <OutputTabs data={clipboardData} />
          </motion.div>
        </motion.div>

        <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
      </div>
    </div>
  );
}

export default App;
