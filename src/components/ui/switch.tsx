import * as React from 'react';
import {
  Switch as RNSwitch,
  type SwitchProps as RNSwitchProps,
} from 'react-native';
import { useGhostTheme } from '../../theme/theme';

export interface SwitchProps extends RNSwitchProps {
  className?: string;
}

export function Switch({ value, ...props }: SwitchProps) {
  const { resolvedTheme } = useGhostTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <RNSwitch
      accessibilityRole="switch"
      value={value}
      trackColor={{
        false: isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)',
        true: isDark ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)',
      }}
      thumbColor={isDark ? 'hsl(240 5.9% 10%)' : 'hsl(0 0% 98%)'}
      ios_backgroundColor={isDark ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 5.9% 90%)'}
      {...props}
    />
  );
}
