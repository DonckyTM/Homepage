"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./AdminHeader.module.css";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/texts", label: "Site texts" },
  { href: "/admin/about-facts", label: "About facts" },
  { href: "/admin/about-stack", label: "About stack" }
];

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
      <nav className={styles.nav}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button type="button" className={styles.logout} onClick={handleLogout}>
        Log out
      </button>
    </header>
  );
}
