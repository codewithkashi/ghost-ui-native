import * as React from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  View,
  type ListRenderItemInfo,
  type ViewProps,
  type ViewToken,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { useGhostTheme } from '../../theme/theme';

type CarouselContextValue = {
  index: number;
  setIndex: (index: number) => void;
  count: number;
  setCount: (count: number) => void;
  listRef: React.RefObject<FlatList<number> | null>;
  width: number;
};

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

export function Carousel({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  const [index, setIndex] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const listRef = React.useRef<FlatList<number>>(null);
  const width = Dimensions.get('window').width;

  return (
    <CarouselContext.Provider
      value={{ index, setIndex, count, setCount, listRef, width }}
    >
      <View className={cn('relative w-full', className)} {...props}>
        {children}
      </View>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const ctx = React.useContext(CarouselContext)!;
  const items = React.Children.toArray(children);

  React.useEffect(() => {
    ctx.setCount(items.length);
  }, [items.length, ctx]);

  const onViewableItemsChanged = React.useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) {
        ctx.setIndex(viewableItems[0].index);
      }
    }
  ).current;

  const data = React.useMemo(
    () => items.map((_, i) => i),
    [items.length]
  );

  const renderItem = ({ item }: ListRenderItemInfo<number>) => (
    <View style={{ width: ctx.width }}>{items[item]}</View>
  );

  return (
    <View className={className}>
      <FlatList
        ref={ctx.listRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => String(item)}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
    </View>
  );
}

export function CarouselItem({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View className={cn('px-4', className)} {...props}>
      {children}
    </View>
  );
}

export function CarouselPrevious({
  className,
  onPress,
}: {
  className?: string;
  onPress?: () => void;
}) {
  const ctx = React.useContext(CarouselContext)!;
  const { resolvedTheme } = useGhostTheme();
  const color =
    resolvedTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)';
  const disabled = ctx.index <= 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Previous slide"
      disabled={disabled}
      onPress={() => {
        const next = Math.max(0, ctx.index - 1);
        ctx.listRef.current?.scrollToIndex({ index: next, animated: true });
        ctx.setIndex(next);
        onPress?.();
      }}
      className={cn(
        'absolute left-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90',
        disabled && 'opacity-40',
        className
      )}
    >
      <ChevronLeft size={16} color={color} />
    </Pressable>
  );
}

export function CarouselNext({
  className,
  onPress,
}: {
  className?: string;
  onPress?: () => void;
}) {
  const ctx = React.useContext(CarouselContext)!;
  const { resolvedTheme } = useGhostTheme();
  const color =
    resolvedTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)';
  const disabled = ctx.index >= ctx.count - 1;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Next slide"
      disabled={disabled}
      onPress={() => {
        const next = Math.min(ctx.count - 1, ctx.index + 1);
        ctx.listRef.current?.scrollToIndex({ index: next, animated: true });
        ctx.setIndex(next);
        onPress?.();
      }}
      className={cn(
        'absolute right-2 top-1/2 z-10 h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90',
        disabled && 'opacity-40',
        className
      )}
    >
      <ChevronRight size={16} color={color} />
    </Pressable>
  );
}
