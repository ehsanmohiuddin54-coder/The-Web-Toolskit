
import React, { useState } from 'react';
import { CopyButton } from '../components/CopyButton';
import { ToolNavigation } from '../components/ToolNavigation';

export const MetaGenerator: React.FC = () => {
  const [meta, setMeta] = useState({
    title: 'Your Epic Page Title Here',
    description: 'Provide a clear, concise description of your page content for users and search engines to understand your value proposition.',
    keywords: 'seo, utilities, free tools',
    author: 'Admin',
    robots: 'index, follow'
  });

  const generatedHtml = `<!-- Primary Meta Tags -->
<title>${meta.title}</title>
<meta name="title" content="${meta.title}">
<meta name="description" content="${meta.description}">
<meta name="keywords" content="${meta.keywords}">
<meta name="author" content="${meta.author}">
<meta name="robots" content="${meta.robots}">`;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-50 pb-4">Meta Editor</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block">Page Title ({meta.title.length})</label>
              <input 
                type="text" 
                value={meta.title}
                onChange={e => setMeta({...meta, title: e.target.value})}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:outline-none transition-all ${
                  meta.title.length > 60 ? 'border-amber-400 focus:ring-amber-200' : 'border-slate-200 focus:ring-blue-200'
                }`}
              />
              <p className="text-xs text-slate-400">Optimal: 50-60 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block">Meta Description ({meta.description.length})</label>
              <textarea 
                rows={4}
                value={meta.description}
                onChange={e => setMeta({...meta, description: e.target.value})}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:outline-none transition-all resize-none ${
                  meta.description.length > 160 ? 'border-amber-400 focus:ring-amber-200' : 'border-slate-200 focus:ring-blue-200'
                }`}
              />
              <p className="text-xs text-slate-400">Optimal: 150-160 characters</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 block">Keywords</label>
                <input 
                  type="text" 
                  value={meta.keywords}
                  onChange={e => setMeta({...meta, keywords: e.target.value})}
                  placeholder="keyword1, keyword2"
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 block">Robots</label>
                <select 
                  value={meta.robots}
                  onChange={e => setMeta({...meta, robots: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:outline-none bg-white"
                >
                  <option value="index, follow">Index, Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">HTML Output</span>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedHtml)}
                className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Copy HTML
              </button>
            </div>
            <pre className="text-blue-300 text-xs overflow-x-auto font-mono whitespace-pre-wrap leading-relaxed">
              {generatedHtml}
            </pre>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 border-b border-slate-50 pb-4 mb-6">Google Preview</h3>
            
            <div className="max-w-lg space-y-1">
              <div className="text-sm text-[#202124] mb-1 flex items-center">
                https://example.com <span className="text-xs text-slate-400 ml-2">▼</span>
              </div>
              <h4 className="text-[#1a0dab] text-xl font-normal hover:underline cursor-pointer mb-1 leading-tight">
                {meta.title}
              </h4>
              <p className="text-[#4d5156] text-sm leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {meta.description}
              </p>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
             <h4 className="font-bold text-amber-900 mb-2">SEO Checklist</h4>
             <ul className="space-y-2 text-sm text-amber-800">
               <li className="flex gap-2">
                 <span className={meta.title.length >= 40 && meta.title.length <= 60 ? 'text-green-600' : 'text-amber-500'}>
                   {meta.title.length >= 40 && meta.title.length <= 60 ? '✓' : '○'}
                 </span>
                 Title length is between 40-60 characters
               </li>
               <li className="flex gap-2">
                 <span className={meta.description.length >= 140 && meta.description.length <= 160 ? 'text-green-600' : 'text-amber-500'}>
                  {meta.description.length >= 140 && meta.description.length <= 160 ? '✓' : '○'}
                 </span>
                 Description length is between 140-160 characters
               </li>
               <li className="flex gap-2">
                 <span className={meta.keywords.split(',').length >= 3 ? 'text-green-600' : 'text-amber-500'}>
                  {meta.keywords.split(',').length >= 3 ? '✓' : '○'}
                 </span>
                 Has at least 3 relevant keywords
               </li>
             </ul>
          </div>
        </div>
      </div>

      <ToolNavigation />
    </div>
  );
};
