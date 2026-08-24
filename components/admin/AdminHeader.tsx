"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./AdminHeader.module.css";

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className={styles.header}>
      <span className={styles.brand}>Admin</span>
      <button type="button" className={styles.logout} onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}
