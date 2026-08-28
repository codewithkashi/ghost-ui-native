import * as React from 'react';
import {
  Pressable,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

type InputOTPContextValue = {
  value: string;
  setValue: (value: string) => void;
  maxLength: number;
  inputRef: React.RefObject<TextInput | null>;
};

const InputOTPContext = React.createContext<InputOTPContextValue | null>(null);

export function InputOTP({
  value = '',
  onChange,
  maxLength = 6,
  children,
}: {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  children?: React.ReactNode;
}) {
  const inputRef = React.useRef<TextInput>(null);
  const [internal, setInternal] = React.useState(value);
  const current = onChange ? value : internal;

  const setValue = (next: string) => {
    const cleaned = next.replace(/\D/g, '').slice(0, maxLength);
    if (onChange) onChange(cleaned);
    else setInternal(cleaned);
  };

  React.useEffect(() => {
    if (onChange && value !== internal) setInternal(value);
  }, [value, onChange, internal]);

  return (
    <InputOTPContext.Provider
      value={{ value: current, setValue, maxLength, inputRef }}
    >
      <Pressable onPress={() => inputRef.current?.focus()} className="relative">
        <TextInput
          ref={inputRef}
          value={current}
          onChangeText={setValue}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          maxLength={maxLength}
          className="absolute h-0 w-0 opacity-0"
        />
        <View className="flex-row items-center gap-2">{children}</View>
      </Pressable>
    </InputOTPContext.Provider>
  );
}

export function InputOTPGroup({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View className={cn('flex-row items-center gap-2', className)} {...props}>
      {children}
    </View>
  );
}

export function InputOTPSlot({
  index,
  className,
}: {
  index: number;
  className?: string;
}) {
  const ctx = React.useContext(InputOTPContext)!;
  const char = ctx.value[index] ?? '';
  const isActive = ctx.value.length === index;

  return (
    <View
      className={cn(
        'h-10 w-10 items-center justify-center rounded-xl border border-input bg-background shadow-sm',
        isActive && 'border-ring',
        className
      )}
    >
      <Text className="text-base text-foreground">{char}</Text>
    </View>
  );
}

export function InputOTPSeparator({ className }: { className?: string }) {
  return (
    <View className={cn('px-1', className)}>
      <Text className="text-muted-foreground">-</Text>
    </View>
  );
}

export function InputOTPInput(props: TextInputProps) {
  const ctx = React.useContext(InputOTPContext)!;
  return (
    <TextInput
      ref={ctx.inputRef}
      value={ctx.value}
      onChangeText={ctx.setValue}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      autoComplete="sms-otp"
      maxLength={ctx.maxLength}
      className="absolute h-0 w-0 opacity-0"
      {...props}
    />
  );
}
