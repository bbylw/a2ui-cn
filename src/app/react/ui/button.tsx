import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue/60 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-ink-900 text-white hover:bg-ink-700 shadow-sm',
        primary: 'bg-blue text-white hover:bg-blue-deep shadow-sm',
        outline: 'border border-line-cool bg-white text-ink hover:bg-mist hover:border-blue/40',
        ghost: 'text-ink-soft hover:bg-mist hover:text-ink',
        destructive: 'bg-red text-white hover:bg-red/90',
        darkOutline: 'border border-line-dark bg-transparent text-ink-faint hover:text-white hover:border-blue-bright',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {variant: 'default', size: 'default'},
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({className, variant, size, ...props}: ButtonProps) {
  return <button className={cn(buttonVariants({variant, size, className}))} {...props} />;
}

export {buttonVariants};