import { TRANSACTION_TYPE } from '../../api/types';
import type { RecentActivityItem } from '../../hooks/useDashboard';
import { formatSigned } from '../../utils/format';
import styles from './RecentActivityPanel.module.css';

interface RecentActivityPanelProps {
  items: RecentActivityItem[];
}

export function RecentActivityPanel({ items }: RecentActivityPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.title}>Atividade recente</div>
      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.empty}>Nenhuma atividade ainda.</div>
        ) : (
          items.map((item) => {
            const isRevenue = item.type === TRANSACTION_TYPE.REVENUE;
            return (
              <div key={item.id} className={styles.item}>
                <div
                  className={styles.icon}
                  style={{
                    background: isRevenue ? 'var(--color-positive-bg)' : 'var(--color-negative-bg)',
                    color: isRevenue ? 'var(--color-positive-text)' : 'var(--color-negative-text)',
                  }}
                >
                  {isRevenue ? '+' : '−'}
                </div>
                <div className={styles.info}>
                  <div className={styles.description}>{item.description}</div>
                  <div className={styles.meta}>
                    {item.personName} · {isRevenue ? 'Receita' : 'Despesa'}
                  </div>
                </div>
                <div
                  className={`mono ${styles.amount}`}
                  style={{ color: isRevenue ? 'var(--color-positive-text)' : 'var(--color-negative-text)' }}
                >
                  {formatSigned(isRevenue ? item.amount : -item.amount)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
