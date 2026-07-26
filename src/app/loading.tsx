import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-tight py-20">
      <Skeleton className="mx-auto h-12 w-1/2" />
      <Skeleton className="mx-auto mt-4 h-6 w-1/3" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full" />
        ))}
      </div>
    </div>
  );
}