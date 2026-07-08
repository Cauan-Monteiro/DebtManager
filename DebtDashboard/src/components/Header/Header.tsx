import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>D</div>
        <div className={styles.wordmark}>DebtManager</div>
      </div>
    </header>
  );
}
