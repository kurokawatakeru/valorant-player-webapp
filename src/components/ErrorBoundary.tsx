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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              エラーが発生しました
            </h2>
            <p className="text-gray-600 mb-6">
              予期しないエラーが発生しました。ページを再読み込みするか、ホームに戻ってください。
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  エラーの詳細を表示
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-xs text-gray-700 overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                再読み込み
              </button>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 border border-gray-300 font-medium rounded-xl hover:bg-gray-50 transition-colors duration-200"
              >
                <Home className="w-4 h-4 mr-2" />
                ホームに戻る
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
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          データの取得に失敗しました
        </h3>
        <p className="text-gray-600 mb-6 text-sm">{error}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              再試行
            </button>
          )}
          {showHomeLink && (
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Home className="w-4 h-4 mr-2" />
              ホームに戻る
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
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 sm:p-8">
      <div className="flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          ネットワークエラー
        </h3>
        <p className="text-gray-600 mb-6 text-sm">
          インターネット接続を確認してください。問題が続く場合は、しばらく待ってから再試行してください。
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            再試行
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
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon || <AlertTriangle className="w-12 h-12 text-gray-400" />}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action}
    </div>
  );
};

export default ErrorBoundary;
