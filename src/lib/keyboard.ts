import * as React from 'react';
import {
  Keyboard,
  Platform,
  type NativeSyntheticEvent,
  type TextInput,
  type TextInputFocusEventData,
} from 'react-native';

/** After focus, nudge layout once the keyboard is visible so parents can avoid it. */
export function useKeyboardAwareFocus(
  inputRef: React.RefObject<TextInput | null>,
  onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void
) {
  return React.useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onFocus?.(e);

      const eventName =
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';

      const sub = Keyboard.addListener(eventName, () => {
        sub.remove();
        // Remeasure so KeyboardAvoidingView / scroll parents adjust to the focused field.
        inputRef.current?.measure(() => {});
      });

      setTimeout(() => sub.remove(), 800);
    },
    [inputRef, onFocus]
  );
}

export function composeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}
