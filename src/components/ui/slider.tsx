import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

type SliderProps = ViewProps & {
  className?: string;
  value?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

/** Simple discrete slider without extra native deps. */
export function Slider({
  className,
  value = 0,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: SliderProps) {
  const clamped = Math.max(min, Math.min(max, value));
  const percent = ((clamped - min) / (max - min)) * 100;

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityValue={{ min, max, now: clamped }}
      className={cn('h-8 w-full justify-center', className)}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={event => {
        const width = event.currentTarget?.measure
          ? undefined
          : undefined;
        void width;
      }}
      onResponderRelease={event => {
        const { locationX } = event.nativeEvent;
        // Approximate using layout width via measureInWindow fallback handled below
        event.currentTarget.measure((_x, _y, w) => {
          if (!w) return;
          const raw = min + (locationX / w) * (max - min);
          const stepped = Math.round(raw / step) * step;
          onValueChange?.(Math.max(min, Math.min(max, stepped)));
        });
      }}
      {...props}
    >
      <View className="h-2 w-full rounded-full bg-secondary">
        <View
          className="h-2 rounded-full bg-primary"
          style={{ width: `${percent}%` }}
        />
      </View>
      <View
        className="absolute h-5 w-5 rounded-full border-2 border-primary bg-background"
        style={{ left: `${percent}%`, marginLeft: -10 }}
      />
    </View>
  );
}
