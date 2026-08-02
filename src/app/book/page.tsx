"use client";
import { BookingFlow } from "@/components/booking/booking-flow";
import { BookingErrorBoundary } from "@/components/booking/booking-error-boundary";

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
        <BookingErrorBoundary>
          <BookingFlow />
        </BookingErrorBoundary>
      </div>
    </section>
  );
}