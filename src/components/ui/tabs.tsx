import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

type TabsContextValue = {
  value: string;
  onValueChange?: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue>({ value: '' });

export function Tabs({
  className,
  value,
  onValueChange,
  children,
  ...props
}: ViewProps & {
  className?: string;
  value: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <View className={cn('w-full gap-3', className)} {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View
      className={cn(
        'h-11 flex-row items-center rounded-xl bg-muted p-1',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export function TabsTrigger({
  className,
  value,
  children,
}: {
  className?: string;
  value: string;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={() => ctx.onValueChange?.(value)}
      className={cn(
        'h-9 flex-1 items-center justify-center rounded-lg px-3',
        active ? 'bg-background shadow-sm' : 'bg-transparent',
        className
      )}
    >
      <Text
        className={cn(
          'text-sm font-semibold',
          active ? 'text-primary' : 'text-muted-foreground'
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export function TabsContent({
  className,
  value,
  children,
  ...props
}: ViewProps & {
  className?: string;
  value: string;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return (
    <View className={cn('w-full', className)} {...props}>
      {children}
    </View>
  );
}
