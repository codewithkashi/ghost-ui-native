import * as React from 'react';
import { Text, type TextProps } from './text';
import { cn } from '../../lib/utils';

export interface LabelProps extends TextProps {
  className?: string;
}

export function Label({ className, ...props }: LabelProps) {
  return (
    <Text
      accessibilityRole="text"
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
}
