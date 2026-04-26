import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Bed, Droplets, Plus, Smile, Utensils } from 'lucide-react';

import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { FieldShell, SelectInput, TextInput } from '../../components/Field';
import { MetricTile } from '../../components/MetricTile';
import { SectionHeader } from '../../components/SectionHeader';
import { StateView } from '../../components/StateView';
import { Surface } from '../../components/Surface';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { minutesToHours } from '../../utils/format';
import type { DailyMetricDraft, MealDraft } from './healthTypes';
import { useHealth } from './useHealth';

type HealthViewProps = {
  userId: string;
  spaceId: string;
};

const emptyMetricDraft: DailyMetricDraft = {
  water_ml: 0,
  sleep_minutes: 0,
  mood_score: 3,
  energy_score: 3,
  focus_minutes: 0,
  calories: 0,
  protein_grams: 0,
};

const emptyMealDraft = (loggedOn: string): MealDraft => ({
  title: '',
  meal_type: 'lunch',
  calories: 0,
  protein_grams: 0,
  logged_on: loggedOn,
});

const toNumber = (value: string): number => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const HealthView = ({ spaceId, userId }: HealthViewProps) => {
  const { addMeal, error, isLoading, meals, metric, saveMetric, todayKey } = useHealth(userId, spaceId);
  const [metricDraft, setMetricDraft] = useState<DailyMetricDraft>(emptyMetricDraft);
  const [mealDraft, setMealDraft] = useState<MealDraft>(() => emptyMealDraft(todayKey));
  const action = useAsyncAction();

  useEffect(() => {
    if (!metric) {
      return;
    }

    setMetricDraft({
      water_ml: metric.water_ml,
      sleep_minutes: metric.sleep_minutes,
      mood_score: metric.mood_score,
      energy_score: metric.energy_score,
      focus_minutes: metric.focus_minutes,
      calories: metric.calories,
      protein_grams: metric.protein_grams,
    });
  }, [metric]);

  const mealTotals = useMemo(
    () =>
      meals.reduce(
        (totals, meal) => ({
          calories: totals.calories + meal.calories,
          protein: totals.protein + meal.protein_grams,
        }),
        { calories: 0, protein: 0 },
      ),
    [meals],
  );

  const handleMetricSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void action.run(() => saveMetric(metricDraft));
  };

  const handleMealSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mealDraft.title.trim()) {
      return;
    }

    void action.run(async () => {
      await addMeal(mealDraft);
      setMealDraft(emptyMealDraft(todayKey));
    });
  };

  return (
    <div className="grid gap-4">
      <SectionHeader
        title="Saude"
        description="Agua, sono, foco, humor e nutricao do dia em uma unica tela."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricTile
          icon={<Droplets aria-hidden="true" className="h-5 w-5" />}
          label="Agua"
          tone="accent"
          value={`${metricDraft.water_ml}ml`}
        />
        <MetricTile
          icon={<Bed aria-hidden="true" className="h-5 w-5" />}
          label="Sono"
          tone="primary"
          value={minutesToHours(metricDraft.sleep_minutes)}
        />
        <MetricTile
          icon={<Smile aria-hidden="true" className="h-5 w-5" />}
          label="Humor"
          tone="success"
          value={`${metricDraft.mood_score}/5`}
        />
        <MetricTile
          icon={<Utensils aria-hidden="true" className="h-5 w-5" />}
          label="Proteina"
          tone="warning"
          value={`${mealTotals.protein}g`}
        />
      </div>

      {isLoading ? (
        <StateView
          tone="loading"
          title="Carregando saude"
          description="Buscando metricas e refeicoes de hoje."
        />
      ) : null}
      {error ? <StateView tone="error" title="Erro ao carregar saude" description={error} /> : null}

      <Surface>
        <form className="grid gap-3" onSubmit={handleMetricSubmit}>
          <SectionHeader title="Check-in diario" description={todayKey} />
          <div className="grid grid-cols-2 gap-3">
            <FieldShell label="Agua (ml)">
              <TextInput
                inputMode="numeric"
                min={0}
                onChange={(event) =>
                  setMetricDraft((current) => ({ ...current, water_ml: toNumber(event.target.value) }))
                }
                type="number"
                value={metricDraft.water_ml}
              />
            </FieldShell>
            <FieldShell label="Sono (min)">
              <TextInput
                inputMode="numeric"
                min={0}
                onChange={(event) =>
                  setMetricDraft((current) => ({ ...current, sleep_minutes: toNumber(event.target.value) }))
                }
                type="number"
                value={metricDraft.sleep_minutes}
              />
            </FieldShell>
            <FieldShell label="Humor (1-5)">
              <TextInput
                inputMode="numeric"
                max={5}
                min={1}
                onChange={(event) =>
                  setMetricDraft((current) => ({ ...current, mood_score: toNumber(event.target.value) }))
                }
                type="number"
                value={metricDraft.mood_score}
              />
            </FieldShell>
            <FieldShell label="Energia (1-5)">
              <TextInput
                inputMode="numeric"
                max={5}
                min={1}
                onChange={(event) =>
                  setMetricDraft((current) => ({ ...current, energy_score: toNumber(event.target.value) }))
                }
                type="number"
                value={metricDraft.energy_score}
              />
            </FieldShell>
            <FieldShell label="Foco (min)">
              <TextInput
                inputMode="numeric"
                min={0}
                onChange={(event) =>
                  setMetricDraft((current) => ({ ...current, focus_minutes: toNumber(event.target.value) }))
                }
                type="number"
                value={metricDraft.focus_minutes}
              />
            </FieldShell>
            <FieldShell label="Calorias">
              <TextInput
                inputMode="numeric"
                min={0}
                onChange={(event) =>
                  setMetricDraft((current) => ({ ...current, calories: toNumber(event.target.value) }))
                }
                type="number"
                value={metricDraft.calories}
              />
            </FieldShell>
          </div>
          <Button isLoading={action.isRunning} type="submit">
            Salvar check-in
          </Button>
          {action.error ? <p className="text-sm text-danger">{action.error}</p> : null}
        </form>
      </Surface>

      <Surface>
        <form className="grid gap-3" onSubmit={handleMealSubmit}>
          <SectionHeader title="Refeicao" description={`${mealTotals.calories} kcal registradas hoje.`} />
          <FieldShell label="Nome">
            <TextInput
              maxLength={80}
              onChange={(event) => setMealDraft((current) => ({ ...current, title: event.target.value }))}
              placeholder="Ex.: almoco"
              required
              value={mealDraft.title}
            />
          </FieldShell>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FieldShell label="Tipo">
              <SelectInput
                onChange={(event) =>
                  setMealDraft((current) => ({
                    ...current,
                    meal_type: event.target.value as MealDraft['meal_type'],
                  }))
                }
                value={mealDraft.meal_type}
              >
                <option value="breakfast">Cafe</option>
                <option value="lunch">Almoco</option>
                <option value="dinner">Jantar</option>
                <option value="snack">Lanche</option>
              </SelectInput>
            </FieldShell>
            <FieldShell label="Calorias">
              <TextInput
                inputMode="numeric"
                min={0}
                onChange={(event) =>
                  setMealDraft((current) => ({ ...current, calories: toNumber(event.target.value) }))
                }
                type="number"
                value={mealDraft.calories}
              />
            </FieldShell>
            <FieldShell label="Proteina (g)">
              <TextInput
                inputMode="numeric"
                min={0}
                onChange={(event) =>
                  setMealDraft((current) => ({ ...current, protein_grams: toNumber(event.target.value) }))
                }
                type="number"
                value={mealDraft.protein_grams}
              />
            </FieldShell>
          </div>
          <Button
            icon={<Plus aria-hidden="true" className="h-4 w-4" />}
            isLoading={action.isRunning}
            type="submit"
          >
            Adicionar refeicao
          </Button>
        </form>
      </Surface>

      {!isLoading && !error && meals.length === 0 ? (
        <StateView
          title="Nenhuma refeicao registrada"
          description="Adicione refeicoes para acompanhar calorias e proteina do dia."
        />
      ) : null}
      <div className="grid gap-3">
        {meals.map((meal) => (
          <Surface key={meal.id} className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-text-primary">{meal.title}</p>
                <Badge className="mt-2">{meal.meal_type}</Badge>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-text-primary">
                {meal.calories} kcal - {meal.protein_grams}g
              </p>
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
};
