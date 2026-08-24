"use client";

import { FormEvent, useState } from "react";
import { Lang, Localized } from "@/lib/types";
import { EditableText } from "@/components/admin/EditableText";
import styles from "./ContactModal.module.css";

interface ContactModalProps {
  texts: Record<string, Localized>;
  lang: Lang;
  open: boolean;
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

const NAME_MAX = 100;
const MESSAGE_MAX = 2000;

export function ContactModal({ texts: t, lang, open, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorKey, setErrorKey] = useState<string>("contactErrorGeneric");

  function reset() {
    setName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
  }

  function handleClose() {
    if (status !== "submitting") reset();
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      if (response.status === 429) {
        setErrorKey("contactErrorRateLimit");
        setStatus("error");
        return;
      }

      if (response.status === 400) {
        setErrorKey("contactErrorValidation");
        setStatus("error");
        return;
      }

      if (!response.ok) {
        setErrorKey("contactErrorGeneric");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorKey("contactErrorGeneric");
      setStatus("error");
    }
  }

  return (
    <div className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`} onClick={handleClose}>
      {open && (
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} aria-label="Close" onClick={handleClose}>
            ✕
          </button>

          <EditableText as="h3" className={styles.title} textKey="contactTitle" value={t.contactTitle} lang={lang} />
          <EditableText as="p" className={styles.intro} textKey="contactIntro" value={t.contactIntro} lang={lang} />

          {status === "success" ? (
            <p className={styles.success}>{t.contactSuccess[lang]}</p>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <EditableText textKey="contactNameLabel" value={t.contactNameLabel} lang={lang} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={NAME_MAX}
                  required
                  disabled={status === "submitting"}
                />
              </label>

              <label className={styles.field}>
                <EditableText textKey="contactEmailLabel" value={t.contactEmailLabel} lang={lang} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "submitting"}
                />
              </label>

              <label className={styles.field}>
                <EditableText textKey="contactMessageLabel" value={t.contactMessageLabel} lang={lang} />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={MESSAGE_MAX}
                  rows={4}
                  required
                  disabled={status === "submitting"}
                />
              </label>

              {status === "error" && <p className={styles.error}>{t[errorKey]?.[lang]}</p>}

              <button type="submit" className={styles.submit} disabled={status === "submitting"}>
                {status === "submitting" ? t.contactSubmitting[lang] : t.contactSubmit[lang]}
              </button>

              <p className={styles.fallback}>
                {t.contactOrEmail[lang]} <a href="mailto:florian@dehm-online.de">florian@dehm-online.de</a>
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
