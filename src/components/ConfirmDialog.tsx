import { AlertTriangle } from 'lucide-react';

import { Button } from './Button';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDialog = ({
  confirmLabel,
  description,
  onCancel,
  onConfirm,
  open,
  title,
}: ConfirmDialogProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-end overflow-x-hidden bg-black/75 p-4 pb-[calc(1rem+var(--safe-bottom))] backdrop-blur-sm sm:place-items-center">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-[calc(100vw-2rem)] rounded-panel border border-white/10 bg-elevated p-4 shadow-panel animate-unio-enter sm:max-w-sm"
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-app bg-danger/10 text-danger">
            <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="break-words text-base font-bold text-text-primary">{title}</h2>
            <p className="mt-1 break-words text-sm leading-6 text-text-secondary">{description}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
