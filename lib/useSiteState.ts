"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Lang, TabId, Theme } from "@/lib/types";

const STORAGE_KEY = "fd-home";

interface Persisted {
  lang?: Lang;
  theme?: Theme;
}

export function useSiteState() {
  const [tab, setTab] = useState<TabId>("home");
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("light");
  const [openId, setOpenId] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: Persisted = JSON.parse(raw);
      if (parsed.lang) setLang(parsed.lang);
      if (parsed.theme) setTheme(parsed.theme);
    } catch {
      // ignore malformed storage
    }
  }, []);

  const persist = useCallback((next: Persisted) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lang: next.lang ?? lang, theme: next.theme ?? theme })
      );
    } catch {
      // ignore write failures (e.g. private browsing)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, theme]);

  const goTab = useCallback((id: TabId) => {
    setTab(id);
    window.scrollTo({ top: 0 });
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "de" : "en";
      persist({ lang: next });
      return next;
    });
  }, [persist]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      persist({ theme: next });
      return next;
    });
  }, [persist]);

  const openModal = useCallback((id: string) => setOpenId(id), []);
  const closeModal = useCallback(() => setOpenId(null), []);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        closeContact();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal, closeContact]);

  return {
    tab,
    goTab,
    lang,
    toggleLang,
    theme,
    toggleTheme,
    openId,
    openModal,
    closeModal,
    contactOpen,
    openContact,
    closeContact
  };
}

export function useOrbParallax() {
  const orbA = useRef<HTMLDivElement>(null);
  const orbB = useRef<HTMLDivElement>(null);
  const orbC = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const y = window.scrollY || 0;
        if (orbA.current) orbA.current.style.transform = `translate3d(${y * 0.04}px, ${y * -0.16}px, 0) scale(${1 + y * 0.00012})`;
        if (orbB.current) orbB.current.style.transform = `translate3d(${y * -0.05}px, ${y * -0.28}px, 0)`;
        if (orbC.current) orbC.current.style.transform = `translate3d(${y * 0.03}px, ${y * -0.42}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { orbA, orbB, orbC };
}
