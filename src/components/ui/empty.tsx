import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

export function Empty({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View
      className={cn('items-center justify-center gap-2 py-10', className)}
      {...props}
    />
  );
}

export function EmptyTitle({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-lg font-semibold text-foreground', className)} {...props}>
      {children}
    </Text>
  );
}

export function EmptyDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-center text-sm text-muted-foreground', className)} {...props}>
      {children}
    </Text>
  );
}
