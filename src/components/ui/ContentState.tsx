import { ReactNode } from 'react';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';

type ContentStateProps = {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyMessage: string;
  loadingMessage?: string;
  className?: string;
  onRetry?: () => void;
  children: ReactNode;
};

export function ContentState({
  isLoading = false,
  error = null,
  isEmpty = false,
  emptyMessage,
  loadingMessage = 'Loading data...',
  className = 'py-10',
  onRetry,
  children
}: ContentStateProps) {
  if (isLoading) {
    return (
      <div className={`ui-state-block ${className}`} role="status" aria-live="polite">
        <Clock className="ui-state-icon animate-spin" aria-hidden="true" />
        <p className="ui-state-message">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`ui-state-block ${className}`} role="alert" aria-live="assertive">
        <AlertTriangle className="ui-state-icon" aria-hidden="true" />
        <p className="ui-state-message">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={`ui-state-block ${className}`} role="status" aria-live="polite">
        <Calendar className="ui-state-icon" aria-hidden="true" />
        <p className="ui-state-message">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
}
