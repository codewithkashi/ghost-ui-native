import * as React from 'react';
import { Modal, Pressable, View, type ViewProps } from 'react-native';
import { X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import { OverlayBackdrop } from '../../lib/overlay';
import { useGhostTheme } from '../../theme/theme';
import { Text } from './text';

type DrawerSide = 'left' | 'right' | 'bottom';

type DrawerContextValue = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  side: DrawerSide;
};

const DrawerContext = React.createContext<DrawerContextValue>({
  open: false,
  side: 'right',
});

export function Drawer({
  open,
  onOpenChange,
  side = 'right',
  children,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: DrawerSide;
  children?: React.ReactNode;
}) {
  return (
    <DrawerContext.Provider value={{ open, onOpenChange, side }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function DrawerTrigger({
  children,
  asChild,
}: {
  children?: React.ReactNode;
  asChild?: boolean;
}) {
  const ctx = React.useContext(DrawerContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => ctx.onOpenChange?.(true),
    });
  }
  return (
    <Pressable onPress={() => ctx.onOpenChange?.(true)}>
      {typeof children === 'string' ? (
        <Text className="text-foreground">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

function DrawerCloseButton() {
  const ctx = React.useContext(DrawerContext);
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

export function DrawerContent({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  const ctx = React.useContext(DrawerContext);
  const insets = useSafeAreaInsets();

  const sideClass =
    ctx.side === 'left'
      ? 'absolute left-0 top-0 h-full w-[85%] max-w-sm rounded-r-2xl shadow-2xl'
      : ctx.side === 'right'
        ? 'absolute right-0 top-0 h-full w-[85%] max-w-sm rounded-l-2xl shadow-2xl'
        : 'absolute bottom-0 w-full rounded-t-3xl shadow-2xl';

  return (
    <Modal
      visible={ctx.open}
      transparent
      animationType="slide"
      onRequestClose={() => ctx.onOpenChange?.(false)}
    >
      <View className="flex-1">
        <OverlayBackdrop intensity="light" />
        <View
          className={cn(
            'z-10 border border-border bg-background p-6 pt-10',
            sideClass,
            className
          )}
          style={{
            paddingBottom:
              ctx.side === 'bottom' ? Math.max(insets.bottom, 24) : insets.bottom + 16,
            paddingTop: Math.max(insets.top, 40),
          }}
          {...props}
        >
          <DrawerCloseButton />
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function DrawerHeader({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return <View className={cn('mb-4 gap-1.5', className)} {...props} />;
}

export function DrawerTitle({
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

export function DrawerDescription({
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

export function DrawerFooter({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View className={cn('mt-6 flex-row justify-end gap-2', className)} {...props} />
  );
}
