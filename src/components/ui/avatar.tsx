import * as React from 'react';
import { Image, View, type ImageProps, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

type AvatarProps = ViewProps & {
  className?: string;
  children?: React.ReactNode;
};

export function Avatar({ className, children, ...props }: AvatarProps) {
  return (
    <View
      className={cn(
        'relative h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-primary/20 bg-accent',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export function AvatarImage({ className, ...props }: ImageProps & { className?: string }) {
  return <Image className={cn('h-full w-full', className)} {...props} />;
}

export function AvatarFallback({
  className,
  children,
  ...props
}: ViewProps & { className?: string; children?: React.ReactNode }) {
  return (
    <View
      className={cn('h-full w-full items-center justify-center bg-primary/10', className)}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text className="text-sm font-semibold text-primary">{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}
