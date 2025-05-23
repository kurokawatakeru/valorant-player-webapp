import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  overlay?: boolean;
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  overlay = false,
  text,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-red-500',
    secondary: 'text-teal-500',
    white: 'text-white',
    gray: 'text-gray-400'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinnerClasses = cn(
    'animate-spin',
    sizeClasses[size],
    colorClasses[color],
    className
  );

  const content = (
    <div className="flex flex-col items-center space-y-3">
      <Loader2 className={spinnerClasses} />
      {text && (
        <p className={cn('font-medium', colorClasses[color], textSizeClasses[size])}>
          {text}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Page Loading Component
export interface PageLoadingProps {
  title?: string;
  description?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({ 
  title = "読み込み中...", 
  description 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600 max-w-md mx-auto">{description}</p>
          )}
        </div>
        
        {/* Loading Progress Bar */}
        <div className="w-64 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loading Components
export interface SkeletonProps {
  className?: string;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  if (lines === 1) {
    return <div className={cn(baseClasses, className)} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={cn(
            baseClasses,
            index === lines - 1 ? 'w-3/4' : 'w-full',
            'h-4',
            className
          )}
        />
      ))}
    </div>
  );
};

// Card Skeleton
const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex space-x-2 mt-4">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

// Player Card Skeleton
const PlayerCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-24"></div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="h-3 bg-gray-200 rounded mb-1"></div>
          <div className="h-5 bg-gray-200 rounded"></div>
        </div>
        <div className="text-center">
          <div className="h-3 bg-gray-200 rounded mb-1"></div>
          <div className="h-5 bg-gray-200 rounded"></div>
        </div>
        <div className="text-center">
          <div className="h-3 bg-gray-200 rounded mb-1"></div>
          <div className="h-5 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Loading States for Different Components
export const LoadingStates = {
  Button: ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => (
    <LoadingSpinner size={size} color="white" />
  ),
  
  Page: PageLoading,
  
  Card: CardSkeleton,
  
  PlayerCard: PlayerCardSkeleton,
  
  Text: ({ lines = 3 }: { lines?: number }) => (
    <Skeleton lines={lines} />
  ),
  
  Avatar: ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16'
    };
    return (
      <div className={cn('bg-gray-200 rounded-full animate-pulse', sizeClasses[size])} />
    );
  },
  
  Chart: () => (
    <div className="w-full h-64 bg-gray-200 rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    </div>
  ),
  
  List: ({ items = 5 }: { items?: number }) => (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
};

export { LoadingSpinner, PageLoading, Skeleton, CardSkeleton, PlayerCardSkeleton };