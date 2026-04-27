const taskDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
});

export const formatTaskDueDate = (dateKey: string | null): string => {
  if (!dateKey) {
    return 'Sem data';
  }

  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return taskDateFormatter.format(date).replace('.', '');
};
