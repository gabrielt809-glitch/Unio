import { requireSupabase } from '../../services/supabase/client';
import type { FinanceTransaction } from '../../types/database';
import { parseCurrencyToCents } from '../../utils/format';
import type { FinanceDraft } from './financeTypes';

export const listTransactions = async (
  userId: string,
  spaceId: string,
  monthKey: string,
): Promise<FinanceTransaction[]> => {
  const start = `${monthKey}-01`;
  const end = `${monthKey}-31`;
  const { data, error } = await requireSupabase()
    .from('finance_transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('space_id', spaceId)
    .gte('occurred_on', start)
    .lte('occurred_on', end)
    .order('occurred_on', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const createTransaction = async (
  userId: string,
  spaceId: string,
  draft: FinanceDraft,
): Promise<FinanceTransaction> => {
  const { data, error } = await requireSupabase()
    .from('finance_transactions')
    .insert({
      user_id: userId,
      space_id: spaceId,
      title: draft.title.trim(),
      amount_cents: parseCurrencyToCents(draft.amount),
      transaction_type: draft.transaction_type,
      category: draft.category.trim(),
      occurred_on: draft.occurred_on,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteTransaction = async (transaction: FinanceTransaction): Promise<void> => {
  const { error } = await requireSupabase()
    .from('finance_transactions')
    .delete()
    .eq('id', transaction.id)
    .eq('user_id', transaction.user_id);

  if (error) {
    throw error;
  }
};
