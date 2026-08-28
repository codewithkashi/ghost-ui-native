import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const ghostTwMerge = extendTailwindMerge({
  extend: {
    theme: {
      // So text-primary-foreground correctly replaces text-foreground, etc.
      color: [
        'background',
        'foreground',
        'card',
        'card-foreground',
        'popover',
        'popover-foreground',
        'primary',
        'primary-foreground',
        'secondary',
        'secondary-foreground',
        'muted',
        'muted-foreground',
        'accent',
        'accent-foreground',
        'destructive',
        'destructive-foreground',
        'border',
        'input',
        'ring',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return ghostTwMerge(clsx(inputs));
}
