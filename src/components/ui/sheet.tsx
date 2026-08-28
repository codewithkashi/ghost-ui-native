import * as React from 'react';
import { Modal, Pressable, View, type ViewProps } from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import { OverlayBackdrop } from '../../lib/overlay';
import { useGhostTheme } from '../../theme/theme';
import { Text } from './text';

type SheetContextValue = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

const SheetContext = React.createContext<SheetContextValue>({ open: false });

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  children,
}: {
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(SheetContext);
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => ctx.onOpenChange?.(true),
    });
  }
  return (
    <Pressable onPress={() => ctx.onOpenChange?.(true)}>
      <Text className="text-foreground">{children}</Text>
    </Pressable>
  );
}

function SheetCloseButton() {
  const ctx = React.useContext(SheetContext);
  const { resolvedTheme } = useGhostTheme();
  const iconColor =
    resolvedTheme === 'dark' ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close"
      hitSlop={8}
      className="absolute right-3 top-3 z-20 h-8 w-8 items-center justify-center rounded-lg"
      onPress={() => ctx.onOpenChange?.(false)}
    >
      <X size={18} color={iconColor} />
    </Pressable>
  );
}

export function SheetContent({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  const ctx = React.useContext(SheetContext);
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={ctx.open}
      transparent
      animationType="slide"
      onRequestClose={() => ctx.onOpenChange?.(false)}
    >
      <View className="flex-1 justify-end">
        <OverlayBackdrop intensity="light" />
        <View
          className={cn(
            'relative z-10 rounded-t-3xl border border-border bg-background p-6 pt-10 shadow-2xl',
            className
          )}
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
          {...props}
        >
          <SheetCloseButton />
          <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-muted" />
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function SheetHeader({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return <View className={cn('mb-4 gap-1.5', className)} {...props} />;
}

export function SheetTitle({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-lg font-semibold text-foreground', className)} {...props}>
      {children}
    </Text>
  );
}

export function SheetDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </Text>
  );
}
