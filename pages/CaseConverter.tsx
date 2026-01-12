
import React, { useState } from 'react';
import { toSentenceCase, toTitleCase } from '../utils/text-processing';
import { CopyButton } from '../components/CopyButton';
import { ToolNavigation } from '../components/ToolNavigation';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('');

  const convert = (type: 'upper' | 'lower' | 'sentence' | 'title') => {
    if (!text) return;
    let result = '';
    switch(type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'sentence': result = toSentenceCase(text); break;
      case 'title': result = toTitleCase(text); break;
    }
    setText(result);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full h-64 p-6 focus:outline-none resize-none custom-scrollbar text-lg text-slate-700"
        ></textarea>
        
        <div className="p-4 border-t border-slate-50 flex flex-wrap gap-2 items-center bg-slate-50/30">
          <button onClick={() => convert('upper')} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium">UPPERCASE</button>
          <button onClick={() => convert('lower')} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium">lowercase</button>
          <button onClick={() => convert('sentence')} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium">Sentence case</button>
          <button onClick={() => convert('title')} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-black transition-colors text-sm font-medium">Title Case</button>
          <div className="flex-1"></div>
          <CopyButton text={text} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-slate-100 rounded-xl">
            <h4 className="font-bold text-slate-800 mb-1">Sentence Case</h4>
            <p className="text-sm text-slate-500">Capitalizes the first letter of each sentence and lowers everything else.</p>
        </div>
        <div className="p-4 bg-white border border-slate-100 rounded-xl">
            <h4 className="font-bold text-slate-800 mb-1">Title Case</h4>
            <p className="text-sm text-slate-500">Capitalizes the first letter of every word (ideal for blog titles).</p>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};
