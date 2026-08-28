import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';
import { useGhostTheme } from '../../theme/theme';

type AccordionContextValue = {
  type: 'single' | 'multiple';
  value: string | string[];
  onValueChange?: (value: string | string[]) => void;
};

const AccordionContext = React.createContext<AccordionContextValue>({
  type: 'single',
  value: '',
});

const ItemContext = React.createContext({ value: '', open: false });

export function Accordion({
  className,
  type = 'single',
  value,
  onValueChange,
  children,
  ...props
}: ViewProps & {
  className?: string;
  type?: 'single' | 'multiple';
  value: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children?: React.ReactNode;
}) {
  return (
    <AccordionContext.Provider value={{ type, value, onValueChange }}>
      <View className={cn('w-full gap-2', className)} {...props}>
        {children}
      </View>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  className,
  value,
  children,
  ...props
}: ViewProps & { className?: string; value: string; children?: React.ReactNode }) {
  const ctx = React.useContext(AccordionContext);
  const open = Array.isArray(ctx.value)
    ? ctx.value.includes(value)
    : ctx.value === value;

  return (
    <ItemContext.Provider value={{ value, open }}>
      <View className={cn('border-b border-border', className)} {...props}>
        {children}
      </View>
    </ItemContext.Provider>
  );
}

export function AccordionTrigger({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(AccordionContext);
  const item = React.useContext(ItemContext);
  const { resolvedTheme } = useGhostTheme();
  const iconColor =
    resolvedTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: item.open }}
      onPress={() => {
        if (ctx.type === 'single') {
          ctx.onValueChange?.(item.open ? '' : item.value);
          return;
        }
        const current = Array.isArray(ctx.value) ? ctx.value : [];
        ctx.onValueChange?.(
          item.open
            ? current.filter(v => v !== item.value)
            : [...current, item.value]
        );
      }}
      className={cn(
        'flex-row items-center justify-between py-4',
        className
      )}
    >
      {typeof children === 'string' ? (
        <Text className="flex-1 text-sm font-medium text-foreground">{children}</Text>
      ) : (
        children
      )}
      <ChevronDown
        size={16}
        color={iconColor}
        style={{ transform: [{ rotate: item.open ? '180deg' : '0deg' }] }}
      />
    </Pressable>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  const item = React.useContext(ItemContext);
  if (!item.open) return null;
  return (
    <View className={cn('pb-4', className)} {...props}>
      {typeof children === 'string' ? (
        <Text className="text-sm text-muted-foreground">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
