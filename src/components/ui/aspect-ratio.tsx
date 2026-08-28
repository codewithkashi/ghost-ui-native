import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

type AspectRatioProps = ViewProps & {
  className?: string;
  ratio?: number;
  children?: React.ReactNode;
};

export function AspectRatio({
  className,
  ratio = 16 / 9,
  children,
  ...props
}: AspectRatioProps) {
  return (
    <View className={cn('relative w-full', className)} {...props}>
      <View style={{ paddingBottom: `${100 / ratio}%` }} />
      <View className="absolute inset-0">{children}</View>
    </View>
  );
}
