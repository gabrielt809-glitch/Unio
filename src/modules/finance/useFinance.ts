import { useCallback, useEffect, useMemo, useState } from 'react';

import type { FinanceTransaction } from '../../types/database';
import { getMonthKey } from '../../utils/date';
import { toErrorMessage } from '../../utils/errors';
import { createTransaction, deleteTransaction, listTransactions } from './financeService';
import type { FinanceDraft, FinanceSummary } from './financeTypes';

type FinanceState = {
  transactions: FinanceTransaction[];
  isLoading: boolean;
  error: string | null;
};

export const useFinance = (userId: string, spaceId: string) => {
  const monthKey = useMemo(() => getMonthKey(), []);
  const [state, setState] = useState<FinanceState>({ transactions: [], isLoading: true, error: null });

  const refresh = useCallback(async () => {
    setState((current) => ({ ...current, isLoading: true, error: null }));
    try {
      const transactions = await listTransactions(userId, spaceId, monthKey);
      setState({ transactions, isLoading: false, error: null });
    } catch (error) {
      setState({ transactions: [], isLoading: false, error: toErrorMessage(error) });
    }
  }, [monthKey, spaceId, userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const summary = useMemo<FinanceSummary>(() => {
    const incomeCents = state.transactions
      .filter((item) => item.transaction_type === 'income')
      .reduce((sum, item) => sum + item.amount_cents, 0);
    const expenseCents = state.transactions
      .filter((item) => item.transaction_type === 'expense')
      .reduce((sum, item) => sum + item.amount_cents, 0);
    return { incomeCents, expenseCents, balanceCents: incomeCents - expenseCents };
  }, [state.transactions]);

  const addTransaction = useCallback(
    async (draft: FinanceDraft) => {
      const created = await createTransaction(userId, spaceId, draft);
      setState((current) => ({ ...current, transactions: [created, ...current.transactions] }));
    },
    [spaceId, userId],
  );

  const removeTransaction = useCallback(async (transaction: FinanceTransaction) => {
    await deleteTransaction(transaction);
    setState((current) => ({
      ...current,
      transactions: current.transactions.filter((item) => item.id !== transaction.id),
    }));
  }, []);

  return { ...state, addTransaction, monthKey, refresh, removeTransaction, summary };
};
