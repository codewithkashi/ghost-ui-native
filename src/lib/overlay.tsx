import * as React from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  type View as RNView,
} from 'react-native';
import { useGhostTheme } from '../theme/theme';

type BlurViewProps = {
  style?: object;
  blurType?: 'dark' | 'light' | 'xlight';
  blurAmount?: number;
  reducedTransparencyFallbackColor?: string;
};

type BlurViewComponent = React.ComponentType<BlurViewProps>;

let NativeBlurView: BlurViewComponent | null = null;
try {
  NativeBlurView = require('@react-native-community/blur').BlurView;
} catch {
  NativeBlurView = null;
}

export type AnchorLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function mergeEventHandlers<A extends unknown[]>(
  theirs?: (...args: A) => void,
  ours?: (...args: A) => void
) {
  if (!theirs) return ours;
  if (!ours) return theirs;
  return (...args: A) => {
    theirs(...args);
    ours(...args);
  };
}

export function useAnchorTrigger() {
  const triggerRef = React.useRef<RNView>(null);
  const [layout, setLayout] = React.useState<AnchorLayout | null>(null);

  const measure = React.useCallback((onMeasured?: (next: AnchorLayout) => void) => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const next = { x, y, width, height };
      setLayout(next);
      onMeasured?.(next);
    });
  }, []);

  return { triggerRef, layout, setLayout, measure };
}

export function getAnchoredPosition(
  layout: AnchorLayout,
  {
    gap = 4,
    maxHeight = 280,
  }: { gap?: number; maxHeight?: number } = {}
) {
  const windowHeight = Dimensions.get('window').height;
  const spaceBelow = windowHeight - (layout.y + layout.height + gap);
  const spaceAbove = layout.y - gap;
  const openAbove = spaceBelow < maxHeight && spaceAbove > spaceBelow;

  const top = openAbove
    ? Math.max(gap, layout.y - Math.min(maxHeight, spaceAbove))
    : layout.y + layout.height + gap;

  const height = openAbove
    ? Math.min(maxHeight, layout.y - gap)
    : Math.min(maxHeight, spaceBelow);

  return {
    top,
    left: layout.x,
    width: layout.width,
    maxHeight: Math.max(80, height),
    openAbove,
  };
}

export function DismissLayer({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      style={StyleSheet.absoluteFill}
      accessibilityRole="button"
      accessibilityLabel="Dismiss"
      onPress={onPress}
    />
  );
}

/** Blurred scrim for true modals only (dialog, sheet, drawer). */
export function OverlayBackdrop({
  onPress,
  intensity = 'light',
}: {
  onPress?: () => void;
  intensity?: 'light' | 'medium' | 'dark';
}) {
  const { resolvedTheme } = useGhostTheme();
  const blurType = resolvedTheme === 'dark' ? 'dark' : 'light';
  const tint =
    intensity === 'light' ? 0.08 : intensity === 'dark' ? 0.2 : 0.12;
  const blurAmount =
    intensity === 'light' ? 4 : intensity === 'dark' ? 10 : 6;

  const layers = (
    <>
      {NativeBlurView ? (
        <NativeBlurView
          style={StyleSheet.absoluteFill}
          blurType={blurType}
          blurAmount={blurAmount}
          reducedTransparencyFallbackColor={
            resolvedTheme === 'dark' ? '#09090b' : '#ffffff'
          }
        />
      ) : null}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: `rgba(0,0,0,${NativeBlurView ? tint * 0.5 : tint})` },
        ]}
      />
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={StyleSheet.absoluteFill}
        accessibilityRole="button"
        accessibilityLabel="Close overlay"
        onPress={onPress}
      >
        {layers}
      </Pressable>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {layers}
    </View>
  );
}
