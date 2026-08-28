import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { ChevronRight, MoreHorizontal } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { useGhostTheme } from '../../theme/theme';
import { Text } from './text';

export function Breadcrumb({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View accessibilityRole="header" className={cn('w-full', className)} {...props} />
  );
}

export function BreadcrumbList({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View
      className={cn('flex-row flex-wrap items-center gap-1.5', className)}
      {...props}
    />
  );
}

export function BreadcrumbItem({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return <View className={cn('flex-row items-center gap-1.5', className)} {...props} />;
}

export function BreadcrumbLink({
  className,
  children,
  onPress,
}: {
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Text className={cn('text-sm text-muted-foreground', className)}>
        {children}
      </Text>
    </Pressable>
  );
}

export function BreadcrumbPage({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('text-sm font-normal text-foreground', className)}
      {...props}
    >
      {children}
    </Text>
  );
}

export function BreadcrumbSeparator({
  className,
}: {
  className?: string;
}) {
  const { resolvedTheme } = useGhostTheme();
  const color =
    resolvedTheme === 'dark' ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)';
  return (
    <View className={cn('px-0.5', className)}>
      <ChevronRight size={14} color={color} />
    </View>
  );
}

export function BreadcrumbEllipsis({
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
