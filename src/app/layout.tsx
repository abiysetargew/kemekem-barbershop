import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";

export const metadata = {
  title: {
    default: "Kemekem Barbershop",
    template: "%s | Kemekem Barbershop",
  },
  description:
    "Premium grooming experience in Addis Ababa. Book your appointment online.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}