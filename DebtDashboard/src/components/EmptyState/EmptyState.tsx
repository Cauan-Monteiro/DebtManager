import styles from './EmptyState.module.css';

interface EmptyStateProps {
  onAddPerson: () => void;
}

export function EmptyState({ onAddPerson }: EmptyStateProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>+</div>
      <div className={styles.heading}>Nenhuma pessoa cadastrada</div>
      <div className={styles.subtext}>
        Cadastre a primeira pessoa para começar a acompanhar receitas, despesas e saldos.
      </div>
      <button type="button" className={styles.cta} onClick={onAddPerson}>
        + Adicionar pessoa
      </button>
    </div>
  );
}
