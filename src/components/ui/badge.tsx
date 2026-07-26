import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "secondary" | "outline" | "gold";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants: Record<string, string> = {
    default: "bg-foreground text-background",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground",
    gold: "bg-gold-gradient text-white border-0",
  };
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };