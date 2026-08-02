"use client";
import dynamic from "next/dynamic";

const BookingFlow = dynamic(
  () => import("@/components/booking/booking-flow").then((m) => m.BookingFlow),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
      </div>
    ),
  }
);

export default function BookPage() {
  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="container-tight">
        <div className="mb-10 text-center">
          <h1 className="heading-1 text-balance">Book your appointment</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Four quick steps. Takes less than a minute.
          </p>
        </div>
        <BookingFlow />
      </div>
    </section>
  );
}