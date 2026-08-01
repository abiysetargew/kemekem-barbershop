"use client";
import { Scissors, Calendar, Clock, User, MapPin } from "lucide-react";
import type { Appointment, Barber, Branch, BusinessSettings, Service } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

export function Receipt({
  appt,
  svc,
  barber,
  branch,
  settings,
}: {
  appt: Appointment;
  svc?: Service;
  barber?: Barber;
  branch?: Branch;
  settings: BusinessSettings;
}) {
  return (
    <div className="print:w-full">
      <div className="hidden print:block">
        <style jsx global>{`
          @media print {
            body * { visibility: hidden; }
            #receipt, #receipt * { visibility: visible; }
            #receipt { position: absolute; left: 0; top: 0; width: 100%; }
          }
        `}</style>
      </div>
      <div
        id="receipt"
        className="rounded-3xl border border-border bg-card p-8 print:border-0 print:shadow-none"
      >
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div>
            <div className="font-display text-2xl font-bold">{settings.business_name}</div>
            <div className="text-xs text-muted-foreground">
              {settings.phone} · {settings.email}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              Confirmation
            </div>
            <div className="font-mono text-lg font-bold">{appt.appointment_number}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(appt.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <Line icon={User} label="Customer" value={appt.customer_name} />
          <Line icon={Phone} label="Phone" value={appt.customer_phone} />
          {branch && <Line icon={MapPin} label="Branch" value={branch.name} />}
          <Line
            icon={Calendar}
            label="Date"
            value={new Date(appt.appointment_date).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
          <Line
            icon={Clock}
            label="Time"
            value={`${appt.start_time.slice(0, 5)} – ${appt.end_time.slice(0, 5)}`}
          />
          {svc && (
            <>
              <Line icon={Scissors} label="Service" value={svc.name} />
              <Line label="Price" value={formatCurrency(svc.price)} />
            </>
          )}
          {barber && <Line icon={User} label="Barber" value={barber.name} />}
        </div>

        <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <p>Pay at the barbershop after your service. Cash, card, Telebirr accepted.</p>
          <p className="mt-1">Manage booking: /manage/{appt.cancel_token}</p>
        </div>
      </div>
    </div>
  );
}

function Line({
  icon: Icon,
  label,
  value,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />}
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}