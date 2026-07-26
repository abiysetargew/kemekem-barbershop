// Top-level admin layout intentionally minimal.
// Auth checks happen in:
//   - src/app/admin/(shell)/layout.tsx (for authenticated admin pages)
//   - src/app/admin/login/page.tsx (for the public login page)

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}