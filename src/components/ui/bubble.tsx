import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Text } from './text';

const bubbleVariants = cva('max-w-[85%] px-4 py-3 shadow-sm', {
  variants: {
    variant: {
      default: 'self-start rounded-2xl rounded-bl-md bg-accent border border-border',
      sent: 'self-end rounded-2xl rounded-br-md bg-primary',
      received:
        'self-start rounded-2xl rounded-bl-md border border-border bg-card',
    },
  },
  defaultVariants: { variant: 'default' },
});

const bubbleTextVariants = cva('text-base leading-5', {
  variants: {
    variant: {
      default: 'text-accent-foreground',
      sent: 'text-primary-foreground',
      received: 'text-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
});

export function Bubble({
  className,
  variant,
  children,
  ...props
}: ViewProps &
  VariantProps<typeof bubbleVariants> & {
    className?: string;
    children?: React.ReactNode;
  }) {
  return (
    <View className={cn(bubbleVariants({ variant }), className)} {...props}>
      {typeof children === 'string' ? (
        <Text className={bubbleTextVariants({ variant })}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
