import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

export function Marker({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View
      className={cn('my-4 flex-row items-center justify-center', className)}
      accessibilityRole="text"
      {...props}
    >
      {children ? (
        typeof children === 'string' ? (
          <View className="rounded-full border border-border bg-accent px-3 py-1">
            <Text className="text-xs font-medium text-accent-foreground">
              {children}
            </Text>
          </View>
        ) : (
          children
        )
      ) : null}
    </View>
  );
}
