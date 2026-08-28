import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

type ToggleProps = {
  className?: string;
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

export function Toggle({
  className,
  pressed = false,
  onPressedChange,
  disabled,
  children,
}: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: pressed, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onPressedChange?.(!pressed)}
      className={cn(
        'h-10 items-center justify-center rounded-xl border px-4 shadow-sm',
        pressed
          ? 'border-primary bg-primary/10'
          : 'border-input bg-background',
        disabled && 'opacity-50',
        className
      )}
    >
      {typeof children === 'string' ? (
        <Text
          className={cn(
            'text-sm',
            pressed ? 'font-semibold text-primary' : 'font-medium text-foreground'
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

type ToggleGroupContextValue = {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange?: (value: string | string[]) => void;
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  type: 'single',
  value: '',
});

export function ToggleGroup({
  className,
  type = 'single',
  value,
  onValueChange,
  children,
  ...props
}: ViewProps & {
  className?: string;
  type?: 'single' | 'multiple';
  value: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children?: React.ReactNode;
}) {
  return (
    <ToggleGroupContext.Provider value={{ type, value, onValueChange }}>
      <View className={cn('flex-row flex-wrap gap-1 rounded-xl bg-muted p-1', className)} {...props}>
        {children}
      </View>
    </ToggleGroupContext.Provider>
  );
}

export function ToggleGroupItem({
  className,
  value,
  children,
}: {
  className?: string;
  value: string;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(ToggleGroupContext);
  const pressed = Array.isArray(ctx.value)
    ? ctx.value.includes(value)
    : ctx.value === value;

  return (
    <Toggle
      className={className}
      pressed={pressed}
      onPressedChange={() => {
        if (ctx.type === 'single') {
          ctx.onValueChange?.(value);
          return;
        }
        const current = Array.isArray(ctx.value) ? ctx.value : [];
        ctx.onValueChange?.(
          pressed ? current.filter(v => v !== value) : [...current, value]
        );
      }}
    >
      {children}
    </Toggle>
  );
}
