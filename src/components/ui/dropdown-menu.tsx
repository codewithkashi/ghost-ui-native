import * as React from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { cn } from '../../lib/utils';
import {
  getAnchoredPosition,
  DismissLayer,
  mergeEventHandlers,
  useAnchorTrigger,
} from '../../lib/overlay';
import { Text } from './text';
import { Separator } from './separator';

type DropdownMenuContextValue = {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerRef: React.RefObject<View | null>;
  measureTrigger: (onMeasured?: () => void) => void;
  layout: ReturnType<typeof useAnchorTrigger>['layout'];
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(
  null
);

export function DropdownMenu({
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
    <DropdownMenuContext.Provider
      value={{
        open,
        onOpenChange,
        triggerRef,
        layout,
        measureTrigger: measure,
      }}
    >
      <View className="relative">{children}</View>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({
  children,
  asChild,
}: {
  children?: React.ReactNode;
  asChild?: boolean;
}) {
  const ctx = React.useContext(DropdownMenuContext)!;

  const openMenu = () => {
    ctx.measureTrigger(() => ctx.onOpenChange?.(true));
  };

  if (asChild && React.isValidElement(children)) {
    return (
      <View ref={ctx.triggerRef} collapsable={false}>
        {React.cloneElement(children as React.ReactElement<any>, {
          onPress: mergeEventHandlers(
            (children as React.ReactElement<any>).props.onPress,
            openMenu
          ),
        })}
      </View>
    );
  }

  return (
    <Pressable ref={ctx.triggerRef} onPress={openMenu}>
      {children}
    </Pressable>
  );
}

export function DropdownMenuContent({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(DropdownMenuContext)!;

  if (!ctx.open || !ctx.layout) return null;

  const anchor = getAnchoredPosition(ctx.layout, { maxHeight: 280 });

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
            'absolute z-10 overflow-hidden rounded-xl border border-border bg-background p-1 shadow-lg',
            className
          )}
          style={{
            top: anchor.top,
            left: anchor.left,
            width: anchor.width,
            maxHeight: anchor.maxHeight,
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function DropdownMenuItem({
  className,
  children,
  onPress,
  destructive,
}: {
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  destructive?: boolean;
}) {
  const ctx = React.useContext(DropdownMenuContext)!;
  return (
    <Pressable
      accessibilityRole="menuitem"
      onPress={() => {
        onPress?.();
        ctx.onOpenChange?.(false);
      }}
      className={cn(
        'flex-row items-center rounded-sm px-3 py-2.5 active:bg-accent',
        className
      )}
    >
      {typeof children === 'string' ? (
        <Text
          className={cn(
            'text-sm',
            destructive ? 'text-destructive' : 'text-foreground'
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

export function DropdownMenuLabel({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <View className={cn('px-3 py-2', className)}>
      <Text className="text-sm font-semibold text-foreground">{children}</Text>
    </View>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <Separator className={cn('my-1', className)} />;
}
