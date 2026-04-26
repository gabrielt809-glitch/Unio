import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

import { cn } from '../utils/cn';

type FieldShellProps = {
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
};

export const FieldShell = ({ children, error, hint, label }: FieldShellProps) => (
  <label className="grid gap-2 text-sm font-medium text-text-primary">
    <span>{label}</span>
    {children}
    {error ? (
      <span className="text-xs font-normal text-danger">{error}</span>
    ) : hint ? (
      <span className="text-xs font-normal text-text-secondary">{hint}</span>
    ) : null}
  </label>
);

export const TextInput = ({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={cn(
      'min-h-11 w-full rounded-app border border-white/10 bg-background/80 px-3 text-sm text-text-primary shadow-inner shadow-black/10 transition duration-200 ease-app placeholder:text-text-secondary/65 hover:border-white/20 focus:border-accent',
      className,
    )}
    {...props}
  />
);

export const TextArea = ({ className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      'min-h-24 w-full resize-none rounded-app border border-white/10 bg-background/80 px-3 py-3 text-sm text-text-primary shadow-inner shadow-black/10 transition duration-200 ease-app placeholder:text-text-secondary/65 hover:border-white/20 focus:border-accent',
      className,
    )}
    {...props}
  />
);

export const SelectInput = ({
  className = '',
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={cn(
      'min-h-11 w-full rounded-app border border-white/10 bg-background/80 px-3 text-sm text-text-primary shadow-inner shadow-black/10 transition duration-200 ease-app hover:border-white/20 focus:border-accent',
      className,
    )}
    {...props}
  >
    {children}
  </select>
);

export const Input = TextInput;
export const Textarea = TextArea;
export const Select = SelectInput;
