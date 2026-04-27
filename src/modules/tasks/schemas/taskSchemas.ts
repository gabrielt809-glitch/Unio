import { z } from 'zod';

const dateKeySchema = z
  .string()
  .trim()
  .refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), {
    message: 'Use uma data valida.',
  });

export const taskSchema = z.object({
  title: z.string().trim().min(1, 'Informe o titulo da tarefa.').max(120, 'Use um titulo menor.'),
  description: z.string().trim().max(500, 'Use uma descricao menor.'),
  dueDate: dateKeySchema,
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().trim().max(40, 'Use uma categoria menor.'),
});

export type TaskSchemaValues = z.infer<typeof taskSchema>;
