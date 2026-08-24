import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="app" data-theme="light">
      <AdminHeader />
      {children}
    </div>
  );
}
