import * as React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface TextProps extends RNTextProps {
  className?: string;
  children?: React.ReactNode;
}

export const Text = React.forwardRef<
  React.ComponentRef<typeof RNText>,
  TextProps
>(({ className, ...props }, ref) => (
  <RNText
    ref={ref}
    className={cn('text-base text-foreground', className)}
    {...props}
  />
));

Text.displayName = 'Text';
