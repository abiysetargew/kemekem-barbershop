import { createAdminClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { ManageBookingActions } from "@/components/manage/manage-booking-actions";

export const metadata = { title: "Manage Booking" };

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = createAdminClient();
  const { data: appt } = await supabase
    .from("appointments")
    .select("*")
    .eq("cancel_token", token)
    .maybeSingle();

  if (!appt) notFound();

  return (
    <section className="min-h-screen pt-32 pb-20">
      <div className="container-tight max-w-2xl">
        <h1 className="heading-2 text-balance">Manage your booking</h1>
        <ManageBookingActions appointment={appt as any} />
      </div>
    </section>
  );
}