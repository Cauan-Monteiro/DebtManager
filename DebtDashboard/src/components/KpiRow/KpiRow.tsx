import { formatCurrency, formatSigned } from '../../utils/format';
import styles from './KpiRow.module.css';

interface KpiRowProps {
  grandTotalRevenues: number;
  grandTotalExpenses: number;
  grandTotalBalance: number;
}

export function KpiRow({ grandTotalRevenues, grandTotalExpenses, grandTotalBalance }: KpiRowProps) {
  const balancePositive = grandTotalBalance >= 0;

  return (
    <div className={styles.row}>
      <div className={styles.card}>
        <div className={`${styles.stripe} ${styles.stripeRevenue}`} />
        <div className={styles.body}>
          <div className={styles.label}>Receitas totais</div>
          <div className={`mono ${styles.value}`}>{formatCurrency(grandTotalRevenues)}</div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={`${styles.stripe} ${styles.stripeExpense}`} />
        <div className={styles.body}>
          <div className={styles.label}>Despesas totais</div>
          <div className={`mono ${styles.value}`}>{formatCurrency(grandTotalExpenses)}</div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={`${styles.stripe} ${styles.stripeAccent}`} />
        <div className={styles.body}>
          <div className={styles.label}>Saldo geral</div>
          <div
            className={`mono ${styles.value}`}
            style={{ color: balancePositive ? 'var(--color-positive-text)' : 'var(--color-negative-text)' }}
          >
            {formatSigned(grandTotalBalance)}
          </div>
        </div>
      </div>
    </div>
  );
}
