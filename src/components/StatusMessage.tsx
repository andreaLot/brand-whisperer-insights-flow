
import React from 'react';

interface StatusMessageProps {
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  loadingMessage?: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  isLoading,
  hasError,
  errorMessage = "Location search isn't working. Please try refreshing the page or enter manually.",
  loadingMessage = "Loading location search..."
}) => {
  if (isLoading) {
    return <div className="text-sm text-gray-500 mt-2">{loadingMessage}</div>;
  }

  if (hasError) {
    return <div className="text-sm text-red-500 mt-2">{errorMessage}</div>;
  }

  return null;
};

export default StatusMessage;
