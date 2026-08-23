import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerInner}>
        <span>© 2026 Florian Dehm · Frankfurt am Main</span>
        <div className={styles.footerLinks}>
          <a href="mailto:florian@dehm-online.de">florian@dehm-online.de</a>
          <a href="https://github.com/DonckyTM" target="_blank" rel="noreferrer">
            github.com/DonckyTM
          </a>
        </div>
      </div>
    </footer>
  );
}
