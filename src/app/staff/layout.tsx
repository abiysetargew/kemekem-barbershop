"use client";
import { StaffGuard } from "@/components/staff/staff-guard";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <StaffGuard>{children}</StaffGuard>;
}