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
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/75 p-4 pb-[calc(1rem+var(--safe-bottom))] backdrop-blur-sm sm:place-items-center">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-panel border border-white/10 bg-elevated p-4 shadow-panel animate-unio-enter"
      >
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-app bg-danger/10 text-danger">
            <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">{title}</h2>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{description}</p>
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
