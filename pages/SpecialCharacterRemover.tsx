
import React, { useState, useMemo } from 'react';
import { removeSpecialCharacters, countWords } from '../utils/text-processing';
import { CopyButton } from '../components/CopyButton';
import { ToolNavigation } from '../components/ToolNavigation';

export const SpecialCharacterRemover: React.FC = () => {
  const [text, setText] = useState('');
  
  const wordCount = useMemo(() => countWords(text), [text]);
  const isTooLong = wordCount > 500;

  const handleRemoveChars = () => {
    setText(removeSpecialCharacters(text));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-semibold text-slate-600">Special Character Remover</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              isTooLong ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {wordCount} / 500 Words
            </span>
          </div>
          <button 
            onClick={() => setText('')}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        </div>
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text with symbols, emojis, and special characters here..."
          className="w-full h-80 p-6 focus:outline-none resize-none custom-scrollbar text-lg text-slate-700"
        ></textarea>
        
        <div className="p-4 border-t border-slate-50 flex flex-wrap gap-2 items-center bg-slate-50/30">
          <button 
            onClick={handleRemoveChars} 
            disabled={!text.trim()}
            className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold shadow-lg shadow-slate-200"
          >
            Remove Special Characters
          </button>
          <div className="flex-1"></div>
          <CopyButton text={text} />
        </div>
      </div>

      {isTooLong && (
        <div className="p-4 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl text-sm flex items-center space-x-2 animate-in slide-in-from-top-2">
          <span>⚠️</span>
          <span className="font-semibold">Note: You are exceeding the recommended 500-word limit. The tool still works, but performance may vary with very large text blocks.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl">
          <h4 className="font-bold mb-3 text-blue-400">How it works?</h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            This utility scans your text and removes everything except alphanumeric characters (A-Z, 0-9) and spaces. It is ideal for cleaning data scraped from the web, removing unwanted formatting, or preparing text for URL slugs and coding identifiers.
          </p>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
          <h4 className="font-bold text-slate-800 mb-3">Common Use Cases</h4>
          <ul className="text-sm text-slate-500 space-y-2">
            <li className="flex items-center space-x-2">
              <span className="text-blue-500">✓</span>
              <span>Removing emojis and symbols from titles</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-blue-500">✓</span>
              <span>Cleaning messy CSV data or logs</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-blue-500">✓</span>
              <span>Stripping punctuation for word cloud input</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-blue-500">✓</span>
              <span>Preparing strings for database entry</span>
            </li>
          </ul>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};
