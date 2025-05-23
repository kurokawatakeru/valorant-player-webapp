import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
      'transform active:scale-95 disabled:transform-none'
    ];

    const variantClasses = {
      primary: [
        'bg-gradient-to-r from-red-500 to-pink-500 text-white',
        'hover:from-red-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg',
        'focus:ring-red-500 shadow-md hover:shadow-xl'
      ],
      secondary: [
        'bg-gradient-to-r from-teal-500 to-cyan-500 text-white',
        'hover:from-teal-600 hover:to-cyan-600 hover:scale-105 hover:shadow-lg',
        'focus:ring-teal-500 shadow-md hover:shadow-xl'
      ],
      ghost: [
        'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
        'focus:ring-gray-500'
      ],
      danger: [
        'bg-red-600 text-white hover:bg-red-700 hover:scale-105',
        'focus:ring-red-500 shadow-md hover:shadow-lg'
      ],
      outline: [
        'border border-gray-300 text-gray-700 bg-white',
        'hover:bg-gray-50 hover:border-gray-400 hover:scale-105',
        'focus:ring-gray-500'
      ]
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm rounded-lg',
      md: 'px-4 py-2 text-sm rounded-xl',
      lg: 'px-6 py-3 text-base rounded-xl',
      xl: 'px-8 py-4 text-lg rounded-xl'
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' || size === 'xl' ? 'w-5 h-5' : 'w-4 h-4';

    return (
      <button
        className={classes}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className={cn(iconSize, 'mr-2 animate-spin')} />
            {children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={cn(iconSize, 'mr-2 flex-shrink-0')}>
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className={cn(iconSize, 'ml-2 flex-shrink-0')}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };