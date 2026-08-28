import * as React from 'react';
import { Text as RNText, View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'flex-row items-center rounded-full border px-3 py-1',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary shadow-sm',
        secondary: 'border-border bg-secondary',
        destructive: 'border-transparent bg-destructive',
        outline: 'border-border bg-background',
        accent: 'border-transparent bg-accent',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

const badgeTextVariants = cva('text-xs font-bold tracking-wide', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      accent: 'text-accent-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
});

type BadgeProps = ViewProps &
  VariantProps<typeof badgeVariants> & {
    className?: string;
    textClassName?: string;
    children?: React.ReactNode;
  };

export function Badge({
  className,
  textClassName,
  variant,
  children,
  ...props
}: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <RNText className={cn(badgeTextVariants({ variant }), textClassName)}>
          {children}
        </RNText>
      ) : (
        children
      )}
    </View>
  );
}
