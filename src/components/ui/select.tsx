import * as React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { getAnchoredPosition, DismissLayer } from '../../lib/overlay';
import { Text } from './text';
import { useGhostTheme } from '../../theme/theme';

type TriggerLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type SelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  label?: string;
  setLabel: (label: string) => void;
  triggerLayout: TriggerLayout | null;
  setTriggerLayout: (layout: TriggerLayout | null) => void;
  triggerRef: React.RefObject<View | null>;
};

const SelectContext = React.createContext<SelectContextValue | null>(null);

const MAX_CONTENT_HEIGHT = 240;

export function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState<string | undefined>();
  const [triggerLayout, setTriggerLayout] =
    React.useState<TriggerLayout | null>(null);
  const triggerRef = React.useRef<View>(null);

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange,
        open,
        setOpen,
        label,
        setLabel,
        triggerLayout,
        setTriggerLayout,
        triggerRef,
      }}
    >
      <View className="relative w-full">{children}</View>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  className,
  placeholder = 'Select…',
}: {
  className?: string;
  placeholder?: string;
}) {
  const ctx = React.useContext(SelectContext)!;
  const { resolvedTheme } = useGhostTheme();
  const iconColor =
    resolvedTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)';

  const openMenu = () => {
    ctx.triggerRef.current?.measureInWindow((x, y, width, height) => {
      ctx.setTriggerLayout({ x, y, width, height });
      ctx.setOpen(true);
    });
  };

  return (
    <Pressable
      ref={ctx.triggerRef}
      accessibilityRole="button"
      accessibilityState={{ expanded: ctx.open }}
      onPress={openMenu}
      className={cn(
        'h-11 w-full flex-row items-center justify-between rounded-xl border border-input bg-background px-3 shadow-sm',
        ctx.open && 'border-ring',
        className
      )}
    >
      <Text className="text-sm text-foreground">
        {ctx.label || placeholder}
      </Text>
      <ChevronDown
        size={16}
        color={iconColor}
        style={{ transform: [{ rotate: ctx.open ? '180deg' : '0deg' }] }}
      />
    </Pressable>
  );
}

export function SelectContent({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext)!;
  const layout = ctx.triggerLayout;

  if (!ctx.open || !layout) return null;

  const anchor = getAnchoredPosition(layout, { maxHeight: MAX_CONTENT_HEIGHT });

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
          pointerEvents="box-none"
          className={cn(
            'absolute z-10 overflow-hidden rounded-xl border border-border bg-background shadow-lg',
            className
          )}
          style={{
            top: anchor.top,
            left: anchor.left,
            width: anchor.width,
            maxHeight: anchor.maxHeight,
            zIndex: 10,
            elevation: 8,
          }}
        >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled
          showsVerticalScrollIndicator
        >
          <View className="p-1">{children}</View>
        </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function SelectItem({
  value,
  children,
  className,
}: {
  value: string;
  children: string;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext)!;
  const selected = ctx.value === value;
  return (
    <Pressable
      accessibilityRole="menuitem"
      accessibilityState={{ selected }}
      onPress={() => {
        ctx.onValueChange?.(value);
        ctx.setLabel(children);
        ctx.setOpen(false);
      }}
      className={cn(
        'rounded-sm px-3 py-2',
        selected ? 'bg-accent' : 'bg-transparent',
        className
      )}
    >
      <Text className="text-sm text-foreground">{children}</Text>
    </Pressable>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext)!;
  return (
    <Text className="text-sm text-foreground">
      {ctx.label || placeholder || 'Select…'}
    </Text>
  );
}
