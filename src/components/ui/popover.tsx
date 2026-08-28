import * as React from 'react';
import { Modal, Pressable, View, type ViewProps } from 'react-native';
import { X } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import {
  getAnchoredPosition,
  DismissLayer,
  mergeEventHandlers,
  useAnchorTrigger,
} from '../../lib/overlay';
import { useGhostTheme } from '../../theme/theme';
import { Text } from './text';

type PopoverContextValue = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerRef: React.RefObject<View | null>;
  measureTrigger: (onMeasured?: () => void) => void;
  layout: ReturnType<typeof useAnchorTrigger>['layout'];
};

const PopoverContext = React.createContext<PopoverContextValue | null>(null);

export function Popover({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  const { triggerRef, layout, measure } = useAnchorTrigger();

  return (
    <PopoverContext.Provider
      value={{
        open,
        onOpenChange,
        triggerRef,
        layout,
        measureTrigger: measure,
      }}
    >
      <View className="relative w-full">{children}</View>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({
  children,
  asChild,
}: {
  children?: React.ReactNode;
  asChild?: boolean;
}) {
  const ctx = React.useContext(PopoverContext)!;

  const openPopover = () => {
    ctx.measureTrigger(() => ctx.onOpenChange?.(true));
  };

  if (asChild && React.isValidElement(children)) {
    return (
      <View ref={ctx.triggerRef} collapsable={false}>
        {React.cloneElement(children as React.ReactElement<any>, {
          onPress: mergeEventHandlers(
            (children as React.ReactElement<any>).props.onPress,
            openPopover
          ),
        })}
      </View>
    );
  }

  return (
    <Pressable ref={ctx.triggerRef} onPress={openPopover}>
      {typeof children === 'string' ? (
        <Text className="text-foreground">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

function PopoverCloseButton() {
  const ctx = React.useContext(PopoverContext)!;
  const { resolvedTheme } = useGhostTheme();
  const iconColor =
    resolvedTheme === 'dark' ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close"
      hitSlop={8}
      className="absolute right-2 top-2 z-20 h-7 w-7 items-center justify-center rounded-lg"
      onPress={() => ctx.onOpenChange?.(false)}
    >
      <X size={16} color={iconColor} />
    </Pressable>
  );
}

export function PopoverContent({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  const ctx = React.useContext(PopoverContext)!;

  if (!ctx.open || !ctx.layout) return null;

  const anchor = getAnchoredPosition(ctx.layout, { maxHeight: 320 });

  return (
    <Modal
      visible={ctx.open}
      transparent
      animationType="fade"
      onRequestClose={() => ctx.onOpenChange?.(false)}
    >
      <View className="flex-1" pointerEvents="box-none">
        <DismissLayer onPress={() => ctx.onOpenChange?.(false)} />
        <View
          pointerEvents="auto"
          className={cn(
            'absolute z-10 rounded-xl border border-border bg-background p-4 pt-8 shadow-lg',
            className
          )}
          style={{
            top: anchor.top,
            left: anchor.left,
            width: anchor.width,
            maxHeight: anchor.maxHeight,
          }}
          {...props}
        >
          <PopoverCloseButton />
          {children}
        </View>
      </View>
    </Modal>
  );
}
