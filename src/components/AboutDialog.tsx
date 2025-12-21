import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About Figma Clipboard Extractor</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h3 className="font-semibold text-base mb-2">The problem</h3>
            <p className="text-muted-foreground">
              Design systems live across multiple places: docs, Figma, code. The documentation is usually the most complete reference, but designers still have to hunt through Figma libraries to find components.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">What this does</h3>
            <p className="text-muted-foreground">
              Adds a "Copy to Figma" button to your design system website. Designers can grab ready-made Figma components directly from the docs instead of digging through library files.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">Why it's useful</h3>
            <ul className="text-muted-foreground space-y-2 list-none">
              <li>• Designers actually use the docs when components are one click away</li>
              <li>• Creates natural pressure to keep the website complete and current</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-base mb-2">How it works</h3>
            <ol className="text-muted-foreground list-decimal list-inside space-y-1.5 ml-1">
              <li>Copy a component from your Figma library</li>
              <li>Extract the clipboard data with this tool</li>
              <li>Add the snippet to your docs site</li>
            </ol>
          </section>

          <section className="pt-4 border-t border-border">
            <h3 className="font-semibold text-base mb-2">Credits</h3>
            <p className="text-muted-foreground">
              Concept and design by{" "}
              <a
                href="https://github.com/JanOstrowka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                Jan Ostrówka↗
              </a>{" "}
              @ n8n
            </p>
            <p className="text-muted-foreground mt-2">
              Implementation based on clipboard research by{" "}
              <a
                href="https://github.com/dgtlntv/figma-copy-button-test"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md px-2 py-1 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                dgtlntv↗
              </a>
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
