"use client";
import Link from "next/link";
import { Calendar, Clock, Scissors, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Appointment } from "@/types/database";

export function ManageList({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return (
      <div className="luxury-card mt-10 p-10 text-center">
        <p className="text-muted-foreground">No bookings found.</p>
        <Link
          href="/book"
          className="mt-4 inline-block text-sm font-medium text-gold-600 hover:underline"
        >
          Book an appointment →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-3">
      {appointments.map((a) => (
        <div key={a.id} className="luxury-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    a.status === "completed"
                      ? "secondary"
                      : a.status === "cancelled"
                      ? "destructive"
                      : "gold"
                  }
                >
                  {a.status}
                </Badge>
                <span className="font-display font-semibold">
                  {a.appointment_number}
                </span>
              </div>
              <div className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(a.appointment_date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {a.start_time.slice(0, 5)} – {a.end_time.slice(0, 5)}
                </div>
              </div>
            </div>
            {a.status !== "cancelled" && a.status !== "completed" && (
              <Link
                href={`/manage/${a.cancel_token}`}
                className="text-sm font-medium text-gold-600 hover:underline"
              >
                Manage
                <ExternalLink className="ml-1 inline h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}