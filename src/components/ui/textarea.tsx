import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '../../lib/utils';
import { composeRefs, useKeyboardAwareFocus } from '../../lib/keyboard';

export interface TextareaProps extends TextInputProps {
  className?: string;
}

export const Textarea = React.forwardRef<TextInput, TextareaProps>(
  ({ className, placeholderTextColor, onFocus, ...props }, ref) => {
    const localRef = React.useRef<TextInput>(null);
    const handleFocus = useKeyboardAwareFocus(localRef, onFocus);

    return (
      <TextInput
        ref={composeRefs(localRef, ref)}
        multiline
        textAlignVertical="top"
        placeholderTextColor={placeholderTextColor ?? 'hsl(240 3.8% 46.1%)'}
        className={cn(
          'min-h-[96px] w-full rounded-xl border border-input bg-background px-4 py-3 text-base text-foreground shadow-sm',
          props.editable === false && 'opacity-50',
          className
        )}
        {...props}
        onFocus={handleFocus}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
