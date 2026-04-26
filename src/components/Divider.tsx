import type { HTMLAttributes } from 'react';

import { cn } from '../utils/cn';

export const Divider = ({ className, ...props }: HTMLAttributes<HTMLHRElement>) => (
  <hr className={cn('border-0 border-t border-white/10', className)} {...props} />
);
