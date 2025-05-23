import React from 'react';
import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority'; // cvaをインポート
import { cn } from '@/lib/utils';

// buttonVariantsを定義
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95 disabled:transform-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg focus:ring-primary', // shadcn/uiのデフォルトスタイルに近づける
        primary:
          'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 hover:scale-105 hover:shadow-lg focus:ring-red-500 shadow-md hover:shadow-xl',
        secondary:
          'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 hover:scale-105 hover:shadow-lg focus:ring-teal-500 shadow-md hover:shadow-xl',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg focus:ring-destructive', // shadcn/uiのスタイルに近づける
        danger: // destructiveと重複するが、既存の定義を残す場合
          'bg-red-600 text-white hover:bg-red-700 hover:scale-105 focus:ring-red-500 shadow-md hover:shadow-lg',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-ring', // shadcn/uiのスタイルに近づける
        ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-ring', // shadcn/uiのスタイルに近づける
        link: 'text-primary underline-offset-4 hover:underline focus:ring-primary', // shadcn/uiのスタイルに近づける
      },
      size: {
        default: 'h-10 px-4 py-2', // shadcn/uiのデフォルトサイズ
        sm: 'h-9 rounded-md px-3',    // shadcn/uiのsmサイズ
        md: 'h-10 px-4 py-2', // 既存のmdをdefaultとして扱うか、別途定義
        lg: 'h-11 rounded-md px-8',    // shadcn/uiのlgサイズ
        xl: 'px-8 py-4 text-lg rounded-xl', // カスタムサイズとして残す
        icon: 'h-10 w-10', // shadcn/uiのiconサイズ
      },
    },
    defaultVariants: {
      variant: 'default', // shadcn/uiのデフォルトvariant
      size: 'default',    // shadcn/uiのデフォルトsize
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { // VariantPropsを適用
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean; // shadcn/uiのasChildプロパティ
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant, // VariantPropsから取得
    size,    // VariantPropsから取得
    loading = false,
    disabled,
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    asChild = false, // asChildのデフォルト値
    ...props
  }, ref) => {
    const Comp = asChild ? React.Fragment : 'button'; // asChildがtrueならFragment、そうでなければbutton

    const iconSizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' || size === 'xl' ? 'w-5 h-5' : 'w-4 h-4';


    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), fullWidth && 'w-full')}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className={cn(iconSizeClass, 'mr-2 animate-spin')} />
            {children}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className={cn(iconSizeClass, 'mr-2 flex-shrink-0')}>
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className={cn(iconSizeClass, 'ml-2 flex-shrink-0')}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants }; // buttonVariantsをエクスポート