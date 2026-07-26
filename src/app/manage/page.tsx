import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Search } from "lucide-react";

export const metadata = { title: "Manage Booking" };

export default function ManagePage() {
  return (
    <section className="min-h-screen pt-32 pb-20">
      <div className="container-tight max-w-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50 text-gold-600 dark:bg-gold-900/20">
            <Calendar className="h-7 w-7" />
          </div>
          <h1 className="heading-2 mt-6 text-balance">Manage your booking</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your phone number to find and manage your appointments.
          </p>
        </div>

        <form
          action="/manage/lookup"
          method="get"
          className="luxury-card mt-10 p-7"
        >
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+251 924 ..."
              autoComplete="tel"
            />
          </div>
          <Button type="submit" variant="gold" size="lg" className="mt-6 w-full">
            <Search className="mr-2 h-4 w-4" />
            Find my bookings
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-border/60 bg-muted/30 p-5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2 text-foreground font-medium">
            <MapPin className="h-4 w-4 text-gold-600" />
            Prefer the direct link?
          </p>
          <p className="mt-1.5">
            Use the link in your confirmation message to manage a specific
            booking directly.
          </p>
        </div>
      </div>
    </section>
  );
}