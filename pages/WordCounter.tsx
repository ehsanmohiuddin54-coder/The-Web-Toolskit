
import React, { useState, useEffect } from 'react';
import { countWords, countCharacters, countSentences, countParagraphs } from '../utils/text-processing';
import { ToolNavigation } from '../components/ToolNavigation';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({ words: 0, characters: 0, sentences: 0, paragraphs: 0 });

  useEffect(() => {
    setStats({
      words: countWords(text),
      characters: countCharacters(text),
      sentences: countSentences(text),
      paragraphs: countParagraphs(text)
    });
  }, [text]);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Words', value: stats.words, icon: '📝' },
          { label: 'Characters', value: stats.characters, icon: '🔤' },
          { label: 'Sentences', value: stats.sentences, icon: '💬' },
          { label: 'Paragraphs', value: stats.paragraphs, icon: '📄' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <span className="text-sm font-semibold text-slate-600">Editor</span>
          <button 
            onClick={() => setText('')}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear Text
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here to start counting..."
          className="w-full h-80 p-6 focus:outline-none resize-none custom-scrollbar text-lg text-slate-700 placeholder:text-slate-300"
        ></textarea>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm flex items-start gap-3">
        <span className="text-lg">💡</span>
        <p>Tip: For the best SEO results, aim for a meta description between 150-160 characters and blog posts over 1,000 words.</p>
      </div>

      <ToolNavigation />
    </div>
  );
};
