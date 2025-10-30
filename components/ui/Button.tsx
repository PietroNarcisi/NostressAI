'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ring-offset-neutral-25 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default:
          'bg-primary-600 text-white shadow-[0_18px_32px_-20px_rgba(79,122,117,0.8)] hover:bg-primary-500 focus-visible:bg-primary-500 dark:bg-primary-500 dark:hover:bg-primary-400',
        secondary:
          'bg-accent-100 text-neutral-700 hover:bg-accent-200 focus-visible:bg-accent-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700',
        destructive: 'bg-danger text-white hover:bg-danger/90 focus-visible:bg-danger/90',
        outline:
          'border border-primary-200 text-primary-700 bg-white hover:bg-primary-50 focus-visible:bg-primary-50 dark:border-primary-700/40 dark:text-primary-200 dark:bg-transparent dark:hover:bg-primary-900/40',
        ghost:
          'text-neutral-600 hover:bg-neutral-50 focus-visible:bg-neutral-50 dark:text-neutral-200 dark:hover:bg-neutral-800/60',
        link: 'text-primary-600 underline-offset-4 hover:underline dark:text-primary-300',
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };