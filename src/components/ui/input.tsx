import * as React from 'react';
import {
  Pressable,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { cn } from '../../lib/utils';
import { composeRefs, useKeyboardAwareFocus } from '../../lib/keyboard';
import { useGhostTheme } from '../../theme/theme';
import { Text } from './text';

export interface InputProps extends TextInputProps {
  className?: string;
  containerClassName?: string;
  error?: boolean;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      className,
      containerClassName,
      placeholderTextColor,
      error,
      helperText,
      startIcon,
      endIcon,
      secureTextEntry,
      editable,
      onFocus,
      ...props
    },
    ref
  ) => {
    const localRef = React.useRef<TextInput>(null);
    const handleFocus = useKeyboardAwareFocus(localRef, onFocus);
    const { resolvedTheme } = useGhostTheme();
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const isSecure = Boolean(secureTextEntry);
    const iconColor =
      resolvedTheme === 'dark' ? 'hsl(240 5% 64.9%)' : 'hsl(240 3.8% 46.1%)';

    const trailing =
      isSecure && !endIcon ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
          hitSlop={8}
          onPress={() => setPasswordVisible(v => !v)}
          className="pr-3"
        >
          {passwordVisible ? (
            <EyeOff size={18} color={iconColor} />
          ) : (
            <Eye size={18} color={iconColor} />
          )}
        </Pressable>
      ) : endIcon ? (
        <View className="pr-3">{endIcon}</View>
      ) : null;

    return (
      <View className={cn('w-full gap-1.5', containerClassName)}>
        <View
          className={cn(
            'h-11 w-full flex-row items-center rounded-xl border bg-background shadow-sm',
            error ? 'border-destructive' : 'border-input',
            editable === false && 'opacity-50'
          )}
        >
          {startIcon ? <View className="pl-3">{startIcon}</View> : null}
          <TextInput
            ref={composeRefs(localRef, ref)}
            placeholderTextColor={placeholderTextColor ?? 'hsl(240 3.8% 46.1%)'}
            secureTextEntry={isSecure && !passwordVisible}
            editable={editable}
            className={cn(
              'h-full flex-1 px-3 py-2 text-base text-foreground',
              startIcon && 'pl-2',
              !trailing && 'pr-3',
              className
            )}
            {...props}
            onFocus={handleFocus}
          />
          {trailing}
        </View>
        {helperText ? (
          <Text
            className={cn(
              'text-xs',
              error ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {helperText}
          </Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';
