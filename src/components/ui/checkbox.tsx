import * as React from 'react';
import { Pressable, View, type PressableProps } from 'react-native';
import { Check } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { useGhostTheme } from '../../theme/theme';

type CheckboxProps = Omit<PressableProps, 'onPress'> & {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({
  className,
  checked = false,
  onCheckedChange,
  disabled,
  ...props
}: CheckboxProps) {
  const { resolvedTheme } = useGhostTheme();
  const iconColor = resolvedTheme === 'dark' ? 'hsl(240 5.9% 10%)' : 'hsl(0 0% 98%)';

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onCheckedChange?.(!checked)}
      className={cn(
        'h-5 w-5 items-center justify-center rounded-sm border border-primary',
        checked ? 'bg-primary' : 'bg-background',
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {checked ? <Check size={14} color={iconColor} strokeWidth={3} /> : <View />}
    </Pressable>
  );
}
