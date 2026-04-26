import type { HTMLAttributes } from 'react';

import { cn } from '../utils/cn';

export const Skeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    aria-hidden="true"
    className={cn('animate-unio-pulse rounded-app bg-white/[0.08]', className)}
    {...props}
  />
);

export const SkeletonStack = () => (
  <div className="grid gap-3 rounded-panel border border-white/10 bg-surface p-4">
    <Skeleton className="h-5 w-2/3" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-4/5" />
  </div>
);
