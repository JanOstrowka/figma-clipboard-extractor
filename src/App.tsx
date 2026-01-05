import { useState, useEffect, useCallback, useRef, lazy, Suspense } from "react";
import { Header } from "./components/Header";
import { StepCard } from "./components/StepCard";
import { ExtractButton } from "./components/ExtractButton";
import { OutputTabs } from "./components/OutputTabs";
import { useSystemTheme } from "./hooks/useTheme";
import {
  extractFigmaClipboard,
  type FigmaClipboardData,
} from "./lib/clipboard";

// Lazy load non-critical components
const AboutDialog = lazy(() => 
  import("./components/AboutDialog").then(m => ({ default: m.AboutDialog }))
);

const MIN_LOADING_TIME = 300;

function App() {
  useSystemTheme();
  const isExtractingRef = useRef(false);

  const [clipboardData, setClipboardData] = useState<FigmaClipboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [autoHighlightCard3, setAutoHighlightCard3] = useState(false);

  const handleExtract = useCallback(async () => {
    // Prevent multiple simultaneous extractions
    if (isExtractingRef.current) return;
    isExtractingRef.current = true;

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

      setClipboardData(data);
      setSuccess(true);
      setAutoHighlightCard3(true);

      // Reset success state after animation
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to read clipboard"
      );
    } finally {
      setIsLoading(false);
      isExtractingRef.current = false;
    }
  }, []);

  // Global keyboard shortcut: Cmd+V (Mac) or Ctrl+V (Windows) triggers extraction
  useEffect(() => {
    const handlePaste = (e: KeyboardEvent) => {
      // Check for Cmd+V (Mac) or Ctrl+V (Windows)
      const isPasteShortcut = (e.metaKey || e.ctrlKey) && e.key === "v";
      
      if (!isPasteShortcut) return;

      // Don't intercept paste if user is in an input, textarea, or contenteditable
      const activeElement = document.activeElement;
      const isEditableElement =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        (activeElement instanceof HTMLElement && activeElement.isContentEditable);

      if (isEditableElement) return;

      // Prevent default paste behavior and trigger extraction
      e.preventDefault();
      handleExtract();
    };

    window.addEventListener("keydown", handlePaste);
    return () => window.removeEventListener("keydown", handlePaste);
  }, [handleExtract]);

  // Calculate opacity for hover effect (only after mount, no initial animation)
  const getCardOpacity = (cardNumber: number) => {
    // If no card is hovered and card3 isn't auto-highlighted, all cards are full opacity
    if (hoveredCard === null && !autoHighlightCard3) return 1;
    // If this card is hovered, full opacity
    if (hoveredCard === cardNumber) return 1;
    // Special case: card 3 auto-highlighted after extraction
    if (autoHighlightCard3 && cardNumber === 3) return 1;
    // Otherwise, dimmed
    return 0.5;
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-12 min-h-screen">
        <Header onAboutClick={() => setAboutOpen(true)} />

        <div className="space-y-6 mt-10">
          <div 
            className="transition-opacity duration-200"
            style={{ opacity: getCardOpacity(1) }}
            onMouseEnter={() => {
              setHoveredCard(1);
              setAutoHighlightCard3(false);
            }}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <StepCard 
              step={1} 
              title="Copy a component in Figma"
              description="Use ⌘C (Mac) or Ctrl+C (Windows) to copy any component"
            />
          </div>

          <div 
            className="transition-opacity duration-200"
            style={{ opacity: getCardOpacity(2) }}
            onMouseEnter={() => {
              setHoveredCard(2);
              setAutoHighlightCard3(false);
            }}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <StepCard 
              step={2} 
              title="Extract the clipboard data"
              description="Just press ⌘V (Mac) or Ctrl+V (Windows) to paste, or click the button below."
            >
              <ExtractButton
                onClick={handleExtract}
                isLoading={isLoading}
                error={error}
                warning={warning}
                success={success}
              />
            </StepCard>
          </div>

          <div 
            className="transition-opacity duration-200"
            style={{ opacity: getCardOpacity(3) }}
            onMouseEnter={() => {
              setHoveredCard(3);
              setAutoHighlightCard3(false);
            }}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <OutputTabs data={clipboardData} />
          </div>
        </div>

        <Suspense fallback={null}>
          {aboutOpen && (
            <AboutDialog open={aboutOpen} onOpenChange={setAboutOpen} />
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
