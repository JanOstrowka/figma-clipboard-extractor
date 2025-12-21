import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "./CodeBlock";
import { EmptyState } from "./EmptyState";
import { TestTab } from "./TestTab";
import { 
  TestTabSkeleton, 
  RawTabSkeleton, 
  FigmaTabSkeleton, 
  HtmlTabSkeleton, 
  StorybookTabSkeleton 
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

export function OutputTabs({ data }: OutputTabsProps) {
  const [activeTab, setActiveTab] = useState("test");
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  const [dataKey, setDataKey] = useState(0);
  const [isReloading, setIsReloading] = useState(false);
  const prevDataRef = useRef<FigmaClipboardData | null>(null);

  // Trigger reload animation when data changes
  useEffect(() => {
    if (data && prevDataRef.current && data !== prevDataRef.current) {
      // Data has changed, show loading state
      setIsReloading(true);
      
      // Show skeleton for 300ms before revealing new content
      const timer = setTimeout(() => {
        setDataKey((prev) => prev + 1);
        setIsReloading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else if (data && !prevDataRef.current) {
      // First time loading data, no skeleton needed
      setDataKey((prev) => prev + 1);
    }
    
    prevDataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (contentRef.current) {
      const updateHeight = () => {
        if (contentRef.current) {
          const newHeight = contentRef.current.scrollHeight;
          setHeight(newHeight);
        }
      };

      const resizeObserver = new ResizeObserver(() => {
        updateHeight();
      });

      resizeObserver.observe(contentRef.current);
      
      // Initial height measurement
      updateHeight();

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [activeTab, dataKey]);

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
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="raw">Raw</TabsTrigger>
            <TabsTrigger value="figma">Figma</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="storybook">Storybook</TabsTrigger>
          </TabsList>

          <div className="relative">
            <motion.div
              animate={{ height: height === "auto" ? "auto" : height }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <div ref={contentRef}>
                {!data ? (
                  <div className="mt-4">
                    <EmptyState />
                  </div>
                ) : isReloading ? (
                  <div className="mt-4">
                    {activeTab === "test" && <TestTabSkeleton />}
                    {activeTab === "raw" && <RawTabSkeleton />}
                    {activeTab === "figma" && <FigmaTabSkeleton />}
                    {activeTab === "html" && <HtmlTabSkeleton />}
                    {activeTab === "storybook" && <StorybookTabSkeleton />}
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={dataKey}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <TabsContent value="test" className="mt-4">
                        <TestTab data={data} />
                      </TabsContent>

                      <TabsContent value="raw" className="mt-4">
                        <CodeBlock code={formatRawClipboard(data)} />
                      </TabsContent>

                      <TabsContent value="figma" className="mt-4">
                        <CodeBlock code={formatFigmaPayload(data)} />
                      </TabsContent>

                      <TabsContent value="html" className="mt-4">
                        <CodeBlock code={formatHtmlPayload(data)} />
                      </TabsContent>

                      <TabsContent value="storybook" className="mt-4">
                        <CodeBlock code={formatStorybookParams(data)} />
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
