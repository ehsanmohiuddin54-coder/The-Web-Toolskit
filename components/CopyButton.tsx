
import React, { useState } from 'react';

interface CopyButtonProps {
  text: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        copied 
        ? 'bg-green-100 text-green-700' 
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      <span>{copied ? '✅ Copied!' : '📋 Copy Text'}</span>
    </button>
  );
};
