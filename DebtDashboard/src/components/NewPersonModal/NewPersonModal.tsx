import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ApiError } from '../../api/client';
import styles from './NewPersonModal.module.css';

interface NewPersonModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string, age: number) => Promise<void>;
}

export function NewPersonModal({ open, onClose, onSubmit }: NewPersonModalProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setAge('');
      setError(null);
      setSubmitting(false);
    }
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

  const trimmedName = name.trim();
  const ageNumber = Number(age);
  const isValid =
    trimmedName.length >= 3 &&
    trimmedName.length <= 50 &&
    age.trim() !== '' &&
    Number.isInteger(ageNumber) &&
    ageNumber >= 0 &&
    ageNumber <= 120;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(trimmedName, ageNumber);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível adicionar a pessoa.');
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="new-person-title">
        <form onSubmit={handleSubmit}>
          <div className={styles.header}>
            <div>
              <div id="new-person-title" className={styles.title}>
                Nova pessoa
              </div>
              <div className={styles.subtitle}>Cadastre uma pessoa para acompanhar suas finanças.</div>
            </div>
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
              ×
            </button>
          </div>

          <div className={styles.body}>
            <div>
              <div className={styles.label}>Nome</div>
              <input
                className={styles.input}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="ex.: Ana Beatriz Costa"
                autoFocus
              />
              <div className={styles.helper}>Entre 3 e 50 caracteres.</div>
            </div>
            <div>
              <div className={styles.label}>Idade</div>
              <input
                className={styles.input}
                type="number"
                value={age}
                onChange={(event) => setAge(event.target.value)}
                placeholder="ex.: 34"
              />
              <div className={styles.helper}>De 0 a 120. Menores de 18 não podem registrar receitas.</div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.addButton} disabled={!isValid || submitting}>
              {submitting ? 'Adicionando…' : 'Adicionar pessoa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
