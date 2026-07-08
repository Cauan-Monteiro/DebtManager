import { useEffect, useState } from 'react';
import { ApiError } from '../../api/client';
import { fetchPeopleTotals } from '../../api/person';
import type { CompleteReportDTO, PersonCompleteDTO } from '../../api/types';
import type { PersonViewModel } from '../../hooks/useDashboard';
import { getAvatarColors, getInitials } from '../../utils/format';
import { PersonCard } from '../PersonCard/PersonCard';
import styles from './PeopleTotalsModal.module.css';

interface PeopleTotalsModalProps {
  open: boolean;
  onClose: () => void;
}

function toViewModel(person: PersonCompleteDTO, index: number): PersonViewModel {
  const avatar = getAvatarColors(index);
  const total = person.totalRevenues + person.totalExpenses || 1;
  return {
    id: person.id,
    name: person.name,
    age: person.age,
    totalExpenses: person.totalExpenses,
    totalRevenues: person.totalRevenues,
    totalBalance: person.totalBalance,
    initials: getInitials(person.name),
    avatarBackground: avatar.background,
    avatarColor: avatar.color,
    positive: person.totalBalance >= 0,
    revenueSharePct: (person.totalRevenues / total) * 100,
    expenseSharePct: (person.totalExpenses / total) * 100,
  };
}

export function PeopleTotalsModal({ open, onClose }: PeopleTotalsModalProps) {
  const [report, setReport] = useState<CompleteReportDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setReport(null);
    setError(null);
    setLoading(true);
    (async () => {
      try {
        const result = await fetchPeopleTotals();
        setReport(result);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o resumo das pessoas.');
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const people = report?.people ?? [];

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="people-totals-title">
        <div className={styles.header}>
          <div>
            <div id="people-totals-title" className={styles.title}>
              Resumo das pessoas
            </div>
            <div className={styles.subtitle}>Totais atualizados de receitas, despesas e saldo de cada pessoa.</div>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className={styles.body}>
          {loading ? (
            <div className={styles.status}>Carregando…</div>
          ) : error ? (
            <div className={`${styles.status} ${styles.statusError}`}>{error}</div>
          ) : people.length === 0 ? (
            <div className={styles.status}>Nenhuma pessoa cadastrada ainda.</div>
          ) : (
            <div className={styles.list}>
              {people.map((person, index) => (
                <PersonCard key={person.id} person={toViewModel(person, index)} />
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.closeAction} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
