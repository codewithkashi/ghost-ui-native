import * as React from 'react';
import { ScrollView, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

export function Table({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className={cn('w-full', className)} {...props}>
        {children}
      </View>
    </ScrollView>
  );
}

export function TableHeader({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return <View className={cn('border-b border-border', className)} {...props} />;
}

export function TableBody({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return <View className={cn('', className)} {...props} />;
}

export function TableFooter({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View
      className={cn('border-t border-border bg-muted/50', className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View
      className={cn('flex-row border-b border-border', className)}
      {...props}
    />
  );
}

export function TableHead({
  className,
  children,
  style,
  ...props
}: ViewProps & {
  className?: string;
  children?: React.ReactNode;
  style?: { width?: number; flex?: number };
}) {
  return (
    <View
      className={cn('h-12 justify-center px-4', className)}
      style={style}
      {...props}
    >
      <Text className="text-left text-sm font-medium text-muted-foreground">
        {children}
      </Text>
    </View>
  );
}

export function TableCell({
  className,
  children,
  style,
  ...props
}: ViewProps & {
  className?: string;
  children?: React.ReactNode;
  style?: { width?: number; flex?: number };
}) {
  return (
    <View className={cn('justify-center px-4 py-3', className)} style={style} {...props}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text className="text-sm text-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function TableCaption({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('mt-4 text-sm text-muted-foreground', className)} {...props}>
      {children}
    </Text>
  );
}
