import { useEffect, useState, useMemo, memo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCodeBlock } from "./AnimatedCodeBlock";
import { EmptyState } from "./EmptyState";
import { TestTab } from "./TestTab";
import { 
  TestTabSkeleton, 
  RawTabSkeleton, 
} from "./SkeletonLoader";
import type { FigmaClipboardData } from "@/lib/clipboard";
import {
  formatRawClipboard,
  formatFigmaPayload,
  formatHtmlPayload,
  formatStorybookParams,
} from "@/lib/formatters";

interface OutputTabsProps {
  data: FigmaClipboardData | null;
}

type TabValue = "test" | "raw" | "figma" | "html" | "storybook";
type CodeTabValue = "raw" | "figma" | "html" | "storybook";

// Memoized tab content components to prevent re-renders
const MemoizedTestTab = memo(TestTab);

// Check if a tab is a code tab
const isCodeTab = (tab: TabValue): tab is CodeTabValue => {
  return tab === "raw" || tab === "figma" || tab === "html" || tab === "storybook";
};

export function OutputTabs({ data }: OutputTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("test");
  const [dataKey, setDataKey] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const prevDataRef = useRef<FigmaClipboardData | null>(null);

  // Memoize formatted content to avoid recalculating on every render
  const formattedContent = useMemo(() => {
    if (!data) return null;
    return {
      raw: formatRawClipboard(data),
      figma: formatFigmaPayload(data),
      html: formatHtmlPayload(data),
      storybook: formatStorybookParams(data),
    };
  }, [data]);

  // Get the current code for the shared code block
  const currentCode = useMemo(() => {
    if (!formattedContent || !isCodeTab(activeTab)) return "";
    return formattedContent[activeTab];
  }, [formattedContent, activeTab]);

  // Trigger reload animation when data changes
  useEffect(() => {
    if (data && prevDataRef.current && data !== prevDataRef.current) {
      setIsReloading(true);
      const timer = setTimeout(() => {
        setDataKey((prev) => prev + 1);
        setIsReloading(false);
      }, 300);
      return () => clearTimeout(timer);
    } else if (data && !prevDataRef.current) {
      setDataKey((prev) => prev + 1);
    }
    prevDataRef.current = data;
  }, [data]);

  // Render skeleton for a tab
  const renderSkeleton = useCallback(() => {
    if (activeTab === "test") {
      return <TestTabSkeleton />;
    }
    return <RawTabSkeleton />;
  }, [activeTab]);

  return (
    <Card>
      <CardContent className="pt-0">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
            3
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="font-medium leading-none pt-1.5">Test & Export</h2>
            <p className="text-sm text-muted-foreground">
              Verify the extraction works or copy the data in your preferred format.
            </p>
          </div>
        </div>

        <Tabs 
          defaultValue="test" 
          className="w-full"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabValue)}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="figma">Figma</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="storybook">Storybook</TabsTrigger>
          </TabsList>

          <div className="pt-4">
            {!data ? (
              <EmptyState />
            ) : isReloading ? (
              renderSkeleton()
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === "test" ? (
                  <motion.div
                    key={`${dataKey}-test`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <MemoizedTestTab data={data} />
                  </motion.div>
                ) : (
                  <motion.div
                    key={`${dataKey}-code`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                  >
                    <AnimatedCodeBlock code={currentCode} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
