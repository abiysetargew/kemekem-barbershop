import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-7xl font-bold gold-text">404</div>
        <h1 className="heading-2 mt-4 text-balance">Page not found</h1>
        <p className="mt-2 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild variant="gold" className="mt-6">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </section>
  );
}