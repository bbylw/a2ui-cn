import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-ink-900 text-white',
        secondary: 'border-transparent bg-mist text-ink-soft',
        outline: 'border-line-cool text-ink-soft',
        info: 'border-blue/25 bg-blue-tint text-blue-deep',
        success: 'border-green/25 bg-green-tint text-green-deep',
        warning: 'border-amber/30 bg-amber-tint text-[#8a6400]',
        danger: 'border-red/25 bg-red-tint text-red-deep',
        dark: 'border-line-dark bg-ink-800 text-ink-faint',
      },
    },
    defaultVariants: {variant: 'default'},
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({className, variant, ...props}: BadgeProps) {
  return <span className={cn(badgeVariants({variant}), className)} {...props} />;
}