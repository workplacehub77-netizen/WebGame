import React from 'react';

interface LoadingIndicatorProps {
  text?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text = "Consulting the oracles..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 animate-pulse">
      <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-amber-500 text-lg font-serif italic">{text}</p>
    </div>
  );
};

export default LoadingIndicator;