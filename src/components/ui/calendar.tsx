import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { useGhostTheme } from '../../theme/theme';
import { Text } from './text';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function startWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type CalendarContextValue = {
  month: number;
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  selected?: Date;
  onSelect?: (date: Date) => void;
};

const CalendarContext = React.createContext<CalendarContextValue | null>(null);

export function Calendar({
  selected,
  onSelect,
  defaultMonth,
  className,
  children,
  ...props
}: ViewProps & {
  className?: string;
  children?: React.ReactNode;
  selected?: Date;
  onSelect?: (date: Date) => void;
  defaultMonth?: Date;
}) {
  const initial = defaultMonth ?? selected ?? new Date();
  const [month, setMonth] = React.useState(initial.getMonth());
  const [year, setYear] = React.useState(initial.getFullYear());

  return (
    <CalendarContext.Provider
      value={{ month, year, setMonth, setYear, selected, onSelect }}
    >
      <View
        className={cn('rounded-xl border border-border bg-background p-3 shadow-sm', className)}
        {...props}
      >
        {children ?? <CalendarGrid />}
      </View>
    </CalendarContext.Provider>
  );
}

export function CalendarHeader({ className }: { className?: string }) {
  const ctx = React.useContext(CalendarContext)!;
  const { resolvedTheme } = useGhostTheme();
  const color =
    resolvedTheme === 'dark' ? 'hsl(0 0% 98%)' : 'hsl(240 10% 3.9%)';
  const label = new Date(ctx.year, ctx.month, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const prev = () => {
    if (ctx.month === 0) {
      ctx.setMonth(11);
      ctx.setYear(ctx.year - 1);
    } else ctx.setMonth(ctx.month - 1);
  };

  const next = () => {
    if (ctx.month === 11) {
      ctx.setMonth(0);
      ctx.setYear(ctx.year + 1);
    } else ctx.setMonth(ctx.month + 1);
  };

  return (
    <View className={cn('mb-3 flex-row items-center justify-between', className)}>
      <Pressable
        accessibilityRole="button"
        onPress={prev}
        className="h-8 w-8 items-center justify-center rounded-lg"
      >
        <ChevronLeft size={16} color={color} />
      </Pressable>
      <Text className="text-sm font-medium text-foreground">{label}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={next}
        className="h-8 w-8 items-center justify-center rounded-lg"
      >
        <ChevronRight size={16} color={color} />
      </Pressable>
    </View>
  );
}

export function CalendarGrid({ className }: { className?: string }) {
  const ctx = React.useContext(CalendarContext)!;
  const total = daysInMonth(ctx.year, ctx.month);
  const start = startWeekday(ctx.year, ctx.month);
  const cells: (number | null)[] = [
    ...Array.from({ length: start }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ];

  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <View className={className}>
      <CalendarHeader />
      <View className="mb-1 flex-row">
        {WEEKDAYS.map(day => (
          <View key={day} className="h-8 flex-1 items-center justify-center">
            <Text className="text-xs text-muted-foreground">{day}</Text>
          </View>
        ))}
      </View>
      <View className="flex-row flex-wrap">
        {cells.map((day, i) => (
          <View key={i} className="w-[14.28%] items-center py-0.5">
            {day != null ? (
              <CalendarDay day={day} />
            ) : (
              <View className="h-9 w-9" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function CalendarDay({ day }: { day: number }) {
  const ctx = React.useContext(CalendarContext)!;
  const date = new Date(ctx.year, ctx.month, day);
  const isSelected =
    ctx.selected &&
    ctx.selected.getFullYear() === date.getFullYear() &&
    ctx.selected.getMonth() === date.getMonth() &&
    ctx.selected.getDate() === date.getDate();

  const isToday = (() => {
    const now = new Date();
    return (
      now.getFullYear() === date.getFullYear() &&
      now.getMonth() === date.getMonth() &&
      now.getDate() === date.getDate()
    );
  })();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => ctx.onSelect?.(date)}
      className={cn(
        'h-9 w-9 items-center justify-center rounded-lg',
        isSelected && 'bg-primary',
        !isSelected && isToday && 'bg-accent'
      )}
    >
      <Text
        className={cn(
          'text-sm',
          isSelected ? 'text-primary-foreground' : 'text-foreground'
        )}
      >
        {day}
      </Text>
    </Pressable>
  );
}
