"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setDone(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setDone(false), 1800);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <button
      onClick={copy}
      className={`mt-1 flex items-center gap-2 font-display text-2xl font-bold transition-opacity hover:opacity-90 ${className || ""}`}
    >
      {value}
      {done ? (
        <Check className="h-4 w-4 opacity-70" />
      ) : (
        <Copy className="h-4 w-4 opacity-70" />
      )}
    </button>
  );
}