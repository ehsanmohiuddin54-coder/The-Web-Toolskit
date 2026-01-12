
import React from 'react';
import { Link } from 'react-router-dom';

const toolCategories = [
  {
    name: 'SEO & Marketing',
    icon: '🚀',
    tools: [
      {
        title: 'Keyword Density',
        desc: 'Detect keyword stuffing and optimize relevance.',
        icon: '📊',
        path: '/keyword-density',
        color: 'bg-orange-50 text-orange-600',
        badge: 'SEO'
      },
      {
        title: 'Meta Tag Generator',
        desc: 'Perfect your Google and social media snippets.',
        icon: '🏷️',
        path: '/meta-generator',
        color: 'bg-rose-50 text-rose-600',
        badge: 'Tags'
      }
    ]
  },
  {
    name: 'Text Refinement',
    icon: '✍️',
    tools: [
      {
        title: 'Word Counter',
        desc: 'Deep metrics for words, chars, and paragraphs.',
        icon: '🔢',
        path: '/word-counter',
        color: 'bg-blue-50 text-blue-600',
        badge: 'Core'
      },
      {
        title: 'Case Converter',
        desc: 'Instant Title, Sentence, and Uppercase transforms.',
        icon: '🔠',
        path: '/case-converter',
        color: 'bg-purple-50 text-purple-600',
        badge: 'Utility'
      },
      {
        title: 'Text Cleaner',
        desc: 'Remove extra spaces and messy formatting.',
        icon: '🧹',
        path: '/text-cleaner',
        color: 'bg-emerald-50 text-emerald-600',
        badge: 'Clean'
      },
      {
        title: 'Char Remover',
        desc: 'Strip symbols and preserve alphanumeric text.',
        icon: '🚫',
        path: '/char-remover',
        color: 'bg-slate-100 text-slate-600',
        badge: 'Filter'
      }
    ]
  },
  {
    name: 'Specialized Utilities',
    icon: '🛠️',
    tools: [
      {
        title: 'JSON Formatter',
        desc: 'Validate and beautify JSON data instantly.',
        icon: '📦',
        path: '/json-formatter',
        color: 'bg-indigo-50 text-indigo-600',
        badge: 'Dev'
      },
      {
        title: 'GPA Calculator',
        desc: 'Student-grade GPA calculation on a 4.0 scale.',
        icon: '🎓',
        path: '/gpa-calculator',
        color: 'bg-cyan-50 text-cyan-600',
        badge: 'School'
      }
    ]
  }
];

export const Home: React.FC = () => {
  return (
    <div className="space-y-24 animate-in fade-in duration-700 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-100 shadow-sm">
          <span>100% Client-Side Processing</span>
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.05] tracking-tight">
          Every Professional Tool <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            One Single Toolkit.
          </span>
        </h1>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Stop using tools that steal your data. **SEO & Text Toolkit** runs entirely in your browser. Fast, private, and powerful utilities for the modern web.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/word-counter" className="px-10 py-5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center space-x-2 text-lg">
            <span>Explore Tools</span>
            <span>→</span>
          </Link>
          <Link to="/signup" className="px-10 py-5 bg-white text-slate-900 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition-all text-lg">
            Get Started Free
          </Link>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute top-20 -right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
      </section>

      {/* Feature Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
         {[
           { title: 'Privacy First', desc: 'No data is ever sent to a server. Your text remains on your device.', icon: '🛡️' },
           { title: 'Zero Latency', desc: 'Instant calculations powered by your local hardware.', icon: '⚡' },
           { title: 'SEO Optimized', desc: 'Industry-standard algorithms for ranking analysis.', icon: '📈' }
         ].map((feature, i) => (
           <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white shadow-lg shadow-slate-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
           </div>
         ))}
      </section>

      {/* Categorized Tools */}
      {toolCategories.map((cat, idx) => (
        <section key={idx} className="space-y-8 max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              {cat.icon}
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{cat.name}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cat.tools.map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:rotate-6`}>
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-3 py-1 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{tool.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{tool.desc}</p>
                <div className="flex items-center text-indigo-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Open Tool</span>
                  <span className="ml-2">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Modern Call to Action / Info Block */}
      <section className="bg-slate-900 rounded-[3.5rem] p-12 md:p-20 text-white overflow-hidden relative shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black leading-tight italic">
              Speed & Privacy <br/>
              Without Compromise.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Why use legacy tools that require account creation and tracking? The **SEO & Text Toolkit** provides a sanitized, isolated workspace for your sensitive content analysis.
            </p>
            <div className="flex gap-4">
              <div className="flex -space-x-3 overflow-hidden">
                {[1,2,3,4].map(i => (
                  <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center text-[10px] font-bold">U{i}</div>
                ))}
              </div>
              <div className="text-sm">
                 <div className="font-bold">Trusted by Thousands</div>
                 <div className="text-slate-500">Processing millions of words daily</div>
              </div>
            </div>
          </div>
          <div className="bg-indigo-600/10 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 space-y-6">
             <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
             </div>
             <div className="space-y-4">
               <div className="h-2 w-full bg-white/20 rounded-full"></div>
               <div className="h-2 w-3/4 bg-white/20 rounded-full"></div>
               <div className="h-2 w-5/6 bg-white/20 rounded-full"></div>
               <div className="h-32 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center italic text-indigo-300 text-sm p-4 text-center">
                 Everything stays in your browser cache. Secure. Fast. Isolated.
               </div>
             </div>
             <div className="flex justify-between items-center">
                <div className="h-10 w-32 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-900/40"></div>
                <div className="h-8 w-8 bg-white/10 rounded-lg"></div>
             </div>
          </div>
        </div>
        
        {/* Abstract pattern bg */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-large" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-large)" />
          </svg>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="max-w-4xl mx-auto text-center py-10">
        <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.3em] mb-4">The Toolkit Standard</h2>
        <p className="text-slate-500 text-lg leading-relaxed mb-10 italic">
          "Whether you are writing a technical blog post, optimizing a landing page for SEO, or just cleaning up messy developer logs, our toolkit provides the precision and privacy you deserve."
        </p>
        <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale group hover:grayscale-0 transition-all">
           <div className="text-xl font-black tracking-tighter">WRITER.co</div>
           <div className="text-xl font-black tracking-tighter">DEV.log</div>
           <div className="text-xl font-black tracking-tighter">MARKETER</div>
           <div className="text-xl font-black tracking-tighter">ACADEMIA</div>
        </div>
      </section>
    </div>
  );
};
