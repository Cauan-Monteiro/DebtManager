import { useState } from 'react';
import type { PersonViewModel } from '../../hooks/useDashboard';
import { EmptyState } from '../EmptyState/EmptyState';
import { PeopleTotalsModal } from '../PeopleTotalsModal/PeopleTotalsModal';
import { PersonCard } from '../PersonCard/PersonCard';
import styles from './PeopleSection.module.css';

interface PeopleSectionProps {
  people: PersonViewModel[];
  hasPeople: boolean;
  onAddPerson: () => void;
}

export function PeopleSection({ people, hasPeople, onAddPerson }: PeopleSectionProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <div>
      <div className={styles.headerRow}>
        <span className={styles.title}>Pessoas</span>
        <div className={styles.headerActions}>
          {hasPeople && <span className={styles.sortHint}>Ordenado por saldo</span>}
          <button
            type="button"
            className={styles.summaryButton}
            onClick={() => setSummaryOpen(true)}
            aria-label="Ver resumo das pessoas"
            title="Ver resumo das pessoas"
          >
            !
          </button>
          <button type="button" className={styles.newPersonButton} onClick={onAddPerson}>
            + Nova pessoa
          </button>
        </div>
      </div>

      {hasPeople ? (
        <div className={styles.grid}>
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      ) : (
        <EmptyState onAddPerson={onAddPerson} />
      )}

      {summaryOpen && <PeopleTotalsModal open={summaryOpen} onClose={() => setSummaryOpen(false)} />}
    </div>
  );
}
