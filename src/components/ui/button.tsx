import * as React from 'react';
import { Pressable, Text as RNText, type PressableProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-xl active:opacity-95 disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary shadow-md',
        destructive: 'bg-destructive shadow-md',
        outline: 'border border-input bg-background',
        secondary: 'border border-border bg-secondary',
        ghost: 'bg-transparent',
        link: 'bg-transparent',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3.5',
        lg: 'h-12 rounded-xl px-8',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

const buttonTextVariants = cva('text-base font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-destructive-foreground',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      link: 'text-primary underline',
    },
    size: {
      default: '',
      sm: 'text-sm',
      lg: 'text-base',
      icon: '',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

type Props = PressableProps &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    textClassName?: string;
  };

export const Button = React.forwardRef<
  React.ComponentRef<typeof Pressable>,
  Props
>(
  (
    { children, className, textClassName, variant, size, disabled, style, ...props },
    ref
  ) => (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={cn(buttonVariants({ variant, size }), className)}
      style={state => [
        typeof style === 'function' ? style(state) : style,
        { transform: [{ scale: state.pressed ? 0.98 : 1 }] },
      ]}
      {...props}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <RNText
          className={cn(buttonTextVariants({ variant, size }), textClassName)}
        >
          {children}
        </RNText>
      ) : (
        children
      )}
    </Pressable>
  )
);

Button.displayName = 'Button';
