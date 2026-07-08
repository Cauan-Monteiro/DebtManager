import { api } from './client';
import type { Transaction, TransactionType } from './types';

export function fetchTransactions() {
  return api.get<Transaction[]>('/transaction');
}

export interface CreateTransactionInput {
  personId: string;
  description: string;
  amount: number;
  type: TransactionType;
}

export function createTransaction(input: CreateTransactionInput) {
  return api.post<Transaction>('/transaction', input);
}
