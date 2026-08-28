import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

type CollapsibleContextValue = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

const CollapsibleContext = React.createContext<CollapsibleContextValue>({
  open: false,
});

export function Collapsible({
  className,
  open = false,
  onOpenChange,
  children,
  ...props
}: ViewProps & {
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange }}>
      <View className={cn('w-full', className)} {...props}>
        {children}
      </View>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(CollapsibleContext);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: ctx.open }}
      onPress={() => ctx.onOpenChange?.(!ctx.open)}
      className={cn('py-2', className)}
    >
      {typeof children === 'string' ? (
        <Text className="text-sm font-medium text-foreground">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function CollapsibleContent({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  const ctx = React.useContext(CollapsibleContext);
  if (!ctx.open) return null;
  return (
    <View className={cn('pt-1', className)} {...props}>
      {children}
    </View>
  );
}
