import { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'w-full px-3 py-2 border rounded focus:outline-none focus:ring',
        className
      )}
      {...props}
    />
  );
}
