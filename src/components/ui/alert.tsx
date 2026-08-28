import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Text } from './text';

const alertVariants = cva('w-full rounded-xl border p-4 shadow-sm', {
  variants: {
    variant: {
      default: 'border-border bg-background',
      destructive: 'border-destructive/50 bg-destructive/10',
    },
  },
  defaultVariants: { variant: 'default' },
});

export function Alert({
  className,
  variant,
  ...props
}: ViewProps &
  VariantProps<typeof alertVariants> & {
    className?: string;
    children?: React.ReactNode;
  }) {
  return (
    <View
      accessibilityRole="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('mb-1 text-base font-semibold text-foreground', className)} {...props}>
      {children}
    </Text>
  );
}

export function AlertDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </Text>
  );
}
