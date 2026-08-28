import * as React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { cn } from '../../lib/utils';
import {
  getAnchoredPosition,
  DismissLayer,
  mergeEventHandlers,
  useAnchorTrigger,
} from '../../lib/overlay';
import { Text } from './text';

type TooltipContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<View | null>;
  measureTrigger: (onMeasured?: () => void) => void;
  layout: ReturnType<typeof useAnchorTrigger>['layout'];
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export function TooltipProvider({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const { triggerRef, layout, measure } = useAnchorTrigger();

  return (
    <TooltipContext.Provider
      value={{
        open,
        setOpen,
        triggerRef,
        layout,
        measureTrigger: measure,
      }}
    >
      <View className="relative">{children}</View>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
  asChild,
}: {
  children?: React.ReactNode;
  asChild?: boolean;
}) {
  const ctx = React.useContext(TooltipContext)!;

  const toggle = () => {
    if (ctx.open) {
      ctx.setOpen(false);
      return;
    }
    ctx.measureTrigger(() => ctx.setOpen(true));
  };

  if (asChild && React.isValidElement(children)) {
    return (
      <View ref={ctx.triggerRef} collapsable={false}>
        {React.cloneElement(children as React.ReactElement<any>, {
          onPress: mergeEventHandlers(
            (children as React.ReactElement<any>).props.onPress,
            toggle
          ),
        })}
      </View>
    );
  }

  return (
    <Pressable ref={ctx.triggerRef} onPress={toggle}>
      {children}
    </Pressable>
  );
}

export function TooltipContent({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(TooltipContext)!;

  if (!ctx.open || !ctx.layout) return null;

  const anchor = getAnchoredPosition(ctx.layout, { maxHeight: 120, gap: 6 });

  return (
    <Modal
      visible={ctx.open}
      transparent
      animationType="fade"
      onRequestClose={() => ctx.setOpen(false)}
    >
      <View className="flex-1" pointerEvents="box-none">
        <DismissLayer onPress={() => ctx.setOpen(false)} />
        <View
          pointerEvents="auto"
          className={cn(
            'absolute z-10 rounded-xl border border-border bg-background px-3 py-1.5 shadow-lg',
            className
          )}
          style={{
            top: anchor.top,
            left: anchor.left,
            minWidth: Math.min(anchor.width, 200),
            maxWidth: Math.max(anchor.width, 220),
          }}
        >
          {typeof children === 'string' ? (
            <Text className="text-sm text-foreground">{children}</Text>
          ) : (
            children
          )}
        </View>
      </View>
    </Modal>
  );
}
