
import React, { useState } from 'react';
import { cleanText } from '../utils/text-processing';
import { CopyButton } from '../components/CopyButton';
import { ToolNavigation } from '../components/ToolNavigation';

export const TextCleaner: React.FC = () => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState({
    removeExtraSpaces: true,
    removeLineBreaks: false,
    trimWhitespace: true
  });

  const handleClean = () => {
    setText(cleanText(text, options));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste messy text with extra spaces, breaks etc..."
          className="w-full h-64 p-6 focus:outline-none resize-none custom-scrollbar text-lg text-slate-700"
        ></textarea>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={options.removeExtraSpaces}
                onChange={e => setOptions({...options, removeExtraSpaces: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Remove Extra Spaces</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={options.removeLineBreaks}
                onChange={e => setOptions({...options, removeLineBreaks: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Remove All Line Breaks</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={options.trimWhitespace}
                onChange={e => setOptions({...options, trimWhitespace: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Trim Start/End</span>
            </label>
          </div>
          
          <div className="flex justify-between items-center">
            <button 
              onClick={handleClean}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-semibold shadow-lg shadow-emerald-100"
            >
              Clean Text Now
            </button>
            <CopyButton text={text} />
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-900">
        <h4 className="font-bold mb-2">Usage Advice</h4>
        <p className="text-sm opacity-90 leading-relaxed">
          Cleaning text is essential before publishing to avoid invisible formatting errors. "Remove Extra Spaces" will convert multiple spaces into a single space, while "Remove Line Breaks" turns your text into a single continuous block.
        </p>
      </div>

      <ToolNavigation />
    </div>
  );
};
