"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="heading-2 text-balance">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <pre className="mt-6 max-h-72 overflow-auto rounded-xl bg-muted/50 p-4 text-left text-xs whitespace-pre-wrap">
          {error?.message}
          {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
        </pre>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="gold" onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}