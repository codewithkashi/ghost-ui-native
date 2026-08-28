import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

type BoxProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export function Card({ className, ...props }: BoxProps) {
  return (
    <View
      className={cn(
        'rounded-2xl border border-border bg-card p-5 shadow-md',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: BoxProps) {
  return <View className={cn('mb-3 flex-col gap-1.5', className)} {...props} />;
}

export function CardTitle({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        'text-lg font-semibold tracking-tight text-card-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-sm leading-5 text-muted-foreground', className)} {...props}>
      {children}
    </Text>
  );
}

export function CardContent({ className, ...props }: BoxProps) {
  return <View className={cn('gap-3', className)} {...props} />;
}

export function CardFooter({ className, ...props }: BoxProps) {
  return (
    <View className={cn('mt-4 flex-row items-center gap-2', className)} {...props} />
  );
}
