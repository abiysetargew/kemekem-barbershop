import { createAdminClient } from "@/lib/supabase/client";
import { generateAppointmentNumber } from "@/lib/utils";
import type { BookingFormData } from "@/types/database";
import { timeToMinutes, minutesToTime } from "@/lib/utils";

export async function createBooking(data: BookingFormData) {
  const supabase = createAdminClient();

  // 1. Find-or-create customer
  let customerId: string | null = null;
  const { data: existingCustomer } = await supabase
    .from("customers")
    .select("id, visit_count")
    .eq("phone", data.customer_phone)
    .maybeSingle();

  if (existingCustomer) {
    customerId = (existingCustomer as any).id;
  } else {
    const { data: newCustomer } = await supabase
      .from("customers")
      .insert({
        name: data.customer_name,
        phone: data.customer_phone,
        shop_id: null,
      })
      .select("id")
      .single();
    customerId = (newCustomer as any)?.id || null;
  }

  // 2. Get service duration for end_time
  const { data: service } = await supabase
    .from("services")
    .select("duration_minutes")
    .eq("id", data.service_id)
    .single();

  const duration = (service as any)?.duration_minutes || 30;
  const startMin = timeToMinutes(data.start_time);
  const endTime = minutesToTime(startMin + duration);

  // 3. Final conflict re-check (defense in depth)
  const { data: conflicts } = await supabase
    .from("appointments")
    .select("id")
    .eq("barber_id", data.barber_id)
    .eq("appointment_date", data.date)
    .neq("status", "cancelled")
    .lte("start_time", data.start_time)
    .gte("end_time", endTime);

  if (conflicts && (conflicts as any[]).length > 0) {
    throw new Error("This slot was just booked. Please pick another time.");
  }

  // 4. Create appointment
  const appointmentNumber = generateAppointmentNumber();
  const { data: created, error } = await supabase
    .from("appointments")
    .insert({
      appointment_number: appointmentNumber,
      customer_id: customerId,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      notes: data.notes || null,
      branch_id: data.branch_id,
      service_id: data.service_id,
      barber_id: data.barber_id,
      appointment_date: data.date,
      start_time: data.start_time,
      end_time: endTime,
      status: "confirmed",
      shop_id: null,
    })
    .select("*")
    .single();

  if (error) throw error;
  return created;
}