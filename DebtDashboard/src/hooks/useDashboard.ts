import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPerson, fetchPeopleTotals } from '../api/person';
import { createTransaction, fetchTransactions } from '../api/transaction';
import type { CompleteReportDTO, Transaction, TransactionType } from '../api/types';
import { getAvatarColors, getInitials } from '../utils/format';

export interface PersonViewModel {
  id: string;
  name: string;
  age: number;
  totalExpenses: number;
  totalRevenues: number;
  totalBalance: number;
  initials: string;
  avatarBackground: string;
  avatarColor: string;
  positive: boolean;
  revenueSharePct: number;
  expenseSharePct: number;
}

export interface RecentActivityItem {
  id: string;
  personName: string;
  description: string;
  amount: number;
  type: TransactionType;
}

const RECENT_ACTIVITY_LIMIT = 5;

export function useDashboard() {
  const [report, setReport] = useState<CompleteReportDTO | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      const [reportResult, transactionsResult] = await Promise.all([
        fetchPeopleTotals(),
        fetchTransactions(),
      ]);
      setReport(reportResult);
      setTransactions(transactionsResult);
      setLoadError(null);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Falha ao carregar os dados do painel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const people: PersonViewModel[] = useMemo(() => {
    if (!report) return [];
    return report.people
      .map((person, index) => {
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
      })
      .sort((a, b) => b.totalBalance - a.totalBalance);
  }, [report]);

  const personNameById = useMemo(() => {
    const map = new Map<string, string>();
    report?.people.forEach((person) => map.set(person.id, person.name));
    return map;
  }, [report]);

  const recentActivity: RecentActivityItem[] = useMemo(() => {
    return [...transactions]
      .slice(-RECENT_ACTIVITY_LIMIT)
      .reverse()
      .map((transaction) => ({
        id: transaction.id,
        personName: personNameById.get(transaction.personId) ?? 'Pessoa removida',
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
      }));
  }, [transactions, personNameById]);

  const hasPeople = people.length > 0;

  const addPerson = useCallback(
    async (name: string, age: number) => {
      await createPerson(name, age);
      await loadDashboard();
    },
    [loadDashboard],
  );

  const addTransaction = useCallback(
    async (personId: string, description: string, amount: number, type: TransactionType) => {
      const created = await createTransaction({ personId, description, amount, type });
      setTransactions((prev) => [...prev, created]);
      await loadDashboard();
    },
    [loadDashboard],
  );

  return {
    loading,
    loadError,
    people,
    hasPeople,
    grandTotalRevenues: report?.grandTotalRevenues ?? 0,
    grandTotalExpenses: report?.grandTotalExpenses ?? 0,
    grandTotalBalance: report?.grandTotalBalance ?? 0,
    recentActivity,
    addPerson,
    addTransaction,
  };
}
