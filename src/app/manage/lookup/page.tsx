import { createAdminClient } from "@/lib/supabase/client";
import { ManageList } from "@/components/manage/manage-list";

export const metadata = { title: "Your Bookings" };

export default async function LookupPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const { phone } = await searchParams;
  const supabase = createAdminClient();
  const { data: appointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("customer_phone", phone || "")
    .order("appointment_date", { ascending: false })
    .limit(20);

  return (
    <section className="min-h-screen pt-32 pb-20">
      <div className="container-tight max-w-3xl">
        <h1 className="heading-2 text-balance">Your bookings</h1>
        <p className="mt-2 text-muted-foreground">
          Showing bookings for <span className="font-medium text-foreground">{phone}</span>
        </p>
        <ManageList appointments={(appointments as any[]) || []} />
      </div>
    </section>
  );
}