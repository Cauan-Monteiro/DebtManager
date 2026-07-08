export const TRANSACTION_TYPE = {
  EXPENSE: 0,
  REVENUE: 1,
} as const;

export type TransactionType = (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];

export interface Person {
  id: string;
  name: string;
  age: number;
  isDisabled: boolean;
}

export interface Transaction {
  id: string;
  personId: string;
  description: string;
  amount: number;
  type: TransactionType;
}

export interface PersonCompleteDTO {
  id: string;
  name: string;
  age: number;
  totalExpenses: number;
  totalRevenues: number;
  totalBalance: number;
}

export interface CompleteReportDTO {
  people: PersonCompleteDTO[];
  grandTotalExpenses: number;
  grandTotalRevenues: number;
  grandTotalBalance: number;
}
