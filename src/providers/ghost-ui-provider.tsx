import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  View,
  type KeyboardAvoidingViewProps,
} from 'react-native';
import { GhostThemeProvider, useGhostTheme, type GhostTheme } from '../theme/theme';
import { ToastProvider } from '../components/ui/toast';

function ThemedRoot({
  children,
  keyboardAvoiding,
  keyboardBehavior,
  keyboardVerticalOffset,
}: {
  children?: React.ReactNode;
  keyboardAvoiding: boolean;
  keyboardBehavior: KeyboardAvoidingViewProps['behavior'];
  keyboardVerticalOffset: number;
}) {
  const { resolvedTheme } = useGhostTheme();
  const content = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={keyboardBehavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  ) : (
    children
  );

  return (
    <View
      className={`flex-1 bg-background ${resolvedTheme === 'dark' ? 'dark' : ''}`}
    >
      {content}
    </View>
  );
}

export function GhostUIProvider({
  children,
  defaultTheme = 'system',
  keyboardAvoiding = true,
  keyboardVerticalOffset = 0,
  keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height',
}: {
  children?: React.ReactNode;
  defaultTheme?: GhostTheme;
  /** When true (default), wraps the tree so focused inputs slide above the keyboard. */
  keyboardAvoiding?: boolean;
  keyboardVerticalOffset?: number;
  keyboardBehavior?: KeyboardAvoidingViewProps['behavior'];
}) {
  return (
    <GhostThemeProvider defaultTheme={defaultTheme}>
      <ToastProvider>
        <ThemedRoot
          keyboardAvoiding={keyboardAvoiding}
          keyboardBehavior={keyboardBehavior}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {children}
        </ThemedRoot>
      </ToastProvider>
    </GhostThemeProvider>
  );
}

export { useGhostTheme } from '../theme/theme';
export type { GhostTheme } from '../theme/theme';
