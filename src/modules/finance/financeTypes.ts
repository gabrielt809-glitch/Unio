import type { FinanceTransaction } from '../../types/database';

export type FinanceDraft = {
  title: string;
  amount: string;
  transaction_type: FinanceTransaction['transaction_type'];
  category: string;
  occurred_on: string;
};

export type FinanceSummary = {
  incomeCents: number;
  expenseCents: number;
  balanceCents: number;
};
