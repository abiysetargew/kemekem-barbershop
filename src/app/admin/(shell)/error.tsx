"use client";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console + send to be visible in Vercel logs
    console.error("[ADMIN ERROR]", error?.message, error?.stack);
    fetch("/api/log-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error?.message,
        stack: error?.stack,
        digest: error?.digest,
        time: new Date().toISOString(),
      }),
    }).catch(() => {});
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-2xl rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-center">
        <h1 className="font-display text-2xl font-semibold text-destructive">
          Admin Error
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ve logged the issue. Please share the message below.
        </p>
        <pre className="mt-4 max-h-64 overflow-auto rounded-lg bg-muted p-4 text-left text-xs">
          {error?.message}
          {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
        </pre>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-gold-gradient px-6 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-border px-6 py-2 text-sm font-medium"
          >
            Back home
          </a>
        </div>
      </div>
    </div>
  );
}