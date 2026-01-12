
import React, { useState, useMemo } from 'react';
import { getKeywordDensity } from '../utils/text-processing';
import { ToolNavigation } from '../components/ToolNavigation';

export const KeywordDensity: React.FC = () => {
  const [text, setText] = useState('');
  
  const keywords = useMemo(() => {
    return getKeywordDensity(text);
  }, [text]);

  const totalWords = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <span className="text-sm font-semibold text-slate-600">Text Input</span>
            <span className="text-xs text-slate-400">{totalWords} words processed</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content to analyze keyword distribution..."
            className="w-full h-80 p-6 focus:outline-none resize-none custom-scrollbar text-base text-slate-700"
          ></textarea>
        </div>

        <div className="w-full lg:w-80 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col max-h-[400px] lg:max-h-80">
          <div className="p-4 border-b border-slate-50 bg-slate-50/50">
            <h3 className="text-sm font-semibold text-slate-600">Density Analysis</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {keywords.length > 0 ? (
              <table className="w-full text-left">
                <thead className="text-xs uppercase bg-slate-50 text-slate-500 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 font-medium">Word</th>
                    <th className="px-4 py-2 font-medium">Freq</th>
                    <th className="px-4 py-2 font-medium text-right">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {keywords.map((kw, i) => (
                    <tr key={kw.word + i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{kw.word}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{kw.count}</td>
                      <td className="px-4 py-3 text-sm text-slate-900 font-semibold text-right">{kw.density}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400 text-sm">
                No keywords analyzed yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2">Ideal Density</h4>
          <p className="text-sm text-slate-500 leading-relaxed">Most SEO experts recommend a keyword density of around 1% to 2% to avoid keyword stuffing penalties.</p>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2">LSI Keywords</h4>
          <p className="text-sm text-slate-500 leading-relaxed">Search engines look for related terms, not just the exact keyword. Use synonyms to improve context.</p>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <h4 className="font-bold text-slate-800 mb-2">Word Length</h4>
          <p className="text-sm text-slate-500 leading-relaxed">We filter out words with less than 3 characters (like 'a', 'in', 'of') to focus on meaningful content.</p>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};
