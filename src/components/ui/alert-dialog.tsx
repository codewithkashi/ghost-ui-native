import * as React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';

export function AlertDialog(props: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />;
}

export const AlertDialogTrigger = DialogTrigger;
export const AlertDialogContent = DialogContent;
export const AlertDialogHeader = DialogHeader;
export const AlertDialogFooter = DialogFooter;
export const AlertDialogTitle = DialogTitle;
export const AlertDialogDescription = DialogDescription;
export const AlertDialogCancel = DialogClose;

export function AlertDialogAction({
  children,
  onPress,
}: {
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <DialogClose>
      <Button onPress={onPress}>{children ?? 'Continue'}</Button>
    </DialogClose>
  );
}
