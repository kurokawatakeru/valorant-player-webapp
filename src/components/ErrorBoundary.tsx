import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0D1117] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#161B22] border-4 border-[#FF0040] shadow-[12px_12px_0_0_#000] p-8 text-center">
            <div className="w-16 h-16 bg-[#0D1117] border-4 border-[#FF0040] flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-[#FF0040]" />
            </div>
            <h2 className="font-pixel text-lg text-[#FF0040] mb-2">
              ERROR
            </h2>
            <p className="font-pixel-jp text-sm text-[#F0F6FC]/80 mb-6">
              予期しないエラーが発生しました
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="font-pixel text-xs text-[#00FFFF] cursor-pointer hover:text-[#FFFF00]">
                  DETAILS
                </summary>
                <pre className="mt-2 p-3 bg-[#0D1117] border-2 border-[#FF0040] font-pixel-jp text-xs text-[#F0F6FC] overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#FF0040] text-white font-pixel text-xs border-4 border-[#FFFF00] shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                RETRY
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-transparent text-[#00FFFF] font-pixel text-xs border-4 border-[#00FFFF] shadow-[6px_6px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#00FFFF] hover:text-[#0D1117] transition-all duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                HOME
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// API Error Display Component
interface ApiErrorProps {
  error: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
}

export const ApiError: React.FC<ApiErrorProps> = ({ error, onRetry, showHomeLink = true }) => {
  return (
    <div className="bg-[#161B22] border-4 border-[#FF0040] shadow-[8px_8px_0_0_#000] p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-[#0D1117] border-4 border-[#FF0040] flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-[#FF0040]" />
        </div>
        <h3 className="font-pixel text-sm text-[#FF0040] mb-2">
          FETCH ERROR
        </h3>
        <p className="font-pixel-jp text-xs text-[#F0F6FC]/80 mb-6">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#FF0040] text-white font-pixel text-xs border-4 border-[#FFFF00] shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              RETRY
            </button>
          )}
          {showHomeLink && (
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-transparent text-[#00FFFF] font-pixel text-xs border-4 border-[#00FFFF] shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-[#00FFFF] hover:text-[#0D1117] transition-all duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              HOME
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// Network Error Display
export const NetworkError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => {
  return (
    <div className="bg-[#161B22] border-4 border-[#FFFF00] shadow-[8px_8px_0_0_#000] p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-[#0D1117] border-4 border-[#FFFF00] flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-[#FFFF00]" />
        </div>
        <h3 className="font-pixel text-sm text-[#FFFF00] mb-2">
          NETWORK ERROR
        </h3>
        <p className="font-pixel-jp text-xs text-[#F0F6FC]/80 mb-6">
          インターネット接続を確認してください
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#FFFF00] text-[#0D1117] font-pixel text-xs border-4 border-[#000] shadow-[4px_4px_0_0_#000] hover:shadow-[2px_2px_0_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            RETRY
          </button>
        )}
      </div>
    </div>
  );
};

// Empty State Display
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action
}) => {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-[#161B22] border-4 border-[#FF0040] flex items-center justify-center mx-auto mb-6">
        {icon || <AlertTriangle className="w-10 h-10 text-[#FF0040]/50" />}
      </div>
      <h3 className="font-pixel text-sm text-[#FF0040] mb-2">{title}</h3>
      <p className="font-pixel-jp text-xs text-[#F0F6FC]/60 mb-6">{description}</p>
      {action}
    </div>
  );
};

export default ErrorBoundary;
