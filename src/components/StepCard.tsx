import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StepCardProps {
  step: number;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function StepCard({ step, title, description, children }: StepCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start gap-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
            {step}
          </div>
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <h2 className="font-medium leading-none pt-1.5">{title}</h2>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            {children && (
              <div className="text-sm text-muted-foreground">{children}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
