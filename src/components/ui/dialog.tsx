import * as React from 'react';
import {
  Modal,
  Pressable,
  View,
  type ViewProps,
} from 'react-native';
import { X } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { OverlayBackdrop } from '../../lib/overlay';
import { useGhostTheme } from '../../theme/theme';
import { Text } from './text';

type DialogContextValue = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue>({ open: false });

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  className,
  children,
  asChild,
}: {
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}) {
  const ctx = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => ctx.onOpenChange?.(true),
    });
  }
  return (
    <Pressable className={className} onPress={() => ctx.onOpenChange?.(true)}>
      {typeof children === 'string' ? (
        <Text className="text-foreground">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

function DialogCloseButton() {
  const ctx = React.useContext(DialogContext);
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

export function DialogContent({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  const ctx = React.useContext(DialogContext);
  return (
    <Modal
      visible={ctx.open}
      transparent
      animationType="fade"
      onRequestClose={() => ctx.onOpenChange?.(false)}
    >
      <View className="flex-1 items-center justify-center px-6">
        <OverlayBackdrop intensity="light" />
        <View
          className={cn(
            'relative z-10 w-full max-w-md rounded-2xl border border-border bg-background p-6 pt-10 shadow-xl',
            className
          )}
          {...props}
        >
          <DialogCloseButton />
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function DialogHeader({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return <View className={cn('mb-4 gap-1.5', className)} {...props} />;
}

export function DialogFooter({
  className,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View className={cn('mt-6 flex-row justify-end gap-2', className)} {...props} />
  );
}

export function DialogTitle({
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

export function DialogDescription({
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

export function DialogClose({
  children,
}: {
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(DialogContext);
  if (React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => ctx.onOpenChange?.(false),
    });
  }
  return (
    <Pressable onPress={() => ctx.onOpenChange?.(false)}>
      <Text className="text-sm text-foreground">Close</Text>
    </Pressable>
  );
}
