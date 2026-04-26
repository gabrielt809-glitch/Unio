import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { Check, Plus } from 'lucide-react';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { FieldShell, SelectInput, TextInput } from '../../components/Field';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionHeader } from '../../components/SectionHeader';
import { StateView } from '../../components/StateView';
import { Surface } from '../../components/Surface';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { cn } from '../../utils/cn';
import { useHabits } from './useHabits';
import type { HabitDraft } from './habitsTypes';

type HabitsViewProps = {
  userId: string;
  spaceId: string;
};

const habitColors = ['#7C5CFF', '#38BDF8', '#22C55E', '#F59E0B', '#EF4444'] as const;

const emptyDraft: HabitDraft = {
  title: '',
  cadence: 'daily',
  color: habitColors[0],
};

export const HabitsView = ({ spaceId, userId }: HabitsViewProps) => {
  const { addHabit, completedHabitIds, error, habits, isLoading, toggleHabit } = useHabits(userId, spaceId);
  const [draft, setDraft] = useState<HabitDraft>(emptyDraft);
  const action = useAsyncAction();
  const progress = useMemo(() => {
    if (habits.length === 0) {
      return 0;
    }
    return Math.round((completedHabitIds.size / habits.length) * 100);
  }, [completedHabitIds.size, habits.length]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      return;
    }

    void action.run(async () => {
      await addHabit(draft);
      setDraft(emptyDraft);
    });
  };

  return (
    <div className="grid gap-4">
      <SectionHeader
        title="Habitos"
        description={`${completedHabitIds.size}/${habits.length} concluidos hoje. Progresso ${progress}%.`}
      />

      <ProgressBar label="Progresso diario" tone="success" value={progress} />

      <Surface>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <FieldShell label="Novo habito">
            <TextInput
              maxLength={80}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
              placeholder="Ex.: caminhar 20 minutos"
              required
              value={draft.title}
            />
          </FieldShell>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FieldShell label="Ritmo">
              <SelectInput
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    cadence: event.target.value as HabitDraft['cadence'],
                  }))
                }
                value={draft.cadence}
              >
                <option value="daily">Diario</option>
                <option value="weekly">Semanal</option>
              </SelectInput>
            </FieldShell>
            <FieldShell label="Cor">
              <div className="flex min-h-11 items-center gap-2 rounded-app border border-white/10 bg-background px-2">
                {habitColors.map((color) => (
                  <button
                    key={color}
                    aria-label={`Usar cor ${color}`}
                    className={cn(
                      'h-8 w-8 rounded-full border-2 transition',
                      draft.color === color ? 'border-text-primary' : 'border-transparent',
                    )}
                    style={{ backgroundColor: color }}
                    type="button"
                    onClick={() => setDraft((current) => ({ ...current, color }))}
                  />
                ))}
              </div>
            </FieldShell>
          </div>
          <Button
            icon={<Plus aria-hidden="true" className="h-4 w-4" />}
            isLoading={action.isRunning}
            type="submit"
          >
            Adicionar habito
          </Button>
          {action.error ? <p className="text-sm text-danger">{action.error}</p> : null}
        </form>
      </Surface>

      {isLoading ? (
        <StateView
          tone="loading"
          title="Carregando habitos"
          description="Buscando habitos e registros de hoje."
        />
      ) : null}
      {error ? <StateView tone="error" title="Erro ao carregar habitos" description={error} /> : null}
      {!isLoading && !error && habits.length === 0 ? (
        <StateView
          title="Nenhum habito configurado"
          description="Adicione habitos pequenos e mensuraveis para acompanhar seu dia."
        />
      ) : null}

      <div className="grid gap-3">
        {habits.map((habit) => {
          const isComplete = completedHabitIds.has(habit.id);
          return (
            <Surface key={habit.id} className="p-3">
              <button
                className="flex min-h-16 w-full items-center gap-3 text-left"
                type="button"
                onClick={() => void action.run(() => toggleHabit(habit))}
              >
                <span
                  className={cn(
                    'grid h-11 w-11 shrink-0 place-items-center rounded-app border',
                    isComplete
                      ? 'border-success bg-success/10 text-success'
                      : 'border-white/10 bg-background text-text-secondary',
                  )}
                >
                  {isComplete ? (
                    <Check aria-hidden="true" className="h-5 w-5" />
                  ) : (
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: habit.color }} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-text-primary">{habit.title}</span>
                  <span className="mt-1 block text-xs text-text-secondary">
                    {habit.cadence === 'daily' ? 'Diario' : 'Semanal'}
                  </span>
                </span>
                <Badge tone={isComplete ? 'success' : 'neutral'}>{isComplete ? 'Feito' : 'Pendente'}</Badge>
              </button>
            </Surface>
          );
        })}
      </div>
    </div>
  );
};
