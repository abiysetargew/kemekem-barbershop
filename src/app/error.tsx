import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="heading-2 text-balance">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
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