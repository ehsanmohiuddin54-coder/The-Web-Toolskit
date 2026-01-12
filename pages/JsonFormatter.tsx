
import React, { useState } from 'react';
import { formatJson, minifyJson } from '../utils/text-processing';
import { CopyButton } from '../components/CopyButton';
import { ToolNavigation } from '../components/ToolNavigation';

export const JsonFormatter: React.FC = () => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleFormat = (spaces: number) => {
    setError('');
    try {
      const formatted = formatJson(text, spaces);
      setText(formatted);
      setIsValid(true);
    } catch (err: any) {
      setError(err.message);
      setIsValid(false);
    }
  };

  const handleMinify = () => {
    setError('');
    try {
      const minified = minifyJson(text);
      setText(minified);
      setIsValid(true);
    } catch (err: any) {
      setError(err.message);
      setIsValid(false);
    }
  };

  const handleTextChange = (val: string) => {
    setText(val);
    if (!val.trim()) {
      setIsValid(null);
      setError('');
      return;
    }
    try {
      JSON.parse(val);
      setIsValid(true);
      setError('');
    } catch (e) {
      setIsValid(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-slate-600">JSON Editor</span>
            {isValid === true && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Valid JSON</span>}
            {isValid === false && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Invalid Format</span>}
          </div>
          <button 
            onClick={() => { setText(''); setIsValid(null); setError(''); }}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Paste your JSON string here..."
          className="w-full h-96 p-6 focus:outline-none resize-none custom-scrollbar font-mono text-sm text-slate-700"
          spellCheck={false}
        ></textarea>
        
        <div className="p-4 border-t border-slate-50 flex flex-wrap gap-2 items-center bg-slate-50/30">
          <button 
            onClick={() => handleFormat(2)} 
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium shadow-sm"
          >
            Beautify (2 Spaces)
          </button>
          <button 
            onClick={() => handleFormat(4)} 
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium shadow-sm"
          >
            Beautify (4 Spaces)
          </button>
          <button 
            onClick={handleMinify} 
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            Minify / Compact
          </button>
          <div className="flex-1"></div>
          <CopyButton text={text} />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center space-x-2 animate-in slide-in-from-top-2">
          <span>⚠️</span>
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <h4 className="font-bold text-indigo-900 mb-2">Why format JSON?</h4>
          <p className="text-sm text-indigo-800 opacity-90 leading-relaxed">
            Unformatted JSON is difficult for humans to read and debug. Beautifying it with spaces and indentation makes structures clear. Minifying it is great for reducing file sizes and API payload overhead.
          </p>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2">Real-time Validation</h4>
          <p className="text-sm text-slate-500 leading-relaxed">
            Our tool checks for syntax errors as you type. If your JSON is invalid, the "Invalid Format" badge will appear, helping you catch missing commas or unquoted keys instantly.
          </p>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};
