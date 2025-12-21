import { ClipboardList } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-muted-foreground">
        No data yet. Copy a component in Figma and click Extract.
      </p>
    </div>
  );
}
