import * as React from 'react';
import { ActivityIndicator, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { useGhostTheme } from '../../theme/theme';

export function Spinner({
  className,
  size = 'default',
  ...props
}: ViewProps & {
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}) {
  const { resolvedTheme } = useGhostTheme();
  const color =
    resolvedTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 5.9% 10%)';
  const indicatorSize = size === 'sm' ? 'small' : 'large';

  return (
    <View
      className={cn('items-center justify-center', className)}
      accessibilityRole="progressbar"
      {...props}
    >
      <ActivityIndicator size={indicatorSize} color={color} />
    </View>
  );
}
