import type { PersonViewModel } from '../../hooks/useDashboard';
import { formatCurrency, formatSigned } from '../../utils/format';
import styles from './PersonCard.module.css';

interface PersonCardProps {
  person: PersonViewModel;
}

export function PersonCard({ person }: PersonCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <div
          className={styles.avatar}
          style={{ background: person.avatarBackground, color: person.avatarColor }}
        >
          {person.initials}
        </div>
        <div className={styles.identity}>
          <div className={styles.name}>{person.name}</div>
          <div className={styles.age}>{person.age} anos</div>
        </div>
        <span
          className={`mono ${styles.balancePill}`}
          style={{
            background: person.positive ? 'var(--color-positive-bg)' : 'var(--color-negative-bg)',
            color: person.positive ? 'var(--color-positive-text)' : 'var(--color-negative-text)',
          }}
        >
          {formatSigned(person.totalBalance)}
        </span>
      </div>

      <div className={styles.bar}>
        <div className={styles.barRevenue} style={{ width: `${person.revenueSharePct}%` }} />
        <div className={styles.barExpense} style={{ width: `${person.expenseSharePct}%` }} />
      </div>

      <div className={styles.footer}>
        <div>
          <span className={styles.footerLabel}>Receitas</span>{' '}
          <span className={`mono ${styles.footerValue}`}>{formatCurrency(person.totalRevenues)}</span>
        </div>
        <div>
          <span className={styles.footerLabel}>Despesas</span>{' '}
          <span className={`mono ${styles.footerValue}`}>{formatCurrency(person.totalExpenses)}</span>
        </div>
      </div>
    </div>
  );
}
