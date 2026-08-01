import { StaffGuard } from "@/components/staff/staff-guard";

export const metadata = { title: "Staff Dashboard", robots: { index: false } };

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffGuard>{children}</StaffGuard>;
}