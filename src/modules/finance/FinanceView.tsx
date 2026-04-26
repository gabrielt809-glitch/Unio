import type { FormEvent } from 'react';
import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Plus, Trash2, Wallet } from 'lucide-react';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { FieldShell, SelectInput, TextInput } from '../../components/Field';
import { IconButton } from '../../components/IconButton';
import { MetricTile } from '../../components/MetricTile';
import { SectionHeader } from '../../components/SectionHeader';
import { StateView } from '../../components/StateView';
import { Surface } from '../../components/Surface';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import type { FinanceTransaction } from '../../types/database';
import { toDateKey } from '../../utils/date';
import { formatCurrencyFromCents } from '../../utils/format';
import type { FinanceDraft } from './financeTypes';
import { useFinance } from './useFinance';

type FinanceViewProps = {
  userId: string;
  spaceId: string;
};

const emptyDraft: FinanceDraft = {
  title: '',
  amount: '',
  transaction_type: 'expense',
  category: '',
  occurred_on: toDateKey(),
};

export const FinanceView = ({ spaceId, userId }: FinanceViewProps) => {
  const { addTransaction, error, isLoading, removeTransaction, summary, transactions } = useFinance(
    userId,
    spaceId,
  );
  const [draft, setDraft] = useState<FinanceDraft>(emptyDraft);
  const [transactionToDelete, setTransactionToDelete] = useState<FinanceTransaction | null>(null);
  const action = useAsyncAction();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.amount.trim()) {
      return;
    }

    void action.run(async () => {
      await addTransaction(draft);
      setDraft(emptyDraft);
    });
  };

  const confirmDelete = () => {
    if (!transactionToDelete) {
      return;
    }

    void action.run(async () => {
      await removeTransaction(transactionToDelete);
      setTransactionToDelete(null);
    });
  };

  return (
    <div className="grid gap-4">
      <SectionHeader
        title="Financas"
        description="Receitas e despesas do mes, sempre persistidas por usuario e espaco."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricTile
          icon={<ArrowUpCircle aria-hidden="true" className="h-5 w-5" />}
          label="Entradas"
          tone="success"
          value={formatCurrencyFromCents(summary.incomeCents)}
        />
        <MetricTile
          icon={<ArrowDownCircle aria-hidden="true" className="h-5 w-5" />}
          label="Saidas"
          tone="danger"
          value={formatCurrencyFromCents(summary.expenseCents)}
        />
        <MetricTile
          icon={<Wallet aria-hidden="true" className="h-5 w-5" />}
          label="Saldo"
          tone={summary.balanceCents >= 0 ? 'accent' : 'warning'}
          value={formatCurrencyFromCents(summary.balanceCents)}
        />
      </div>

      <Surface>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <FieldShell label="Descricao">
            <TextInput
              maxLength={100}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              placeholder="Ex.: mercado, salario, assinatura"
              required
              value={draft.title}
            />
          </FieldShell>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FieldShell label="Valor">
              <TextInput
                inputMode="decimal"
                onChange={(event) => setDraft((current) => ({ ...current, amount: event.target.value }))}
                placeholder="0,00"
                required
                value={draft.amount}
              />
            </FieldShell>
            <FieldShell label="Tipo">
              <SelectInput
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    transaction_type: event.target.value as FinanceDraft['transaction_type'],
                  }))
                }
                value={draft.transaction_type}
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </SelectInput>
            </FieldShell>
            <FieldShell label="Categoria">
              <TextInput
                maxLength={40}
                onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
                placeholder="Casa, saude, lazer"
                required
                value={draft.category}
              />
            </FieldShell>
            <FieldShell label="Data">
              <TextInput
                onChange={(event) => setDraft((current) => ({ ...current, occurred_on: event.target.value }))}
                required
                type="date"
                value={draft.occurred_on}
              />
            </FieldShell>
          </div>
          <Button
            icon={<Plus aria-hidden="true" className="h-4 w-4" />}
            isLoading={action.isRunning}
            type="submit"
          >
            Adicionar lancamento
          </Button>
          {action.error ? <p className="text-sm text-danger">{action.error}</p> : null}
        </form>
      </Surface>

      {isLoading ? (
        <StateView tone="loading" title="Carregando financas" description="Buscando lancamentos do mes." />
      ) : null}
      {error ? <StateView tone="error" title="Erro ao carregar financas" description={error} /> : null}
      {!isLoading && !error && transactions.length === 0 ? (
        <StateView
          title="Nenhum lancamento no mes"
          description="Registre receitas e despesas para visualizar seu saldo."
        />
      ) : null}

      <div className="grid gap-3">
        {transactions.map((transaction) => (
          <Surface key={transaction.id} className="p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-app ${transaction.transaction_type === 'income' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}
                >
                  {transaction.transaction_type === 'income' ? (
                    <ArrowUpCircle aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <ArrowDownCircle aria-hidden="true" className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-text-primary">{transaction.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge>{transaction.category}</Badge>
                    <Badge>{transaction.occurred_on}</Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p className="shrink-0 text-sm font-bold tabular-nums text-text-primary">
                  {formatCurrencyFromCents(transaction.amount_cents)}
                </p>
                <IconButton
                  icon={<Trash2 aria-hidden="true" className="h-4 w-4" />}
                  label="Excluir lancamento"
                  variant="danger"
                  onClick={() => setTransactionToDelete(transaction)}
                />
              </div>
            </div>
          </Surface>
        ))}
      </div>

      <ConfirmDialog
        confirmLabel="Excluir"
        description="Este lancamento sera removido do Supabase. Essa acao nao pode ser desfeita."
        onCancel={() => setTransactionToDelete(null)}
        onConfirm={confirmDelete}
        open={Boolean(transactionToDelete)}
        title="Excluir lancamento?"
      />
    </div>
  );
};
