import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError } from '../../api/client';
import { TRANSACTION_TYPE } from '../../api/types';
import type { TransactionType } from '../../api/types';
import type { PersonViewModel } from '../../hooks/useDashboard';
import styles from './QuickAddPanel.module.css';

interface QuickAddPanelProps {
  people: PersonViewModel[];
  onSubmit: (personId: string, description: string, amount: number, type: TransactionType) => Promise<void>;
}

export function QuickAddPanel({ people, onSubmit }: QuickAddPanelProps) {
  const [personId, setPersonId] = useState(people[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TRANSACTION_TYPE.EXPENSE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!people.some((person) => person.id === personId)) {
      setPersonId(people[0]?.id ?? '');
    }
  }, [people, personId]);

  const amountValue = Number(amount.replace(',', '.'));
  const isValid = personId !== '' && description.trim().length > 0 && amount !== '' && amountValue > 0;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(personId, description.trim(), amountValue, type);
      setDescription('');
      setAmount('');
      setType(TRANSACTION_TYPE.EXPENSE);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível registrar a transação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.panel} onSubmit={handleSubmit}>
      <div className={styles.title}>Registrar transação</div>
      <div className={styles.fields}>
        <div>
          <div className={styles.label}>Pessoa</div>
          <select
            className={styles.select}
            value={personId}
            onChange={(event) => setPersonId(event.target.value)}
            disabled={people.length === 0}
          >
            {people.length === 0 ? (
              <option value="">Selecione uma pessoa</option>
            ) : (
              people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <div className={styles.label}>Descrição</div>
          <input
            className={styles.input}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="ex.: Pagamento de fatura"
          />
        </div>

        <div>
          <div className={styles.label}>Valor</div>
          <input
            className={`mono ${styles.input}`}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            inputMode="decimal"
            placeholder="R$ 0,00"
          />
        </div>

        <div>
          <div className={styles.label}>Tipo</div>
          <div className={styles.segmented}>
            <button
              type="button"
              className={`${styles.segmentButton} ${type === TRANSACTION_TYPE.EXPENSE ? styles.segmentExpenseActive : styles.segmentInactive}`}
              onClick={() => setType(TRANSACTION_TYPE.EXPENSE)}
            >
              Despesa
            </button>
            <button
              type="button"
              className={`${styles.segmentButton} ${type === TRANSACTION_TYPE.REVENUE ? styles.segmentRevenueActive : styles.segmentInactive}`}
              onClick={() => setType(TRANSACTION_TYPE.REVENUE)}
            >
              Receita
            </button>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.submit} disabled={!isValid || submitting}>
          {submitting ? 'Adicionando…' : 'Adicionar transação'}
        </button>
      </div>
    </form>
  );
}
