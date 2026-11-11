import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import {cn} from '../lib/utils';

export const Tabs = TabsPrimitive.Root;

export function TabsList({className, ...props}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex h-9 items-center justify-center rounded-lg bg-mist p-1 text-ink-soft', className)}
      {...props}
    />
  );
}

export function TabsTrigger({className, ...props}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-blue/60 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-ink data-[state=active]:shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({className, ...props}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('mt-3 outline-none focus-visible:ring-2 focus-visible:ring-blue/60', className)}
      {...props}
    />
  );
}