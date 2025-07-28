import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700',
        className
      )}
      {...props}
    />
  );
}
