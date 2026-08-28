import * as React from 'react';
import {
  ScrollView,
  View,
  type ScrollViewProps,
  type ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';

export function MessageScroller({
  className,
  contentContainerClassName,
  children,
  ...props
}: ScrollViewProps & {
  className?: string;
  contentContainerClassName?: string;
  children?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className={cn('flex-1', className)}
      contentContainerClassName={cn('gap-1 px-4 py-3', contentContainerClassName)}
      contentContainerStyle={{ paddingBottom: insets.bottom + 8 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

export function MessageScrollerFooter({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={cn('border-t border-border bg-background px-4 py-3', className)}
      style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      {...props}
    >
      {children}
    </View>
  );
}
