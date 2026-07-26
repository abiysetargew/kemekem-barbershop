import { Suspense } from "react";
import { BookingFlow } from "@/components/booking/booking-flow";
import { getBranches, getServices, getBarbers, getBusinessSettings } from "@/lib/data";

export const metadata = { title: "Book Appointment" };

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ branch?: string; service?: string; barber?: string }>;
}) {
  const params = await searchParams;
  const [branches, services, barbers, settings] = await Promise.all([
    getBranches(),
    getServices(),
    getBarbers(),
    getBusinessSettings(),
  ]);

  return (
    <section className="min-h-screen pt-28 pb-20">
      <div className="container-tight">
        <div className="mb-10 text-center">
          <h1 className="heading-1 text-balance">Book your appointment</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Four quick steps. Takes less than a minute.
          </p>
        </div>
        <Suspense>
          <BookingFlow
            branches={branches}
            services={services}
            barbers={barbers}
            interval={settings?.booking_interval_minutes || 30}
            preselected={{
              branch_id: params.branch,
              service_id: params.service,
              barber_id: params.barber,
            }}
          />
        </Suspense>
      </div>
    </section>
  );
}