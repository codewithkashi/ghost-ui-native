import * as React from 'react';
import { View, type ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Avatar, AvatarFallback } from './avatar';
import { Bubble } from './bubble';
import { Text } from './text';

const messageVariants = cva('mb-3 w-full flex-row gap-2', {
  variants: {
    role: {
      user: 'justify-end',
      assistant: 'justify-start',
      system: 'justify-center',
    },
  },
  defaultVariants: { role: 'assistant' },
});

export function Message({
  className,
  role,
  children,
  ...props
}: ViewProps &
  VariantProps<typeof messageVariants> & {
    className?: string;
    children?: React.ReactNode;
  }) {
  return (
    <View className={cn(messageVariants({ role }), className)} {...props}>
      {children}
    </View>
  );
}

export function MessageAvatar({
  fallback,
  className,
}: {
  fallback: string;
  className?: string;
}) {
  return (
    <Avatar className={cn('h-8 w-8', className)}>
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

export function MessageContent({
  className,
  role = 'assistant',
  children,
}: {
  className?: string;
  role?: 'user' | 'assistant' | 'system';
  children?: React.ReactNode;
}) {
  if (role === 'system') {
    return (
      <View className={cn('max-w-full items-center', className)}>
        {typeof children === 'string' ? (
          <View className="rounded-full border border-border bg-accent px-3 py-1">
            <Text className="text-xs font-medium text-accent-foreground">
              {children}
            </Text>
          </View>
        ) : (
          children
        )}
      </View>
    );
  }

  return (
    <Bubble
      variant={role === 'user' ? 'sent' : 'received'}
      className={className}
    >
      {children}
    </Bubble>
  );
}

export function MessageFooter({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text className={cn('mt-1 text-xs text-muted-foreground', className)} {...props}>
      {children}
    </Text>
  );
}
