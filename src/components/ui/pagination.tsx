import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { useGhostTheme } from '../../theme/theme';
import { Text } from './text';

export function Pagination({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View
      accessibilityRole="adjustable"
      className={cn('mx-auto w-full', className)}
      {...props}
    />
  );
}

export function PaginationContent({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View className={cn('flex-row flex-wrap items-center gap-1', className)} {...props} />
  );
}

export function PaginationItem({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return <View className={cn('', className)} {...props} />;
}

export function PaginationLink({
  className,
  children,
  isActive,
  onPress,
}: {
  className?: string;
  children?: React.ReactNode;
  isActive?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        'h-9 min-w-9 items-center justify-center rounded-md border px-3',
        isActive
          ? 'border-input bg-background'
          : 'border-transparent bg-transparent',
        className
      )}
    >
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text
          className={cn(
            'text-sm',
            isActive ? 'text-foreground' : 'text-muted-foreground'
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

export function PaginationPrevious({
  className,
  onPress,
  label = 'Previous',
}: {
  className?: string;
  onPress?: () => void;
  label?: string;
}) {
  const { resolvedTheme } = useGhostTheme();
  const color =
    resolvedTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={cn(
        'h-9 flex-row items-center gap-1 rounded-md border border-transparent px-2.5',
        className
      )}
    >
      <ChevronLeft size={16} color={color} />
      <Text className="text-sm text-muted-foreground">{label}</Text>
    </Pressable>
  );
}

export function PaginationNext({
  className,
  onPress,
  label = 'Next',
}: {
  className?: string;
  onPress?: () => void;
  label?: string;
}) {
  const { resolvedTheme } = useGhostTheme();
  const color =
    resolvedTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={cn(
        'h-9 flex-row items-center gap-1 rounded-md border border-transparent px-2.5',
        className
      )}
    >
      <Text className="text-sm text-muted-foreground">{label}</Text>
      <ChevronRight size={16} color={color} />
    </Pressable>
  );
}

export function PaginationEllipsis({
  className,
}: {
  className?: string;
}) {
  const { resolvedTheme } = useGhostTheme();
  const color =
    resolvedTheme === 'dark' ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)';
  return (
    <View className={cn('h-9 w-9 items-center justify-center', className)}>
      <MoreHorizontal size={16} color={color} />
    </View>
  );
}
