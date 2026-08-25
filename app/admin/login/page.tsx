"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signInAction, type LoginState } from "./actions";
import styles from "./page.module.css";

const INITIAL: LoginState = { error: null };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={styles.submit} disabled={pending}>
      {pending ? "Logging in…" : "Log in"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(signInAction, INITIAL);

  return (
    <div id="app" data-theme="light">
      <main className={styles.main}>
        <form className={styles.card} action={formAction}>
          <p className={styles.eyebrow}>Admin</p>
          <h1 className={styles.title}>Log in</h1>

          <label className={styles.field}>
            <span>Email</span>
            <input type="email" name="email" autoComplete="email" required />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input type="password" name="password" autoComplete="current-password" required />
          </label>

          {state.error && <p className={styles.error}>{state.error}</p>}

          <SubmitButton />
        </form>
      </main>
    </div>
  );
}
