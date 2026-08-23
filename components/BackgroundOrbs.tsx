"use client";

import { useOrbParallax } from "@/lib/useSiteState";
import styles from "./BackgroundOrbs.module.css";

export function BackgroundOrbs() {
  const { orbA, orbB, orbC } = useOrbParallax();

  return (
    <div className={styles.orbs} aria-hidden="true">
      <div ref={orbA} className={`${styles.orb} ${styles.orbA}`} />
      <div ref={orbB} className={`${styles.orb} ${styles.orbB}`} />
      <div ref={orbC} className={`${styles.orb} ${styles.orbC}`} />
    </div>
  );
}
