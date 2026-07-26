"use client";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "0.75rem",
        },
      }}
    />
  );
}