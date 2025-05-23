import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    shadow = 'md',
    hover = false,
    padding = 'md',
    children,
    ...props
  }, ref) => {
    const baseClasses = [
      'bg-white rounded-2xl transition-all duration-300'
    ];

    const variantClasses = {
      default: '',
      interactive: [
        'cursor-pointer transform hover:-translate-y-1 hover:scale-105',
        'active:scale-100 active:translate-y-0'
      ],
      gradient: 'bg-gradient-to-br from-white to-gray-50'
    };

    const shadowClasses = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    };

    const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

    const paddingClasses = {
      none: '',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12'
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      shadowClasses[shadow],
      hoverClasses,
      paddingClasses[padding],
      className
    );

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, action, children, ...props }, ref) => {
    const classes = cn('flex items-start justify-between mb-6', className);

    return (
      <div className={classes} ref={ref} {...props}>
        <div className="flex-1">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
          {children}
        </div>
        {action && (
          <div className="ml-4 flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Content Component
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    const classes = cn('', className);

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

// Card Footer Component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, justify = 'end', ...props }, ref) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between'
    };

    const classes = cn(
      'flex items-center mt-6 pt-6 border-t border-gray-100',
      justifyClasses[justify],
      className
    );

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };