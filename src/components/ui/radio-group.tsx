import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

type RadioGroupContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export function RadioGroup({
  className,
  value,
  onValueChange,
  disabled,
  children,
  ...props
}: ViewProps & {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange, disabled }}>
      <View
        accessibilityRole="radiogroup"
        className={cn('gap-3', className)}
        {...props}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({
  className,
  value,
  label,
  ...props
}: {
  className?: string;
  value: string;
  label?: string;
} & Omit<React.ComponentProps<typeof Pressable>, 'children'>) {
  const ctx = React.useContext(RadioGroupContext);
  const selected = ctx.value === value;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !!ctx.disabled }}
      disabled={ctx.disabled}
      onPress={() => ctx.onValueChange?.(value)}
      className={cn('flex-row items-center gap-3', className)}
      {...props}
    >
      <View
        className={cn(
          'h-5 w-5 items-center justify-center rounded-full border border-primary',
          selected ? 'bg-primary' : 'bg-background'
        )}
      >
        {selected ? <View className="h-2 w-2 rounded-full bg-primary-foreground" /> : null}
      </View>
      {label ? <Text className="text-sm text-foreground">{label}</Text> : null}
    </Pressable>
  );
}
