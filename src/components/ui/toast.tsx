import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';
import { Text } from './text';

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

type ToastContextValue = {
  toast: (input: Omit<ToastItem, 'id'>) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((input: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setItems(current => [...current, { ...input, id }]);
    setTimeout(() => {
      setItems(current => current.filter(item => item.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <View className="absolute bottom-10 left-4 right-4 z-50 gap-2" pointerEvents="box-none">
        {items.map(item => (
          <View
            key={item.id}
            className={cn(
              'rounded-xl border p-4 shadow-lg',
              item.variant === 'destructive'
                ? 'border-destructive bg-destructive'
                : 'border-border bg-card'
            )}
          >
            <Text
              className={cn(
                'text-sm font-semibold',
                item.variant === 'destructive'
                  ? 'text-destructive-foreground'
                  : 'text-card-foreground'
              )}
            >
              {item.title}
            </Text>
            {item.description ? (
              <Text
                className={cn(
                  'mt-1 text-sm',
                  item.variant === 'destructive'
                    ? 'text-destructive-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.description}
              </Text>
            ) : null}
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within GhostUIProvider');
  }
  return ctx;
}
